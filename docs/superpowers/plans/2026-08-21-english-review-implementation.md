# English Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a desktop-first English vocabulary review web app that stores daily Lists locally, enriches English entries through dictionary and AI services, and enforces fixed D+1/2/4/7/15/30 review cycles.

**Architecture:** A React/Vite client owns all durable user data through an IndexedDB repository. Pure domain modules calculate schedules and lock state. A small Hono server acts as a stateless proxy that combines dictionary data with an AI response; it never receives historical Lists. Audio, import/export, and review presentation are isolated behind focused services and hooks.

**Tech Stack:** React, TypeScript, Vite, React Router, Dexie, Zod, date-fns, Hono, Lucide React, Vitest, Testing Library, MSW, Playwright, pnpm.

---

## File map

- `src/domain/`: pure types, schedule rules, and review selectors; no browser or React dependencies.
- `src/db/`: Dexie schema, repository, migrations, and backup import/export.
- `src/api/`: browser client for the enrichment endpoint.
- `src/audio/`: mutually exclusive audio playback controller and React hook.
- `src/features/today/`: due-list home and strict input lock.
- `src/features/capture/`: English-only entry, enrichment preview, editing, retry, and save.
- `src/features/review/`: word/table views, visibility modes, translation reveal, navigation, and List completion.
- `src/features/history/`: List history and entry editing.
- `src/features/settings/`: accent selection, service health, backup, restore, and local-data disclosure.
- `src/ui/`: shared layout, controls, icons, status feedback, and design tokens.
- `server/`: stateless dictionary/AI enrichment proxy.
- `tests/e2e/`: browser acceptance journeys.

### Task 1: Scaffold the tested application shell

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `server/index.ts`

- [ ] **Step 1: Initialize dependencies**

Run:

```bash
pnpm add react react-dom react-router-dom dexie zod date-fns hono @hono/node-server lucide-react
pnpm add -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw tsx concurrently @types/react @types/react-dom @types/node playwright @playwright/test
```

Expected: dependencies are written to `package.json` and `pnpm-lock.yaml` is created.

- [ ] **Step 2: Write the failing shell test**

```tsx
// src/app/App.test.tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the product identity and today route', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /word journal/i })).toBeInTheDocument();
  expect(screen.getByText('今日复习')).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test and verify the red state**

Run: `pnpm vitest run src/app/App.test.tsx`

Expected: FAIL because `src/app/App.tsx` does not exist.

- [ ] **Step 4: Add scripts, test setup, and the minimal shell**

Use scripts `dev`, `dev:web`, `dev:server`, `build`, `test`, `test:e2e`, and `typecheck`. Configure Vite to proxy `/api` to `http://localhost:8787`; configure Vitest for `jsdom` and `vitest.setup.ts`.

```tsx
// src/app/App.tsx
export function App() {
  return (
    <main>
      <h1>Word Journal</h1>
      <p>今日复习</p>
    </main>
  );
}
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './ui/theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
```

- [ ] **Step 5: Verify the shell**

Run: `pnpm test && pnpm typecheck && pnpm build`

Expected: all commands exit 0 and Vite emits `dist/`.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json vite.config.ts vitest.setup.ts index.html src server
git commit -m "chore: scaffold English review app"
```

### Task 2: Implement fixed review scheduling and lock rules

**Files:**
- Create: `src/domain/models.ts`
- Create: `src/domain/schedule.ts`
- Create: `src/domain/schedule.test.ts`
- Create: `src/domain/today.ts`
- Create: `src/domain/today.test.ts`

- [ ] **Step 1: Write failing schedule tests**

```ts
// src/domain/schedule.test.ts
import { buildReviewDates } from './schedule';

it('creates the six calendar-day review dates', () => {
  expect(buildReviewDates('2026-08-21')).toEqual([
    '2026-08-22', '2026-08-23', '2026-08-25',
    '2026-08-28', '2026-09-05', '2026-09-20',
  ]);
});
```

```ts
// src/domain/today.test.ts
import { selectTodayState } from './today';

it('keeps capture locked while a due List is incomplete', () => {
  const state = selectTodayState('2026-08-22', [{
    listId: 'list-1', dueDate: '2026-08-22', completedAt: null,
  }]);
  expect(state.captureLocked).toBe(true);
  expect(state.due.map(item => item.listId)).toEqual(['list-1']);
});
```

- [ ] **Step 2: Verify both tests fail**

Run: `pnpm vitest run src/domain/schedule.test.ts src/domain/today.test.ts`

Expected: FAIL because the domain modules do not exist.

- [ ] **Step 3: Add domain types and pure functions**

```ts
// src/domain/models.ts
export type LocalDate = `${number}-${number}-${number}`;
export type ReviewNode = {
  listId: string;
  dueDate: LocalDate;
  completedAt: string | null;
};
export const REVIEW_OFFSETS = [1, 2, 4, 7, 15, 30] as const;
```

```ts
// src/domain/schedule.ts
import { addDays, format, parseISO } from 'date-fns';
import { REVIEW_OFFSETS, type LocalDate } from './models';

export function buildReviewDates(createdDate: LocalDate): LocalDate[] {
  return REVIEW_OFFSETS.map(days =>
    format(addDays(parseISO(createdDate), days), 'yyyy-MM-dd') as LocalDate,
  );
}
```

`selectTodayState()` must include all incomplete nodes whose `dueDate <= today`, sort oldest first, and set `captureLocked` when any exist.

- [ ] **Step 4: Add boundary cases**

Cover month/year rollover, leap day, completed nodes, future nodes, multiple overdue nodes, and stable oldest-first sorting.

- [ ] **Step 5: Run domain verification**

Run: `pnpm vitest run src/domain`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domain
git commit -m "feat: add fixed review schedule rules"
```

### Task 3: Build the IndexedDB repository

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/repository.ts`
- Create: `src/db/repository.test.ts`
- Create: `src/db/test-db.ts`

- [ ] **Step 1: Write failing repository tests**

```ts
it('appends multiple saves on one date to the same List', async () => {
  await repo.saveEntries('2026-08-21', [entry('retain')]);
  await repo.saveEntries('2026-08-21', [entry('subtle')]);
  const lists = await repo.getLists();
  expect(lists).toHaveLength(1);
  expect(await repo.getEntries(lists[0].id)).toHaveLength(2);
});

it('creates six review nodes atomically with a new List', async () => {
  const list = await repo.saveEntries('2026-08-21', [entry('retain')]);
  expect(await repo.getReviewNodes(list.id)).toHaveLength(6);
});
```

- [ ] **Step 2: Verify the tests fail**

Run: `pnpm vitest run src/db/repository.test.ts`

Expected: FAIL because the repository does not exist.

- [ ] **Step 3: Define the schema**

Create tables for `lists`, `entries`, `reviewNodes`, `drafts`, and `settings`. Use UUID primary keys, indexed `createdDate`, `listId`, and `[dueDate+completedAt]`. Store audio URLs and metadata, not audio blobs.

```ts
export type EntryRecord = {
  id: string;
  listId: string;
  english: string;
  usIpa: string | null;
  ukIpa: string | null;
  usAudioUrl: string | null;
  ukAudioUrl: string | null;
  meaningsZh: string[];
  exampleEn: string;
  exampleZh: string;
  audioFallback: 'none' | 'speech-synthesis';
  updatedAt: string;
};
```

- [ ] **Step 4: Implement transactional repository methods**

Implement `saveEntries`, `getLists`, `getEntries`, `getReviewNodes`, `completeReviewNode`, `undoCompletion`, `saveDraft`, `deleteList`, and `updateEntry`. `saveEntries` must reuse the same-date List and create nodes only on first creation.

- [ ] **Step 5: Test migration and rollback behavior**

Add a version-2 migration fixture and assert that an exception leaves version-1 records readable.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run src/db`

Expected: PASS.

```bash
git add src/db
git commit -m "feat: persist Lists in IndexedDB"
```

### Task 4: Add stateless dictionary and AI enrichment

**Files:**
- Create: `server/env.ts`
- Create: `server/enrichment/schema.ts`
- Create: `server/enrichment/dictionary.ts`
- Create: `server/enrichment/ai.ts`
- Create: `server/enrichment/service.ts`
- Create: `server/enrichment/service.test.ts`
- Modify: `server/index.ts`
- Create: `src/api/enrichment.ts`

- [ ] **Step 1: Write the failing orchestration test**

```ts
it('keeps dictionary pronunciation and asks AI for meanings and one example', async () => {
  dictionary.lookup.mockResolvedValue({ usIpa: '/rɪˈteɪn/', usAudioUrl: 'https://audio/retain.mp3' });
  ai.enrich.mockResolvedValue({
    meaningsZh: ['保持', '保留', '记住', '雇用'],
    exampleEn: 'We retain more through regular review.',
    exampleZh: '通过定期复习，我们能记住更多内容。',
  });
  const result = await service.enrich('retain');
  expect(result.meaningsZh).toHaveLength(4);
  expect(result.usAudioUrl).toBe('https://audio/retain.mp3');
});
```

- [ ] **Step 2: Verify the test fails**

Run: `pnpm vitest run server/enrichment/service.test.ts`

Expected: FAIL because the service does not exist.

- [ ] **Step 3: Define validated request and response contracts**

Use Zod to accept 1–100 trimmed English terms, each 1–120 characters. Return one result per input with either `status: 'ready'` and all fields or `status: 'error'`, an error code, and a recoverable message.

- [ ] **Step 4: Implement provider adapters**

The dictionary adapter must map provider data into the internal pronunciation shape. The AI adapter must read `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` from server environment variables, request strict JSON, and validate the response with Zod. The system prompt must require multiple major Chinese senses and exactly one example for the most common sense.

- [ ] **Step 5: Implement fallback and privacy behavior**

When dictionary lookup fails, retain AI content and set `audioFallback: 'speech-synthesis'`. Do not log request bodies. Log only request id, count, duration, provider status, and error code.

- [ ] **Step 6: Expose and test endpoints**

Expose `POST /api/enrich` and `GET /api/health`. Add tests for malformed input, partial provider failure, AI timeout, invalid AI JSON, phrases, and preserving input order.

- [ ] **Step 7: Verify and commit**

Run: `pnpm vitest run server src/api`

Expected: PASS.

```bash
git add server src/api
git commit -m "feat: add dictionary and AI enrichment proxy"
```

### Task 5: Implement backup, restore, and local data safety

**Files:**
- Create: `src/db/backup.ts`
- Create: `src/db/backup.test.ts`
- Create: `src/domain/backup-schema.ts`

- [ ] **Step 1: Write failing round-trip and rejection tests**

```ts
it('round-trips every durable table', async () => {
  const json = await exportBackup(repo);
  await emptyRepo.clearAll();
  await importBackup(emptyRepo, json, 'replace');
  expect(await emptyRepo.snapshot()).toEqual(await repo.snapshot());
});

it('does not mutate data when validation fails', async () => {
  const before = await repo.snapshot();
  await expect(importBackup(repo, '{"version":99}', 'replace')).rejects.toThrow();
  expect(await repo.snapshot()).toEqual(before);
});
```

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/db/backup.test.ts`

Expected: FAIL because backup functions do not exist.

- [ ] **Step 3: Implement a versioned backup envelope**

```ts
export type BackupV1 = {
  format: 'english-review-backup';
  version: 1;
  exportedAt: string;
  data: RepositorySnapshot;
};
```

Validate the full envelope before opening a write transaction. Before replace-import, generate a downloadable safety backup from the current snapshot.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/db/backup.test.ts`

Expected: PASS.

```bash
git add src/domain/backup-schema.ts src/db/backup.ts src/db/backup.test.ts
git commit -m "feat: add local backup and restore"
```

### Task 6: Build the restrained journal design system and app routing

**Files:**
- Create: `src/ui/theme.css`
- Create: `src/ui/AppShell.tsx`
- Create: `src/ui/TextTabs.tsx`
- Create: `src/ui/Action.tsx`
- Create: `src/ui/Progress.tsx`
- Create: `src/ui/LiveStatus.tsx`
- Create: `src/ui/ui.test.tsx`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Write failing accessibility tests**

Test that text tabs expose `role="tablist"`, selected state, keyboard arrow navigation, 44px minimum hit areas, visible labels, and a polite live region.

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/ui/ui.test.tsx`

Expected: FAIL because shared UI components do not exist.

- [ ] **Step 3: Implement semantic design tokens**

Define tokens for warm paper surfaces, ink, moss focus/action, clay warning, typography, 4/8px spacing, focus rings, and 150–300ms motion. Group content through whitespace, type, weight, and subtle surface changes; do not use thin separator lines, decorative emoji, card grids, tape, or sticker effects.

- [ ] **Step 4: Implement the routed shell**

Add routes `/`, `/capture`, `/review/:listId`, `/history`, and `/settings`. Keep Today primary; History and Settings remain secondary. Preserve navigation state when returning from review.

- [ ] **Step 5: Add responsive and reduced-motion rules**

Test at 375, 768, 1024, and 1440 CSS pixels. Prevent horizontal overflow, retain desktop reading width, and disable non-essential motion under `prefers-reduced-motion`.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run src/ui src/app && pnpm build`

Expected: PASS and build exits 0.

```bash
git add src/ui src/app
git commit -m "feat: add focused journal interface system"
```

### Task 7: Build Today and strict capture gating

**Files:**
- Create: `src/features/today/TodayPage.tsx`
- Create: `src/features/today/TodayPage.test.tsx`
- Create: `src/features/today/useTodayState.ts`
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Write failing page tests**

Test an overdue List sorted before today’s List, visible remaining count, progress text, a locked capture action with an explanation, and an unlocked capture action after all due nodes complete.

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/features/today/TodayPage.test.tsx`

Expected: FAIL because Today does not exist.

- [ ] **Step 3: Implement Today from domain selectors**

Keep the page focused on remaining Lists. Do not add charts, streaks, scores, badges, or unrelated history cards. Make every List row navigable by mouse and keyboard.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/features/today`

Expected: PASS.

```bash
git add src/features/today src/app/App.tsx
git commit -m "feat: add gated daily review home"
```

### Task 8: Build English-only capture and partial-result preview

**Files:**
- Create: `src/features/capture/CapturePage.tsx`
- Create: `src/features/capture/CapturePage.test.tsx`
- Create: `src/features/capture/parseTerms.ts`
- Create: `src/features/capture/parseTerms.test.ts`
- Create: `src/features/capture/useEnrichmentDraft.ts`

- [ ] **Step 1: Write failing parsing and workflow tests**

Test newline parsing, trimming, duplicate removal with stable order, 100-term limit, persistent field label, loading status per term, editing a generated meaning, retrying one failure, retrying all failures, and saving only ready entries.

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/features/capture`

Expected: FAIL because capture modules do not exist.

- [ ] **Step 3: Implement capture state as an explicit reducer**

Use states `idle`, `generating`, `reviewing`, `saving`, and `saved`. Each term independently holds `queued`, `loading`, `ready`, or `error`. Persist unsaved input and generated edits to the drafts table.

- [ ] **Step 4: Implement preview editing and save**

Allow editing English, both IPAs, all Chinese meanings, the one English example, and translation. On save, call the repository once so List creation, entries, and review nodes are atomic.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run src/features/capture`

Expected: PASS.

```bash
git add src/features/capture
git commit -m "feat: add AI-assisted daily capture"
```

### Task 9: Implement mutually exclusive audio playback

**Files:**
- Create: `src/audio/AudioController.ts`
- Create: `src/audio/AudioController.test.ts`
- Create: `src/audio/useReviewAudio.ts`
- Create: `src/audio/speechFallback.ts`

- [ ] **Step 1: Write failing controller tests**

Test loop-current, play-list, play-row, pause, changing accent, stopping old audio before new audio, stopping on disposal, advancing after `ended`, and using speech synthesis when URL is absent.

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/audio`

Expected: FAIL because the audio controller does not exist.

- [ ] **Step 3: Implement one-owner playback state**

```ts
export type PlaybackMode =
  | { kind: 'paused' }
  | { kind: 'current-loop'; entryId: string }
  | { kind: 'list-loop'; listId: string; index: number }
  | { kind: 'row-once'; entryId: string };
```

All transitions call `stopActiveSource()` first. Handle rejected `audio.play()` by returning `needsUserGesture: true`; never spin in an automatic retry loop.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/audio`

Expected: PASS.

```bash
git add src/audio
git commit -m "feat: add exclusive review audio playback"
```

### Task 10: Build word and table review modes

**Files:**
- Create: `src/features/review/ReviewPage.tsx`
- Create: `src/features/review/ReviewPage.test.tsx`
- Create: `src/features/review/WordReview.tsx`
- Create: `src/features/review/TableReview.tsx`
- Create: `src/features/review/ViewModeTabs.tsx`
- Create: `src/features/review/CompletionAction.tsx`

- [ ] **Step 1: Write failing interaction tests**

Test complete/English/Chinese visibility modes in both views, clicking the example to toggle translation, fixed centered previous/next controls, automatic current-word looping, whole-List playback, full-row audio click, current-row non-color feedback, completion hidden before the final word, and completion in the table header.

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/features/review`

Expected: FAIL because review components do not exist.

- [ ] **Step 3: Implement word mode**

Keep the word as the visual center. The bottom navigation must reserve stable space. Render the restrained header completion action only when `index === entries.length - 1`. Entering or changing an entry starts continuous playback through the audio hook.

- [ ] **Step 4: Implement table mode**

Render no List date. In English mode, remove Chinese meaning cells and reflow columns; in Chinese mode, remove English/IPA cells and reflow. Clicking a row plays it once. Keep completion in the upper-right header area.

- [ ] **Step 5: Implement completion and undo**

Complete the currently due node, return to Today, announce success, and show a 5-second undo action. Undo must restore the exact node and Today lock state.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run src/features/review src/audio`

Expected: PASS.

```bash
git add src/features/review
git commit -m "feat: add focused List review modes"
```

### Task 11: Add history, settings, editing, and destructive safeguards

**Files:**
- Create: `src/features/history/HistoryPage.tsx`
- Create: `src/features/history/HistoryPage.test.tsx`
- Create: `src/features/history/EditEntryForm.tsx`
- Create: `src/features/settings/SettingsPage.tsx`
- Create: `src/features/settings/SettingsPage.test.tsx`
- Create: `src/ui/ConfirmDialog.tsx`

- [ ] **Step 1: Write failing feature tests**

Test List-oriented history, visible creation date and review status, editing all entry fields, delete confirmation, accent preference, service health, backup download, restore validation, pre-replace safety export, and a clear warning that clearing site data removes IndexedDB.

- [ ] **Step 2: Verify red state**

Run: `pnpm vitest run src/features/history src/features/settings`

Expected: FAIL because the pages do not exist.

- [ ] **Step 3: Implement History without dashboard patterns**

Use one compact chronological List, not a card grid or analytics dashboard. Preserve scroll position when opening and returning from a List.

- [ ] **Step 4: Implement Settings and safeguards**

Use native file selection and download APIs. Validate imports before confirmation. Separate “clear all local data” spatially and semantically from backup actions.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run src/features/history src/features/settings`

Expected: PASS.

```bash
git add src/features/history src/features/settings src/ui/ConfirmDialog.tsx
git commit -m "feat: add history and local data controls"
```

### Task 12: Add end-to-end acceptance and release verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/review-loop.spec.ts`
- Create: `tests/e2e/capture-recovery.spec.ts`
- Create: `tests/e2e/backup.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Write the primary browser journey**

Seed one overdue List, assert capture is locked, review it in word mode, complete it, assert capture unlocks, enter two English terms, mock one successful and one failed enrichment result, retry the failure, save, reload, and assert the same List and next review date remain in IndexedDB.

- [ ] **Step 2: Add focused acceptance journeys**

Cover table visibility modes and row audio, autoplay rejection recovery, JSON round trip, invalid import preserving data, keyboard-only review, 375px/768px/1440px screenshots, and reduced-motion behavior.

- [ ] **Step 3: Document local setup and privacy boundary**

README must include `pnpm install`, environment variables, `pnpm dev`, test commands, build command, local-data behavior, backup recommendation, provider fallback, and the fact that only current enrichment terms leave the device.

- [ ] **Step 4: Run the full verification suite**

Run:

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm test:e2e
```

Expected: every command exits 0; Playwright reports all projects passed; `dist/` is generated.

- [ ] **Step 5: Perform the visual and accessibility checklist**

Verify no thin separator lines, decorative emoji, dashboard/card-grid layout, horizontal overflow, hidden focus rings, targets smaller than 44px, color-only states, or uncontrolled audio. Confirm text contrast reaches WCAG AA and navigation works without a mouse.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts tests .env.example README.md
git commit -m "test: cover complete English review workflow"
```

## Completion gate

Implementation is complete only when all twelve task-level verification commands and the final full suite pass. Report external provider credentials, real dictionary availability, real AI output quality, and manual audio behavior separately if they have not been exercised with live services.
