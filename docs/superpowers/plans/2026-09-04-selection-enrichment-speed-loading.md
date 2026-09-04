# Selection Enrichment Speed and Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run dictionary and AI enrichment concurrently and replace the W launcher with a compact pen button that communicates loading without opening an empty preview.

**Architecture:** Split dictionary lookup and AI enrichment into independent promises inside `enrichSelection`, then merge their results after both settle. Keep all loading presentation inside the shadow-DOM overlay so the background service and saved-data contract remain unchanged.

**Tech Stack:** TypeScript, Chrome MV3, DOM/Shadow DOM, Zod, Vitest, Testing Library, Vite

---

### Task 1: Run enrichment requests concurrently

**Files:**
- Modify: `src/capture/enrich-selection.ts`
- Test: `src/capture/enrich-selection.test.ts`

- [ ] **Step 1: Write the failing concurrency test**

Add a test with unresolved dictionary and AI promises. Call `enrichSelection`, verify both URLs have been requested before resolving either promise, then resolve both with valid responses and assert the merged draft contains AI meanings and dictionary audio.

```ts
expect(request).toHaveBeenCalledTimes(2);
expect(String(request.mock.calls[0][0])).toContain('dictionaryapi.dev');
expect(String(request.mock.calls[1][0])).toContain('/chat/completions');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test -- --run src/capture/enrich-selection.test.ts`

Expected: the concurrency test fails because only the dictionary request has started.

- [ ] **Step 3: Extract independent promises and merge results**

Create a dictionary task that catches optional-provider failures and returns `{ ipa, audioUrl }`. Create an AI task containing the existing two-attempt strict validation loop. Start both tasks before awaiting them and merge with:

```ts
const [{ ipa, audioUrl }, content] = await Promise.all([
  lookupDictionary(validated.text, request),
  generateLearningContent(validated, settings, request),
]);
```

Do not alter validation, retry count, error status preservation, or `CaptureDraft` fields.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npm run test -- --run src/capture/enrich-selection.test.ts`

Expected: all enrichment tests pass, including malformed response, retry, dictionary fallback and concurrency.

- [ ] **Step 5: Commit the request optimization**

```bash
git add src/capture/enrich-selection.ts src/capture/enrich-selection.test.ts
git commit -m "perf: parallelize selection enrichment"
```

### Task 2: Add the compact pen loading launcher

**Files:**
- Modify: `src/extension/capture-overlay.ts`
- Test: `src/extension/capture-overlay.test.ts`

- [ ] **Step 1: Write failing launcher-state tests**

Use an unresolved `sendMessage` promise. After showing the launcher, assert its accessible name is `收录到 Word Journal`; after clicking, assert it is disabled and named `正在生成释义与例句`. Resolve the promise and assert the preview replaces it. Also assert the launcher contains an SVG icon and no `W` text.

```ts
expect(ui.getByRole('button', { name: '正在生成释义与例句' })).toBeDisabled();
expect(ui.getByRole('button').textContent).not.toContain('W');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test -- --run src/extension/capture-overlay.test.ts`

Expected: tests fail because the current launcher contains `W` and exposes no loading name.

- [ ] **Step 3: Implement the three launcher states**

Render a `34 × 34px` launcher with a `16px` inline pen SVG. Add a `data-loading` state when preview starts, update `aria-label`, set `aria-busy`, and keep the button disabled until it is replaced by preview or error UI. Style a pseudo-element as a `1.5px` rotating outline and stop rotation under `prefers-reduced-motion: reduce`.

```ts
button.replaceChildren(createPenIcon());
button.dataset.loading = 'true';
button.setAttribute('aria-label', '正在生成释义与例句');
button.setAttribute('aria-busy', 'true');
```

The default state keeps the existing paper palette, uses a restrained square radius, and moves upward by only `1px` on hover.

- [ ] **Step 4: Run overlay and accessibility tests and verify GREEN**

Run: `npm run test -- --run src/extension/capture-overlay.test.ts`

Expected: all overlay tests pass, including success, error, duplicate, context invalidation and loading state.

- [ ] **Step 5: Commit the loading interaction**

```bash
git add src/extension/capture-overlay.ts src/extension/capture-overlay.test.ts
git commit -m "feat: show selection enrichment loading state"
```

### Task 3: Verify and package the extension

**Files:**
- Update generated loadable folder: `/home/qisen/my-project/English-review/Word-Journal-extension/`

- [ ] **Step 1: Run complete automated verification**

```bash
npm run test
npm run typecheck
npm run build:extension
```

Expected: zero failed tests, TypeScript exits successfully, and `verify-extension.mjs` reports all required artifacts.

- [ ] **Step 2: Refresh the loadable extension folder**

```bash
cp -R dist/. /home/qisen/my-project/English-review/Word-Journal-extension/
```

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check HEAD~2..HEAD`

Expected: no whitespace errors. Confirm only enrichment, overlay, tests and approved documentation changed.

- [ ] **Step 4: Manual browser acceptance**

Reload Word Journal at `chrome://extensions`, refresh the test webpage, select a word, click the pen launcher, and verify that the compact loading ring appears immediately and the result opens when enrichment completes. Compare elapsed time with the previous serial path; provider latency may still exceed ten seconds, but dictionary latency must no longer be added before AI begins.
