# Browser Selection Capture Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package Word Journal as a Chrome/Edge Manifest V3 extension that captures selected English words and short phrases into a local inbox and promotes them into existing review Lists.

**Architecture:** Keep the React/Dexie learning app and add a content-script adapter, a service-worker coordinator, and extension-local AI settings around a shared capture core. Typed capture contracts isolate browser collection from enrichment, persistence, List creation, and future desktop adapters.

**Tech Stack:** React 19, TypeScript, Vite, Manifest V3, Dexie/IndexedDB, Zod, Vitest, Testing Library, Playwright

---

## Planned file boundaries

- `src/capture/model.ts`: shared capture and message types.
- `src/capture/validate-selection.ts`: English validation, normalization and eight-word limit.
- `src/capture/enrich-selection.ts`: direct dictionary and OpenAI-compatible requests.
- `src/extension/settings.ts`: typed `chrome.storage.local` adapter.
- `src/extension/background-service.ts`: testable preview/save orchestration.
- `src/extension/background.ts`: runtime messages, context menu and app-tab behavior.
- `src/extension/content.ts`, `capture-overlay.ts`, `capture-overlay.css`: isolated selection UI.
- `src/features/inbox/`: live inbox, editing, gating and List promotion.
- `src/db/schema.ts`, `repository.ts`, `backup.ts`: local persistence and atomic promotion.
- `public/manifest.json`, `vite.*.config.ts`, `scripts/verify-extension.mjs`: loadable extension build.

### Task 1: Shared capture contracts and validation

**Files:**
- Create: `src/capture/model.ts`
- Create: `src/capture/validate-selection.ts`
- Test: `src/capture/validate-selection.test.ts`

- [ ] **Step 1: Write the failing validator tests**

```ts
expect(validateSelection('Potential')).toEqual({ ok: true, text: 'Potential', normalizedText: 'potential', type: 'word' });
expect(validateSelection(' take   into account ')).toEqual({ ok: true, text: 'take into account', normalizedText: 'take into account', type: 'phrase' });
expect(validateSelection('学习')).toEqual({ ok: false, code: 'NOT_ENGLISH' });
expect(validateSelection('one two three four five six seven eight nine')).toEqual({ ok: false, code: 'TOO_LONG' });
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `corepack pnpm exec vitest run src/capture/validate-selection.test.ts --maxWorkers=1`  
Expected: FAIL because the module is missing.

- [ ] **Step 3: Define complete shared types**

```ts
export type CaptureDraft = {
  id: string; text: string; normalizedText: string; type: 'word' | 'phrase';
  meaningsZh: string[]; exampleEn: string; exampleZh: string;
  usIpa: string | null; ukIpa: string | null;
  usAudioUrl: string | null; ukAudioUrl: string | null;
  audioFallback: 'none' | 'speech-synthesis';
  status: 'enriching' | 'ready' | 'saved' | 'failed'; capturedAt: string;
};
export type AiSettings = { baseUrl: string; model: string; apiKey: string; enabled: boolean };
export type DuplicateMatch = { listId: string; listNumber: number } | null;
export type CaptureMessage =
  | { type: 'PREVIEW_CAPTURE'; text: string }
  | { type: 'SAVE_CAPTURE'; draft: CaptureDraft; allowDuplicate: boolean }
  | { type: 'OPEN_WORD_JOURNAL'; route?: string };
```

- [ ] **Step 4: Implement `validateSelection`**

Normalize whitespace, accept only English letters plus apostrophes/hyphens/common punctuation, count `/[A-Za-z]+(?:['’-][A-Za-z]+)*/g`, reject zero or more than eight words, and classify one word as `word`, otherwise `phrase`. Normalize duplicate keys with `toLocaleLowerCase('en-US')`.

- [ ] **Step 5: Run test and commit**

Run: `corepack pnpm exec vitest run src/capture/validate-selection.test.ts --maxWorkers=1`  
Expected: PASS.

```bash
git add src/capture
git commit -m "feat: add browser capture contracts"
```

### Task 2: Inbox persistence and atomic List promotion

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/db/repository.ts`
- Modify: `src/db/backup.ts`
- Test: `src/db/repository.test.ts`
- Test: `src/db/backup.test.ts`
- Test: `src/db/migration.test.ts`

- [ ] **Step 1: Write failing persistence tests**

```ts
await repo.saveCaptureDraft(readyDraft);
expect(await repo.getCaptureDrafts()).toEqual([readyDraft]);
expect(await repo.findDuplicate('potential')).toBeNull();
const list = await repo.promoteCaptureDrafts('2026-08-25', [readyDraft.id]);
expect((await repo.getEntries(list.id))[0].english).toBe('potential');
expect(await repo.getCaptureDrafts()).toEqual([]);
```

Also test: only selected IDs are removed; empty/missing/non-ready selections reject; an existing normalized entry returns `{ listId, listNumber }`; backups round-trip inbox records; version 2 migrates to an empty inbox.

- [ ] **Step 2: Verify repository tests fail**

Run: `corepack pnpm exec vitest run src/db/repository.test.ts src/db/backup.test.ts src/db/migration.test.ts --maxWorkers=1`  
Expected: FAIL because inbox storage does not exist.

- [ ] **Step 3: Add Dexie version 3**

```ts
captureDrafts!: EntityTable<CaptureDraft, 'id'>;
this.version(3).stores({ captureDrafts: '&id,normalizedText,status,capturedAt' });
```

- [ ] **Step 4: Implement repository methods**

Add `saveCaptureDraft`, `getCaptureDrafts`, `updateCaptureDraft`, `deleteCaptureDraft`, and `findDuplicate`. Implement `promoteCaptureDrafts(date, ids)` as one transaction over inbox, lists, entries, and review nodes: load exactly the selected ready records, create/reuse the day's List, create six nodes for a new List, convert drafts to entries, then delete only promoted IDs. Extract the existing List creation logic so manual capture and inbox promotion share it.

- [ ] **Step 5: Extend snapshots and backups**

Include `captureDrafts` in snapshot, clear, replace, export and import. For older backups, parse a missing field as `[]`. Never add source URL/title/context fields.

- [ ] **Step 6: Run tests and commit**

Run: `corepack pnpm exec vitest run src/db/repository.test.ts src/db/backup.test.ts src/db/migration.test.ts --maxWorkers=1`  
Expected: PASS.

```bash
git add src/db
git commit -m "feat: persist capture inbox locally"
```

### Task 3: Extension-local AI settings

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tsconfig.json`
- Create: `src/extension/settings.ts`
- Test: `src/extension/settings.test.ts`

- [ ] **Step 1: Install types and write failing tests**

Run: `corepack pnpm add -D @types/chrome`

```ts
await expect(readAiSettings(memoryStorage())).resolves.toEqual({ baseUrl: 'https://api.openai.com/v1', model: 'gpt-4.1-mini', apiKey: '', enabled: true });
await writeAiSettings({ baseUrl: 'https://example.test/v1', model: 'm', apiKey: 'secret', enabled: true }, storage);
expect(storage.values.wordJournalAi.apiKey).toBe('secret');
```

- [ ] **Step 2: Verify test failure**

Run: `corepack pnpm exec vitest run src/extension/settings.test.ts --maxWorkers=1`  
Expected: FAIL because the adapter is missing.

- [ ] **Step 3: Implement the adapter**

Use only `chrome.storage.local.get/set` under the key `wordJournalAi`, merge safe defaults on read, and expose dependency injection for tests. Do not read `.env`, log keys, include keys in backups, or embed `AI_API_KEY` in output.

- [ ] **Step 4: Test, typecheck and commit**

Run: `corepack pnpm exec vitest run src/extension/settings.test.ts --maxWorkers=1 && corepack pnpm typecheck`  
Expected: PASS.

```bash
git add package.json pnpm-lock.yaml tsconfig.json src/extension
git commit -m "feat: store extension ai settings locally"
```

### Task 4: Direct dictionary and AI enrichment

**Files:**
- Create: `src/capture/enrich-selection.ts`
- Test: `src/capture/enrich-selection.test.ts`

- [ ] **Step 1: Write failing request-composition tests**

Test successful dictionary+AI composition, dictionary failure fallback, missing key, AI non-2xx, timeout and malformed JSON. Representative result:

```ts
expect(await enrichSelection('potential', settings, request)).toMatchObject({
  text: 'potential', meaningsZh: ['潜力', '可能性'], exampleEn: 'She has great potential.', status: 'ready',
});
```

- [ ] **Step 2: Verify failure**

Run: `corepack pnpm exec vitest run src/capture/enrich-selection.test.ts --maxWorkers=1`  
Expected: FAIL because `enrichSelection` is missing.

- [ ] **Step 3: Implement strict enrichment**

Validate responses with Zod. Request dictionaryapi.dev for IPA/audio, then `${baseUrl}/chat/completions` with Bearer key, temperature `0.2`, JSON response format and 20-second timeout. Send only the selected text. Require `meaningsZh`, one `exampleEn`, and `exampleZh`. Dictionary errors use speech synthesis; AI errors reject without producing a ready draft.

- [ ] **Step 4: Run tests and commit**

Run: `corepack pnpm exec vitest run src/capture/enrich-selection.test.ts --maxWorkers=1`  
Expected: PASS.

```bash
git add src/capture/enrich-selection.ts src/capture/enrich-selection.test.ts
git commit -m "feat: enrich selections inside extension"
```

### Task 5: Background coordinator and single app tab

**Files:**
- Create: `src/extension/background-service.ts`
- Test: `src/extension/background-service.test.ts`
- Create: `src/extension/background.ts`

- [ ] **Step 1: Write failing coordinator tests**

```ts
expect(await service.preview('学习')).toEqual({ ok: false, code: 'NOT_ENGLISH' });
expect(await service.preview('potential')).toMatchObject({ ok: true, duplicate: null });
expect(await service.save(readyDraft, false)).toEqual({ ok: true });
expect(await service.save(duplicateDraft, false)).toMatchObject({ ok: false, code: 'DUPLICATE' });
expect(await service.save(duplicateDraft, true)).toEqual({ ok: true });
```

- [ ] **Step 2: Verify failure**

Run: `corepack pnpm exec vitest run src/extension/background-service.test.ts --maxWorkers=1`  
Expected: FAIL because the service is missing.

- [ ] **Step 3: Implement orchestration**

`preview` validates before any request, reads settings, checks enabled/key, enriches and returns duplicate metadata. `save` rechecks duplicates to prevent races and persists only ready drafts. Map failures to stable codes: `AI_KEY_MISSING`, `AI_DISABLED`, `TOO_LONG`, `NETWORK`, `INVALID_RESPONSE`, `DUPLICATE`, `STORAGE`.

- [ ] **Step 4: Wire MV3 events**

Register async `chrome.runtime.onMessage`, create the selection context menu on install, send `SHOW_CAPTURE` to the source tab, and implement `openWordJournal(route)` by focusing an existing extension app tab or creating one `index.html#/...` tab.

- [ ] **Step 5: Test and commit**

Run: `corepack pnpm exec vitest run src/extension/background-service.test.ts --maxWorkers=1`  
Expected: PASS.

```bash
git add src/extension/background-service.ts src/extension/background-service.test.ts src/extension/background.ts
git commit -m "feat: coordinate extension captures"
```

### Task 6: Low-distraction selection overlay

**Files:**
- Create: `src/extension/content.ts`
- Create: `src/extension/capture-overlay.ts`
- Create: `src/extension/capture-overlay.css`
- Test: `src/extension/capture-overlay.test.ts`

- [ ] **Step 1: Write failing UI tests**

Verify launcher display for valid selections, no automatic request before click, preview editing/saving, duplicate override, retry, missing-key guidance, Escape/outside-click/scroll dismissal, and no launcher for non-English content. Assert:

```ts
await user.click(screen.getByRole('button', { name: '收录到 Word Journal' }));
expect(sendMessage).toHaveBeenCalledWith({ type: 'PREVIEW_CAPTURE', text: 'take into account' });
expect(screen.getByRole('button', { name: '加入待整理' })).toBeEnabled();
```

- [ ] **Step 2: Verify failure**

Run: `corepack pnpm exec vitest run src/extension/capture-overlay.test.ts --maxWorkers=1`  
Expected: FAIL because the overlay is missing.

- [ ] **Step 3: Implement content selection lifecycle**

Read only `Selection.toString()` and range geometry. Never read URL, title, cookies, surrounding DOM text or history. Remove the launcher on selection clear, scroll, Escape or outside click. Support a background `SHOW_CAPTURE` message for the context-menu fallback.

- [ ] **Step 4: Implement accessible Shadow DOM UI**

Inject `capture-overlay.css?inline` into a shadow root. Render English/type, editable meanings and examples, cancel/retry, primary save, and weaker “再次加入”. Use a labelled dialog, keyboard focus, 44px targets, low-saturation journal colors and no card-heavy dashboard treatment.

- [ ] **Step 5: Test and commit**

Run: `corepack pnpm exec vitest run src/extension/capture-overlay.test.ts --maxWorkers=1`  
Expected: PASS.

```bash
git add src/extension/content.ts src/extension/capture-overlay.ts src/extension/capture-overlay.css src/extension/capture-overlay.test.ts
git commit -m "feat: add selection capture overlay"
```

### Task 7: Gated inbox and List creation

**Files:**
- Create: `src/features/inbox/InboxPage.tsx`
- Create: `src/features/inbox/InboxRoute.tsx`
- Test: `src/features/inbox/InboxPage.test.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/app/AppRoutes.test.tsx`
- Modify: `src/features/today/TodayRoute.tsx`
- Modify: `src/features/today/TodayPage.tsx`
- Modify: `src/features/today/TodayPage.test.tsx`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Write failing route, count and gate tests**

```ts
render(<InboxPage drafts={[readyDraft]} locked onPromote={onPromote} onDelete={vi.fn()} onUpdate={vi.fn()} />);
expect(screen.getByText('完成今天的复习后即可生成新 List')).toBeInTheDocument();
expect(screen.getByRole('button', { name: '生成新 List' })).toBeDisabled();
```

Also verify unlocked promotion passes selected IDs, `/inbox` renders, and Today links `待整理 2` to the inbox.

- [ ] **Step 2: Verify failure**

Run: `corepack pnpm exec vitest run src/features/inbox/InboxPage.test.tsx src/app/AppRoutes.test.tsx src/features/today/TodayPage.test.tsx --maxWorkers=1`  
Expected: FAIL because inbox UI is missing.

- [ ] **Step 3: Implement the live route and restrained list UI**

Use `liveQuery(repository.snapshot())`; derive the gate from `selectTodayState(today, reviewNodes).captureLocked`. Rows allow selection, meaning/example edits and deletion. “生成新 List” is the only primary action and calls `promoteCaptureDrafts(today, selectedIds)` before navigating home.

- [ ] **Step 4: Add extension-safe routing**

Keep `AppRoutes` router-independent. `App` chooses `HashRouter` when `chrome.runtime.id` exists, otherwise `BrowserRouter`, and adds `/inbox`. Preserve existing web e2e routes.

- [ ] **Step 5: Run tests and commit**

Run: `corepack pnpm exec vitest run src/features/inbox/InboxPage.test.tsx src/app/AppRoutes.test.tsx src/features/today/TodayPage.test.tsx --maxWorkers=1`  
Expected: PASS.

```bash
git add src/features/inbox src/app/App.tsx src/app/AppRoutes.test.tsx src/features/today src/ui/theme.css
git commit -m "feat: promote capture inbox into lists"
```

### Task 8: AI settings UI

**Files:**
- Modify: `src/features/settings/SettingsPage.tsx`
- Modify: `src/features/settings/SettingsPage.test.tsx`
- Modify: `src/features/settings/SettingsRoute.tsx`
- Create: `src/features/settings/SettingsRoute.test.tsx`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Write failing settings tests**

```ts
expect(screen.getByLabelText('API Key')).toHaveAttribute('type', 'password');
await user.type(screen.getByLabelText('API Key'), 'local-secret');
await user.click(screen.getByRole('button', { name: '保存 AI 设置' }));
expect(onSaveAi).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'local-secret' }));
```

Also test base URL/model, capture switch, save success/error, and that the key never appears as plain text.

- [ ] **Step 2: Verify failure**

Run: `corepack pnpm exec vitest run src/features/settings/SettingsPage.test.tsx src/features/settings/SettingsRoute.test.tsx --maxWorkers=1`  
Expected: FAIL because AI settings are absent.

- [ ] **Step 3: Implement dual runtime settings**

In extension runtime, load/save `chrome.storage.local` and do not call `/api/health`. In web development, retain current server health behavior. State plainly that the key stays in the browser profile but is not a system keychain. Never include it in backup, alert, URL or log output.

- [ ] **Step 4: Test and commit**

Run: `corepack pnpm exec vitest run src/features/settings/SettingsPage.test.tsx src/features/settings/SettingsRoute.test.tsx --maxWorkers=1`  
Expected: PASS.

```bash
git add src/features/settings src/ui/theme.css
git commit -m "feat: configure extension ai access"
```

### Task 9: Loadable Manifest V3 build

**Files:**
- Create: `public/manifest.json`
- Create: `vite.worker.config.ts`
- Create: `vite.content.config.ts`
- Create: `scripts/verify-extension.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add the manifest**

```json
{
  "manifest_version": 3,
  "name": "Word Journal",
  "version": "1.0.0",
  "permissions": ["storage", "scripting", "contextMenus", "tabs"],
  "host_permissions": ["http://*/*", "https://*/*"],
  "background": { "service_worker": "extension/background.js", "type": "module" },
  "action": { "default_title": "打开 Word Journal" },
  "content_scripts": [{ "matches": ["http://*/*", "https://*/*"], "js": ["extension/content.js"], "run_at": "document_idle" }]
}
```

- [ ] **Step 2: Add deterministic bundle configs and command**

Regular Vite builds the app first. Worker config outputs ES `dist/extension/background.js`; content config outputs IIFE `dist/extension/content.js`; both set `emptyOutDir: false`.

```json
"build:extension": "tsc -b && vite build && vite build --config vite.worker.config.ts && vite build --config vite.content.config.ts && node scripts/verify-extension.mjs"
```

- [ ] **Step 3: Verify artifact contract**

The verifier parses `dist/manifest.json` and exits non-zero unless MV3, `dist/index.html`, worker and content files exist. Run:

Run: `corepack pnpm build:extension`  
Expected: exit 0 and all four artifacts exist.

Run: `rg -n "AI_API_KEY|sk-[A-Za-z0-9]" dist`  
Expected: no real key.

- [ ] **Step 4: Commit packaging**

```bash
git add public/manifest.json vite.worker.config.ts vite.content.config.ts scripts/verify-extension.mjs package.json .gitignore
git commit -m "build: package Word Journal extension"
```

### Task 10: Full verification and manual acceptance

**Files:**
- Create: `tests/e2e/extension-contract.spec.ts`

- [ ] **Step 1: Add the built-manifest privacy test**

```ts
expect(manifest.manifest_version).toBe(3);
expect(manifest.host_permissions).toEqual(['http://*/*', 'https://*/*']);
expect(JSON.stringify(manifest)).not.toMatch(/history|cookies|webRequest/);
```

Scan built JavaScript for forbidden `sourceUrl`, `sourceTitle`, `location.href` and surrounding-context fields.

- [ ] **Step 2: Run all automated verification serially**

Run: `corepack pnpm exec vitest run --maxWorkers=1`  
Expected: all tests PASS.

Run: `corepack pnpm typecheck && corepack pnpm build:extension`  
Expected: exit 0.

Run: `corepack pnpm test:e2e`  
Expected: existing web regression and extension contract PASS.

- [ ] **Step 3: Perform Chrome acceptance**

Load the absolute `dist` directory unpacked. Verify single app tab, capture while app is closed, missing-key guidance, real AI preview/edit/save, no request for nine words, duplicate override, no source metadata, review gate, restart persistence and audible playback after checking the tab is not muted.

- [ ] **Step 4: Repeat critical checks in Edge**

Load the same `dist`; verify single tab, one real capture, restart persistence and audio. Record restricted browser pages as expected platform limitations.

- [ ] **Step 5: Commit verification coverage**

```bash
git add tests/e2e/extension-contract.spec.ts
git commit -m "test: verify extension release contract"
```

## Completion evidence

Report separately: unit/integration count, typecheck, artifact paths, web Playwright, Chrome manual result, Edge manual result, real AI provider result, installed-extension audio result, and any untested permissions/restricted pages. A successful build alone is not evidence of AI connectivity, permissions, persistence, or audible speech.
