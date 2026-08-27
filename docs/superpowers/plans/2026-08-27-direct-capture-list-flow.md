# Direct Capture to Daily List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make web entry and browser selection capture append directly to the current local-date List, remove the review gate and visible inbox, migrate legacy captures safely, and surface retryable sanitized errors.

**Architecture:** Put List selection, duplicate enforcement, and atomic writes in `EnglishReviewRepository`, then expose one application service used by both the React capture page and MV3 service worker. Run an idempotent legacy-capture migration from application startup, keep the old IndexedDB table only for compatibility, and map thrown failures to a small safe error contract before they reach either UI.

**Tech Stack:** React 19, TypeScript, Dexie/IndexedDB, React Router 7, Chrome/Edge Manifest V3, Vitest, Testing Library, Playwright, Vite.

---

## File map

- Create `src/capture/daily-list-service.ts`: shared direct-save orchestration and capture-to-entry conversion.
- Create `src/capture/daily-list-service.test.ts`: service duplicate and success contract tests.
- Create `src/capture/capture-to-entry.ts`: pure conversion shared by direct saves and legacy migration.
- Create `src/capture/capture-error.ts`: safe error classification and detail formatting.
- Create `src/capture/capture-error.test.ts`: secret redaction and status mapping tests.
- Create `src/db/legacy-capture-migration.ts`: application-start migration entry point.
- Create `src/db/legacy-capture-migration.test.ts`: successful, rollback, retry, and malformed-record tests.
- Modify `src/db/repository.ts`: atomic daily append, duplicate outcome, and legacy migration transaction.
- Modify `src/db/repository.test.ts`: daily append, duplicate override, review-node, and migration coverage.
- Modify `src/capture/model.ts`: typed save success/failure messages with List identity and safe error detail.
- Modify `src/extension/background-service.ts`: write to today’s List through the shared service.
- Modify `src/extension/background-service.test.ts`: local date, duplicate, and sanitized failure behavior.
- Modify `src/extension/background.ts`: initialize migration and return safe message failures.
- Modify `src/extension/capture-overlay.ts`: direct-save copy, retry, copied diagnostics, and success feedback.
- Modify `src/extension/capture-overlay.test.ts`: direct List confirmation and error interactions.
- Modify `src/features/capture/CaptureRoute.tsx`: remove the due-review gate and inject shared save behavior.
- Delete `src/features/capture/CaptureGate.tsx` and `src/features/capture/CaptureGate.test.tsx`: obsolete restriction.
- Modify `src/features/capture/CapturePage.tsx` and test: duplicate confirmation, List-number success, and retryable errors.
- Modify `src/features/today/TodayPage.tsx`, `useTodayState.ts`, and tests: always expose capture; remove inbox state.
- Modify `src/app/App.tsx` and route tests: redirect legacy `/inbox` URL to `/`.
- Delete `src/features/inbox/InboxPage.tsx`, `InboxPage.test.tsx`, and `InboxRoute.tsx`: remove visible inbox feature.
- Modify `src/features/review/ReviewRoute.tsx` and test: history review never completes a schedule node.
- Modify `src/main.tsx`: invoke the safe legacy migration during web-app startup.
- Modify `src/ui/theme.css` and UI tests: style the secondary capture action and error details without adding cards.
- Modify `scripts/verify-extension.mjs`: assert obsolete inbox copy is absent from the built app.

### Task 1: Atomic daily List repository API

**Files:**
- Modify: `src/db/repository.ts`
- Modify: `src/db/repository.test.ts`

- [ ] **Step 1: Write failing repository tests for one daily List and duplicate enforcement**

Add tests that call a new `appendToDailyList` API twice on the same date, verify one List and one set of six review nodes, reject a duplicate found in any List, and allow it only with an explicit override:

```ts
it('appends to one daily List and creates review nodes once', async () => {
  const first = await repo.appendToDailyList('2026-08-27', [entryDraft('retain')], false);
  const second = await repo.appendToDailyList('2026-08-27', [entryDraft('subtle')], false);

  expect(first).toMatchObject({ ok: true, list: { listNumber: 1 } });
  expect(second).toMatchObject({ ok: true, list: { id: first.ok && first.list.id } });
  expect(await db.lists.count()).toBe(1);
  expect(await db.entries.count()).toBe(2);
  expect(await db.reviewNodes.count()).toBe(6);
});

it('requires an explicit override for an existing normalized value', async () => {
  await repo.appendToDailyList('2026-08-26', [entryDraft('Retain')], false);
  const blocked = await repo.appendToDailyList('2026-08-27', [entryDraft('  retain  ')], false);

  expect(blocked).toEqual({ ok: false, code: 'DUPLICATE', duplicates: [{ listId: expect.any(String), listNumber: 1, normalizedEnglish: 'retain' }] });
  await expect(repo.appendToDailyList('2026-08-27', [entryDraft('retain')], true))
    .resolves.toMatchObject({ ok: true, list: { listNumber: 2 } });
});

it('converges simultaneous first saves on one daily List', async () => {
  const [left, right] = await Promise.all([
    repo.appendToDailyList('2026-08-27', [entryDraft('retain')], false),
    repo.appendToDailyList('2026-08-27', [entryDraft('subtle')], false),
  ]);
  expect(left.ok && right.ok).toBe(true);
  expect(await db.lists.count()).toBe(1);
  expect(await db.entries.count()).toBe(2);
  expect(await db.reviewNodes.count()).toBe(6);
});
```

- [ ] **Step 2: Run the focused tests and confirm the missing API failure**

Run: `pnpm test -- src/db/repository.test.ts`

Expected: FAIL because `appendToDailyList` does not exist.

- [ ] **Step 3: Implement the atomic repository outcome**

Add exported result types and implement the transaction in `repository.ts`:

```ts
export type DailyListDuplicate = Exclude<DuplicateMatch, null> & { normalizedEnglish: string };
export type AppendToDailyListResult =
  | { ok: true; list: ListRecord }
  | { ok: false; code: 'DUPLICATE'; duplicates: DailyListDuplicate[] };

async appendToDailyList(
  createdDate: LocalDate,
  drafts: EntryDraft[],
  allowDuplicates = false,
): Promise<AppendToDailyListResult> {
  if (drafts.length === 0) throw new Error('At least one entry is required');
  return this.db.transaction('rw', this.db.lists, this.db.entries, this.db.reviewNodes, async () => {
    const normalized = drafts.map((draft) => normalizeEnglish(draft.english));
    const existing = await this.db.entries.where('normalizedEnglish').anyOf(normalized).toArray();
    if (!allowDuplicates && existing.length > 0) {
      const lists = new Map((await this.db.lists.bulkGet(existing.map((entry) => entry.listId)))
        .filter((list): list is ListRecord => Boolean(list)).map((list) => [list.id, list]));
      return { ok: false as const, code: 'DUPLICATE' as const, duplicates: existing.map((entry) => ({
        listId: entry.listId,
        listNumber: lists.get(entry.listId)!.listNumber,
        normalizedEnglish: entry.normalizedEnglish,
      })) };
    }
    const list = await this.getOrCreateDailyListInTransaction(createdDate);
    await this.insertEntriesInTransaction(list.id, drafts);
    return { ok: true as const, list };
  });
}
```

Extract `normalizeEnglish`, daily List creation, review-node creation, and Entry insertion into private focused helpers. Keep `saveEntries` as a compatibility wrapper that calls `appendToDailyList(..., true)` until all callers are migrated. Handle a unique `createdDate` constraint by retrying the full transaction once and reading the winning List, so simultaneous background/page saves converge on one List.

- [ ] **Step 4: Run repository tests**

Run: `pnpm test -- src/db/repository.test.ts`

Expected: PASS, including existing backup/delete/update behavior.

- [ ] **Step 5: Commit the repository API**

```bash
git add src/db/repository.ts src/db/repository.test.ts
git commit -m "feat: add atomic daily list append"
```

### Task 2: Shared direct-save application service

**Files:**
- Create: `src/capture/daily-list-service.ts`
- Create: `src/capture/daily-list-service.test.ts`
- Create: `src/capture/capture-to-entry.ts`
- Create: `src/capture/capture-error.ts`
- Create: `src/capture/capture-error.test.ts`
- Modify: `src/capture/model.ts`

- [ ] **Step 1: Write failing service tests**

Cover local-date injection, CaptureDraft conversion, duplicate propagation, and returned List identity:

```ts
it('saves a ready capture to the injected local date and returns its List', async () => {
  const append = vi.fn().mockResolvedValue({ ok: true, list: { id: 'l3', listNumber: 3 } });
  const service = new DailyListService({ appendToDailyList: append }, () => '2026-08-27');

  await expect(service.saveCapture(readyCapture, false)).resolves.toEqual({
    ok: true, listId: 'l3', listNumber: 3,
  });
  expect(append).toHaveBeenCalledWith('2026-08-27', [expect.objectContaining({
    english: readyCapture.text,
    meaningsZh: readyCapture.meaningsZh,
  })], false);
});

it('returns duplicate metadata without writing a second time', async () => {
  const append = vi.fn().mockResolvedValue({
    ok: false, code: 'DUPLICATE', duplicates: [{ listId: 'l1', listNumber: 1, normalizedEnglish: 'retain' }],
  });
  const service = new DailyListService({ appendToDailyList: append }, () => '2026-08-27');
  await expect(service.saveCapture(readyCapture, false)).resolves.toMatchObject({ code: 'DUPLICATE' });
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run: `pnpm test -- src/capture/daily-list-service.test.ts`

Expected: FAIL because the module is missing.

- [ ] **Step 3: Implement the shared service and message results**

Define the result contract in `model.ts`:

```ts
export type SaveCaptureResult =
  | { ok: true; listId: string; listNumber: number }
  | { ok: false; code: 'INVALID_DRAFT' }
  | { ok: false; code: 'DUPLICATE'; duplicate: Exclude<DuplicateMatch, null> };
```

Implement `DailyListService` with a local-date provider. Put the pure `captureToEntryDraft` conversion in `capture-to-entry.ts` so the migration can reuse it without depending on service state. Reject non-`ready` drafts before touching the repository. Use `format(new Date(), 'yyyy-MM-dd') as LocalDate` only in the production factory, not inside tests.

Add the safe error contract now because later migration, manual-save, and background tasks depend on it:

```ts
export type SafeCaptureError = {
  code: 'NETWORK' | 'AUTH_FAILED' | 'RATE_LIMITED' | 'MODEL_UNAVAILABLE' |
    'INVALID_CONTENT' | 'INVALID_RESPONSE' | 'STORAGE_FAILED' | 'UNEXPECTED';
  message: string;
  stage: 'preview' | 'enrich' | 'save' | 'migration';
  status?: number;
  detail: string;
};
```

Write mapper tests for HTTP 401, 404, and 429, network failure, invalid content, malformed AI output, IndexedDB failure, and unknown errors. Build `detail` only from the allow-listed code, stage, numeric status, and mapped message. Tests must prove that strings such as `Bearer sk-secret` in an original exception never appear in the result.

- [ ] **Step 4: Run service and repository tests**

Run: `pnpm test -- src/capture/daily-list-service.test.ts src/capture/capture-error.test.ts src/db/repository.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the shared service**

```bash
git add src/capture/model.ts src/capture/daily-list-service.ts src/capture/daily-list-service.test.ts src/capture/capture-to-entry.ts src/capture/capture-error.ts src/capture/capture-error.test.ts
git commit -m "feat: share direct daily list capture service"
```

### Task 3: Safe legacy inbox migration

**Files:**
- Modify: `src/db/repository.ts`
- Modify: `src/db/repository.test.ts`
- Create: `src/db/legacy-capture-migration.ts`
- Create: `src/db/legacy-capture-migration.test.ts`
- Modify: `src/main.tsx`
- Modify: `src/extension/background.ts`

- [ ] **Step 1: Write failing atomic migration tests**

Seed two ready drafts and one failed draft. Verify ready drafts move to the migration date’s single List, the failed draft remains, and a second call is a no-op:

```ts
it('atomically migrates ready captures and preserves unusable legacy records', async () => {
  await db.captureDrafts.bulkAdd([readyCapture('retain'), readyCapture('subtle'), failedCapture('broken')]);

  await expect(repo.migrateReadyCaptures('2026-08-27')).resolves.toMatchObject({ migrated: 2, listNumber: 1 });
  expect((await db.entries.toArray()).map((entry) => entry.english)).toEqual(['retain', 'subtle']);
  expect((await db.captureDrafts.toArray()).map((draft) => draft.text)).toEqual(['broken']);
  await expect(repo.migrateReadyCaptures('2026-08-27')).resolves.toEqual({ migrated: 0 });
});
```

Add a rollback test by forcing Entry insertion to reject and verify the ready drafts remain and no List survives.

- [ ] **Step 2: Run migration tests and verify failure**

Run: `pnpm test -- src/db/repository.test.ts src/db/legacy-capture-migration.test.ts`

Expected: FAIL because `migrateReadyCaptures` and the initializer are missing.

- [ ] **Step 3: Implement the repository migration transaction**

Add:

```ts
async migrateReadyCaptures(createdDate: LocalDate): Promise<{ migrated: number; listNumber?: number }> {
  return this.db.transaction('rw', this.db.captureDrafts, this.db.lists, this.db.entries, this.db.reviewNodes, async () => {
    const ready = await this.db.captureDrafts.where('status').equals('ready').toArray();
    if (ready.length === 0) return { migrated: 0 };
    const list = await this.getOrCreateDailyListInTransaction(createdDate);
    await this.insertEntriesInTransaction(list.id, ready.map(captureToEntryDraft));
    await this.db.captureDrafts.bulkDelete(ready.map((draft) => draft.id));
    return { migrated: ready.length, listNumber: list.listNumber };
  });
}
```

Place the shared conversion in a dependency-free module to avoid importing an application service into the repository. Keep `promoteCaptureDrafts` temporarily only if backup compatibility tests still call it; no production caller may use it.

- [ ] **Step 4: Add an idempotent startup wrapper**

In `legacy-capture-migration.ts`, catch failures so startup remains usable while legacy data stays intact:

```ts
export async function migrateLegacyCaptures(repository: MigrationRepository, today: LocalDate) {
  try {
    return await repository.migrateReadyCaptures(today);
  } catch (error) {
    return { migrated: 0, error: toSafeCaptureError(error, 'migration') };
  }
}
```

Invoke it once from `main.tsx` before/alongside render and once when the extension service worker initializes. Both invocations must use the local date and remain safe if they overlap.

- [ ] **Step 5: Run migration, backup, and type tests**

Run: `pnpm test -- src/db/legacy-capture-migration.test.ts src/db/repository.test.ts src/db/backup.test.ts`

Expected: PASS; backup snapshots still include `captureDrafts`.

- [ ] **Step 6: Commit migration support**

```bash
git add src/db/repository.ts src/db/repository.test.ts src/db/legacy-capture-migration.ts src/db/legacy-capture-migration.test.ts src/main.tsx src/extension/background.ts
git commit -m "feat: migrate legacy captures into daily list"
```

### Task 4: Remove the capture gate and visible inbox

**Files:**
- Modify: `src/features/today/TodayPage.tsx`
- Modify: `src/features/today/TodayPage.test.tsx`
- Modify: `src/features/today/useTodayState.ts`
- Modify: `src/features/today/useTodayState.test.ts`
- Modify: `src/features/capture/CaptureRoute.tsx`
- Delete: `src/features/capture/CaptureGate.tsx`
- Delete: `src/features/capture/CaptureGate.test.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/AppRoutes.test.tsx`
- Delete: `src/features/inbox/InboxPage.tsx`
- Delete: `src/features/inbox/InboxPage.test.tsx`
- Delete: `src/features/inbox/InboxRoute.tsx`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Rewrite failing homepage and route expectations**

When due Lists exist, require both the due links and a secondary capture link; ensure no inbox copy remains. For `/inbox`, assert the homepage is rendered after redirect:

```tsx
expect(screen.getByRole('heading', { name: '今天还有 2 个 List 待复习' })).toBeInTheDocument();
expect(screen.getByRole('link', { name: '记录今天所学' })).toHaveAttribute('href', '/capture');
expect(screen.queryByText('待整理')).not.toBeInTheDocument();

render(<MemoryRouter initialEntries={['/inbox']}><AppRoutes /></MemoryRouter>);
expect(await screen.findByRole('heading', { name: /今天/ })).toBeInTheDocument();
```

Update `useTodayState` tests so the returned view state has no `captureLocked` or `inboxCount` property.

- [ ] **Step 2: Run focused UI tests and verify old behavior fails**

Run: `pnpm test -- src/features/today/TodayPage.test.tsx src/features/today/useTodayState.test.ts src/app/AppRoutes.test.tsx`

Expected: FAIL because capture is hidden while due and `/inbox` still renders the inbox.

- [ ] **Step 3: Implement the new route and homepage hierarchy**

Render a secondary link below `.due-list`:

```tsx
<Link className="secondary-capture" to="/capture" aria-label="记录今天所学">
  <PencilLine aria-hidden="true" size={17} strokeWidth={1.6} />
  <span>记录今天所学</span>
  <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
</Link>
```

Keep the existing large `.primary-capture` only when no due Lists remain. Remove `inboxCount` from the page and hook. Make `CaptureRoute` render `CapturePage` directly. Replace the inbox route with `<Route path="/inbox" element={<Navigate replace to="/" />} />`, remove inbox imports/files, and add restrained text-link styling without a card or extra border.

- [ ] **Step 4: Run focused tests and full typecheck**

Run: `pnpm test -- src/features/today/TodayPage.test.tsx src/features/today/useTodayState.test.ts src/app/AppRoutes.test.tsx`

Run: `pnpm typecheck`

Expected: both PASS; no production import references `CaptureGate` or `features/inbox`.

- [ ] **Step 5: Commit the unlocked recording UI**

```bash
git add src/features/today src/features/capture/CaptureRoute.tsx src/app/App.tsx src/app/AppRoutes.test.tsx src/ui/theme.css
git add -u src/features/capture src/features/inbox
git commit -m "feat: allow recording alongside due reviews"
```

### Task 5: Make manual recording use the unified save contract

**Files:**
- Modify: `src/features/capture/CaptureRoute.tsx`
- Modify: `src/features/capture/CapturePage.tsx`
- Modify: `src/features/capture/CapturePage.test.tsx`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Write failing tests for duplicate confirmation and List success**

Change the injected `save` prop to accept `allowDuplicates` and return the typed daily-save result. Cover a duplicate first response followed by an override success:

```ts
const save = vi.fn()
  .mockResolvedValueOnce({ ok: false, code: 'DUPLICATE', duplicate: { listId: 'l1', listNumber: 1 } })
  .mockResolvedValueOnce({ ok: true, listId: 'l2', listNumber: 2 });

await user.click(screen.getByRole('button', { name: '保存到今日 List' }));
expect(screen.getByText('List 1 已存在该内容')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: '仍然保存' }));
expect(save).toHaveBeenLastCalledWith(expect.any(Array), true);
expect(await screen.findByRole('status')).toHaveTextContent('已加入 List 2');
```

Also assert a rejected save restores the action button and preserves the generated preview.

- [ ] **Step 2: Run the capture page test and verify failure**

Run: `pnpm test -- src/features/capture/CapturePage.test.tsx`

Expected: FAIL because current save navigates immediately and has no duplicate state.

- [ ] **Step 3: Implement direct-save UI state**

Have `CaptureRoute` instantiate `DailyListService` and pass `saveEntries(drafts, allowDuplicates)`. In `CapturePage`, add `duplicate`, `success`, and retryable `error` state. On success render `已加入 List ${result.listNumber}` in `role="status"`, then navigate using the existing route behavior only after the status has been announced. On duplicate, show one restrained confirmation row with “取消” and “仍然保存”; do not silently discard non-duplicate generated terms.

Wrap `saveReady` in `try/catch/finally` so errors never leave the button stuck in `saving`:

```ts
try {
  setState('saving');
  const result = await save(toEntryDrafts(results), allowDuplicates);
  if (!result.ok) return setDuplicate(result.duplicate);
  setSuccess(`已加入 List ${result.listNumber}`);
} catch (reason) {
  setError(toSafeCaptureError(reason, 'save'));
} finally {
  setState('reviewing');
}
```

- [ ] **Step 4: Run capture and route tests**

Run: `pnpm test -- src/features/capture/CapturePage.test.tsx src/app/AppRoutes.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit manual direct-save behavior**

```bash
git add src/features/capture/CaptureRoute.tsx src/features/capture/CapturePage.tsx src/features/capture/CapturePage.test.tsx src/ui/theme.css
git commit -m "feat: save manual entries directly to daily list"
```

### Task 6: Preserve history review as non-counting practice

**Files:**
- Modify: `src/features/review/ReviewRoute.tsx`
- Modify: `src/features/review/ReviewRoute.test.tsx`

- [ ] **Step 1: Add a failing history completion test**

Open `/review/l1?from=history&tab=lists`, complete the List, and assert `completeReviewNode` is never called even when a node is due today:

```ts
expect(reviewRepository.completeReviewNode).not.toHaveBeenCalled();
expect(navigateTarget).toBe('/history?tab=lists');
```

Keep a separate formal-review test asserting the oldest due node is completed from the homepage route.

- [ ] **Step 2: Run the route test and verify failure**

Run: `pnpm test -- src/features/review/ReviewRoute.test.tsx`

Expected: FAIL because current history completion can complete a node due today.

- [ ] **Step 3: Separate practice completion from schedule completion**

Return to history immediately when `fromHistory` is true and do not query or mutate review nodes:

```ts
if (fromHistory) {
  navigate(`/history?tab=${returnTab}`);
  return;
}
const node = snapshot.reviewNodes
  .filter((item) => item.listId === listId && item.completedAt === null && item.dueDate <= today)
  .sort(compareDueNode)[0];
```

- [ ] **Step 4: Run review and today-domain tests**

Run: `pnpm test -- src/features/review/ReviewRoute.test.tsx src/domain/today.test.ts src/features/today/useTodayState.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit history practice semantics**

```bash
git add src/features/review/ReviewRoute.tsx src/features/review/ReviewRoute.test.tsx
git commit -m "fix: keep history review outside schedule progress"
```

### Task 7: Add direct-save extension UI with safe errors

**Files:**
- Modify: `src/capture/model.ts`
- Modify: `src/extension/background-service.ts`
- Modify: `src/extension/background-service.test.ts`
- Modify: `src/extension/background.ts`
- Modify: `src/extension/capture-overlay.ts`
- Modify: `src/extension/capture-overlay.test.ts`

- [ ] **Step 1: Write failing background direct-save tests**

Assert that save returns `{ ok: true, listId: 'l3', listNumber: 3 }`, that a duplicate is returned without writing, and that a thrown provider or storage error is converted through `toSafeCaptureError` without exposing its original secret-bearing message.

- [ ] **Step 2: Run background tests and verify the old inbox behavior fails**

Run: `pnpm test -- src/extension/background-service.test.ts`

Expected: FAIL because the service still calls `saveCaptureDraft` and success has no List identity.

- [ ] **Step 3: Switch the background service to `DailyListService`**

Replace `saveCaptureDraft` with `saveCapture`. A success response must include `{ ok: true, listId, listNumber }`; duplicate and invalid-draft responses remain typed. In `background.ts`, convert thrown errors with `toSafeCaptureError` before `sendResponse`.

- [ ] **Step 4: Write failing overlay interaction tests**

Update the main assertion to click “加入今日 List” and expect “已加入 List 3”. Add an error case:

```ts
expect(ui.getByRole('alert')).toHaveTextContent('AI 服务认证失败，请检查 API Key');
await user.click(ui.getByRole('button', { name: '复制错误详情' }));
expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('AUTH_FAILED'));
expect(navigator.clipboard.writeText).not.toHaveBeenCalledWith(expect.stringContaining('sk-'));
await user.click(ui.getByRole('button', { name: '重试' }));
expect(sendMessage).toHaveBeenCalledWith({ type: 'PREVIEW_CAPTURE', text: draft.text });
```

- [ ] **Step 5: Implement overlay success, retry, and copy behavior**

Change copy to “加入今日 List”. Keep the selected text and selection rectangle in closure state. Render mapped errors with two buttons; retry repeats the failed preview or save stage. Copy `error.detail` via `navigator.clipboard.writeText`, with a hidden-textarea `document.execCommand('copy')` fallback for pages that deny Clipboard API access. Do not close the preview on failure.

- [ ] **Step 6: Run all capture and extension unit tests**

Run: `pnpm test -- src/capture src/extension`

Expected: PASS.

- [ ] **Step 7: Commit extension direct-save and errors**

```bash
git add src/capture/model.ts src/extension
git commit -m "feat: save extension captures with safe retryable errors"
```

### Task 8: Complete regression verification and refresh loadable extension

**Files:**
- Modify: `scripts/verify-extension.mjs`
- Generated: `dist/`
- Refresh external loadable folder: `/home/qisen/my-project/English-review/Word-Journal-extension/`

- [ ] **Step 1: Add or update the extension release assertion**

Ensure `scripts/verify-extension.mjs` verifies built HTML/JS contains the new capture entry point and does not retain the old inbox action. Use the emitted manifest and HTML asset references rather than matching a hash:

```js
import assert from 'node:assert/strict';

assert.equal(manifest.manifest_version, 3);
assert.ok(manifest.background?.service_worker);
assert.ok(manifest.content_scripts?.[0]?.js?.length);
const indexHtml = await readFile('dist/index.html', 'utf8');
const indexScripts = [...indexHtml.matchAll(/<script[^>]+src="\/?([^"]+)"/g)].map((match) => match[1]);
const scriptFiles = [
  manifest.background.service_worker,
  ...manifest.content_scripts.flatMap((entry) => entry.js),
  ...indexScripts,
];
const assetText = (await Promise.all(scriptFiles.map((file) => readFile(`dist/${file}`, 'utf8')))).join('\n');
assert.ok(assetText.includes('加入今日 List'));
assert.ok(!assetText.includes('加入待整理'));
```

- [ ] **Step 2: Run the complete automated suite**

Run: `pnpm test`

Expected: all Vitest files and tests PASS.

Run: `pnpm typecheck`

Expected: exit code 0.

Run: `pnpm build`

Expected: production web build succeeds.

Run: `pnpm build:extension`

Expected: MV3 web, service worker, content script, and `verify-extension.mjs` all succeed.

- [ ] **Step 3: Run focused browser regression tests**

Run: `pnpm test:e2e`

Expected: all configured Playwright tests PASS. If the environment lacks a browser binary, report that limitation separately and do not describe E2E as passed.

- [ ] **Step 4: Refresh the directly loadable extension folder**

From the feature worktree run:

```bash
cp -R dist/. /home/qisen/my-project/English-review/Word-Journal-extension/
```

Then verify the folder’s `manifest.json`, `index.html`, service worker, and content script match the new `dist` references. Do not copy `.env` or API credentials.

- [ ] **Step 5: Perform manual acceptance**

In Chrome or Edge, click “重新加载” for the unpacked extension and refresh existing test pages. Verify:

1. A normal webpage selection saves to today’s List and reports its number.
2. Right-click capture follows the same path.
3. A duplicate requires “再次加入”.
4. A forced bad API key shows a sanitized reason, copies safe details, and can retry.
5. A due review does not block “记录今天所学”.
6. History practice does not complete the due node.
7. Existing legacy inbox items appear in today’s List after upgrade.

Record real-browser, real-provider, audio, and visual findings separately from automated build evidence.

- [ ] **Step 6: Commit final release-contract changes**

```bash
git add scripts/verify-extension.mjs
git commit -m "test: verify direct capture extension release"
```

If `scripts/verify-extension.mjs` required no change, skip this empty commit.
