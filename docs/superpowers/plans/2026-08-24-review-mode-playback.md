# Review Mode Playback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make word mode automatically loop only the current word while table mode plays the whole List only after an explicit user action.

**Architecture:** Keep audio sequencing and source fallback inside `AudioController`. Let `ReviewPage` own view-specific playback intent with separate current-word and List state, and route table-row playback through the page so a row click can clear whole-List playback state before playing once.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Playwright

---

## File Structure

- Modify `src/features/review/ReviewPage.tsx`: map the single toolbar control to current-word playback in word mode and List playback in table mode.
- Modify `src/features/review/TableReview.tsx`: report row activation through a callback instead of controlling audio directly.
- Modify `src/features/review/ReviewPage.test.tsx`: specify auto-play, pause/resume, view switching, row playback, and failure-state behavior.

### Task 1: Specify View-Specific Playback Behavior

**Files:**
- Modify: `src/features/review/ReviewPage.test.tsx`

- [ ] **Step 1: Extract a reusable audio fake and write the failing word-mode control test**

Add these helpers, then add the test:

```tsx
function makeAudio(): ReviewAudioPort {
  return {
    loopCurrent: vi.fn().mockResolvedValue('playing'),
    playList: vi.fn().mockResolvedValue('playing'),
    playRow: vi.fn().mockResolvedValue('playing'),
    pause: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  };
}

function renderReview(audio: ReviewAudioPort) {
  return render(
    <MemoryRouter>
      <ReviewPage listId="list-1" listNumber={1} entries={entries} audio={audio}
        onComplete={vi.fn()} backHref="/" backLabel="今日任务" />
    </MemoryRouter>,
  );
}
```

```tsx
it('automatically loops only the current word and lets the toolbar pause or resume it', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);

  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledWith(entries[0], 'us'));
  expect(screen.getByRole('button', { name: '暂停播放' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '暂停播放' }));
  expect(audio.pause).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '播放当前单词' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '播放当前单词' }));
  expect(audio.loopCurrent).toHaveBeenLastCalledWith(entries[0], 'us');
  expect(audio.playList).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Write the failing mode-switch and table-playback test**

```tsx
it('keeps table mode silent until the user starts the List loop', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledOnce());

  await user.click(screen.getByRole('button', { name: '表格视图' }));
  expect(audio.pause).toHaveBeenCalled();
  expect(audio.playList).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '播放本组' }));
  expect(audio.playList).toHaveBeenCalledWith('list-1', entries, 'us');
  expect(screen.getByRole('button', { name: '暂停播放' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '暂停播放' }));
  expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();
});
```

- [ ] **Step 3: Write the failing navigation and return-to-word-mode test**

```tsx
it('switches the current loop on navigation and restarts it when returning from table mode', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledWith(entries[0], 'us'));

  await user.click(screen.getByRole('button', { name: '下一个' }));
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledWith(entries[1], 'us'));
  await user.click(screen.getByRole('button', { name: '表格视图' }));
  const callsBeforeReturn = vi.mocked(audio.loopCurrent).mock.calls.length;

  await user.click(screen.getByRole('button', { name: '单词视图' }));
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledTimes(callsBeforeReturn + 1));
  expect(audio.loopCurrent).toHaveBeenLastCalledWith(entries[1], 'us');
  expect(audio.playList).not.toHaveBeenCalled();
});
```

- [ ] **Step 4: Run the focused tests and verify they fail**

Run:

```bash
corepack pnpm vitest run src/features/review/ReviewPage.test.tsx
```

Expected: FAIL because the word-mode toolbar still calls `playList`, table playback state uses the old shared behavior, and `播放当前单词` is not exposed.

- [ ] **Step 5: Commit the failing behavioral specification**

```bash
git add src/features/review/ReviewPage.test.tsx
git commit -m "test: specify review mode playback controls"
```

### Task 2: Implement Playback Intent in ReviewPage

**Files:**
- Modify: `src/features/review/ReviewPage.tsx`

- [ ] **Step 1: Replace List-only state with explicit active playback intent**

Replace `playingList` with:

```tsx
const [activePlayback, setActivePlayback] = useState<'current' | 'list' | null>(null);
```

When subscribed playback reports anything other than `playing`, clear `activePlayback`. Do not set an intent from a generic `playing` notification because table-row playback is intentionally not represented by the toolbar.

- [ ] **Step 2: Make the view effect start only current-word playback**

Use the existing effect dependencies, but set the active intent only when the current word starts successfully:

```tsx
useEffect(() => {
  let current = true;
  setPlaybackResult(null);
  setActivePlayback(null);
  if (layout === 'word' && entry) {
    void audio.loopCurrent(entry, accent).then((result) => {
      if (!current) return;
      setPlaybackResult(result);
      setActivePlayback(result === 'playing' ? 'current' : null);
    });
  }
  return () => {
    current = false;
    audio.pause();
  };
}, [accent, audio, entry, layout]);
```

This makes table entry silent and ensures word navigation restarts only the newly selected word.

- [ ] **Step 3: Implement the mode-aware toolbar handler**

Replace the List-only toggle with:

```tsx
async function togglePlayback() {
  if (activePlayback) {
    audio.pause();
    setActivePlayback(null);
    setPlaybackResult(null);
    return;
  }

  const result = layout === 'word'
    ? await audio.loopCurrent(entry, accent)
    : await audio.playList(listId, entries, accent);
  setPlaybackResult(result);
  setActivePlayback(result === 'playing' ? (layout === 'word' ? 'current' : 'list') : null);
}
```

Set the toolbar label from view and intent:

```tsx
const playbackLabel = activePlayback
  ? '暂停播放'
  : layout === 'word' ? '播放当前单词' : '播放本组';
```

Use `togglePlayback` for the toolbar button and render `Pause` only when `activePlayback` is non-null.

- [ ] **Step 4: Keep recovery aligned with the current view**

Rename `retryCurrent` to `retryPlayback` and retry the action represented by the current view:

```tsx
async function retryPlayback() {
  setPlaybackResult(null);
  const result = layout === 'word'
    ? await audio.loopCurrent(entry, accent)
    : await audio.playList(listId, entries, accent);
  setPlaybackResult(result);
  setActivePlayback(result === 'playing' ? (layout === 'word' ? 'current' : 'list') : null);
}
```

- [ ] **Step 5: Run the focused tests and verify they pass**

Run:

```bash
corepack pnpm vitest run src/features/review/ReviewPage.test.tsx
```

Expected: all `ReviewPage` tests written through Task 2 PASS.

- [ ] **Step 6: Commit the mode-aware toolbar behavior**

```bash
git add src/features/review/ReviewPage.tsx src/features/review/ReviewPage.test.tsx
git commit -m "fix: align playback controls with review mode"
```

### Task 3: Make Table Row Playback Clear List Intent

**Files:**
- Modify: `src/features/review/TableReview.tsx`
- Modify: `src/features/review/ReviewPage.tsx`
- Modify: `src/features/review/ReviewPage.test.tsx`

- [ ] **Step 1: Write the failing row-interruption assertion**

In table mode, start the List, activate the `retain` row, then assert the toolbar returns to `播放本组` and `playRow` receives the row entry and accent:

```tsx
await user.click(screen.getByRole('button', { name: '播放本组' }));
await user.click(screen.getByRole('row', { name: /retain/ }));

expect(audio.playRow).toHaveBeenCalledWith(entries[0], 'us');
expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
corepack pnpm vitest run src/features/review/ReviewPage.test.tsx
```

Expected: FAIL because `TableReview` starts row playback without clearing `ReviewPage` List intent.

- [ ] **Step 3: Replace TableReview audio ownership with a row callback**

Change the component contract to:

```tsx
export function TableReview({ entries, mode, accent, onPlayRow }: {
  entries: EntryRecord[];
  mode: VisibilityMode;
  accent: Accent;
  onPlayRow(entry: EntryRecord, accent: Accent): void;
})
```

Call `onPlayRow(entry, accent)` from both click and Enter/Space keyboard activation.

- [ ] **Step 4: Route row playback through ReviewPage**

Add:

```tsx
function playRow(entryToPlay: EntryRecord, rowAccent: Accent) {
  setActivePlayback(null);
  setPlaybackResult(null);
  void audio.playRow(entryToPlay, rowAccent).then(setPlaybackResult);
}
```

Pass `onPlayRow={playRow}` to `TableReview`. `AudioController.playRow` already stops the active List source before playing the row once.

- [ ] **Step 5: Run review tests and typecheck**

Run:

```bash
corepack pnpm vitest run src/features/review/ReviewPage.test.tsx src/features/review/ReviewRoute.test.tsx
corepack pnpm typecheck
```

Expected: both test files PASS and typecheck exits with code 0.

- [ ] **Step 6: Commit the row-playback integration**

```bash
git add src/features/review/TableReview.tsx src/features/review/ReviewPage.tsx src/features/review/ReviewPage.test.tsx
git commit -m "fix: stop list playback when a table row plays"
```

### Task 4: Full Regression Verification

**Files:**
- Verify only

- [ ] **Step 1: Run all unit and component tests**

Run:

```bash
corepack pnpm test
```

Expected: all test files PASS with zero failed tests.

- [ ] **Step 2: Run static verification and production build**

Run:

```bash
corepack pnpm typecheck
corepack pnpm build
```

Expected: TypeScript exits with code 0 and Vite produces `dist/` successfully.

- [ ] **Step 3: Run browser tests serially**

Run:

```bash
corepack pnpm playwright test --workers=1
```

Expected: all Playwright tests PASS. Serial execution avoids the existing shared Vite/IndexedDB test-server instability seen with parallel workers.

- [ ] **Step 4: Confirm the background asset is unchanged**

Run:

```bash
sha256sum public/assets/clipboard-paper-background.png
```

Expected:

```text
12eee4f1326a320ac7f94ca675579b40e7bd4f8bac9843b8c6fd60db11b6d20d  public/assets/clipboard-paper-background.png
```

- [ ] **Step 5: Inspect the final repository state**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: no uncommitted implementation files and the playback commits are visible at the top of history.
