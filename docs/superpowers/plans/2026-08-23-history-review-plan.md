# History Review Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a date-grouped review schedule to History and let users manually review any saved List without incorrectly advancing future review nodes.

**Architecture:** Derive schedule rows with a pure domain function from existing Lists and review nodes, then render them in a two-tab History page. Carry review origin and return tab in URL search parameters; at completion time query the repository again and only complete an unfinished node whose due date is today.

**Tech Stack:** React 19, React Router 7, TypeScript, Dexie/liveQuery, date-fns, Vitest, Testing Library, Playwright, existing CSS design tokens.

---

## File map

- Create `src/domain/review-plan.ts`: pure grouping, deduplication, sorting, status, and focus-target logic.
- Create `src/domain/review-plan.test.ts`: domain coverage for all four statuses and ordering.
- Modify `src/features/history/HistoryRoute.tsx`: derive plan rows from the live snapshot and pass today's date.
- Modify `src/features/history/HistoryPage.tsx`: add accessible tabs, schedule list, manual review links, and focus behavior.
- Modify `src/features/history/HistoryPage.test.tsx`: cover default tab, plan rows, tab switching, and links.
- Modify `src/features/review/ReviewRoute.tsx`: parse source, distinguish missing/loading, re-query on completion, and return correctly.
- Modify `src/features/review/ReviewPage.tsx`: make the back destination and label explicit.
- Modify `src/features/review/ReviewPage.test.tsx`: verify history-aware back navigation.
- Create `src/features/review/ReviewRoute.test.tsx`: verify completion semantics and missing List recovery.
- Modify `src/ui/theme.css`: restrained tabs and linear schedule styling with responsive behavior.
- Modify `tests/e2e/review-loop.spec.ts`: cover History schedule and manual-review round trip.

### Task 1: Derive the complete review plan

**Files:**
- Create: `src/domain/review-plan.ts`
- Create: `src/domain/review-plan.test.ts`

- [ ] **Step 1: Write failing grouping and status tests**

```ts
import { describe, expect, it } from 'vitest';
import { buildReviewPlan, findPlanFocusDate } from './review-plan';

const lists = [
  { id: 'l1', listNumber: 1 },
  { id: 'l2', listNumber: 2 },
];

describe('buildReviewPlan', () => {
  it('groups Lists by date, sorts them, and deduplicates corrupt duplicates', () => {
    const rows = buildReviewPlan('2026-08-24', lists, [
      { id: 'a', listId: 'l2', dueDate: '2026-08-24', completedAt: null, sequence: 0 },
      { id: 'b', listId: 'l1', dueDate: '2026-08-24', completedAt: null, sequence: 0 },
      { id: 'c', listId: 'l1', dueDate: '2026-08-24', completedAt: null, sequence: 9 },
    ]);
    expect(rows).toEqual([{ date: '2026-08-24', status: 'due', lists }]);
  });

  it.each([
    ['2026-08-23', null, 'overdue'],
    ['2026-08-24', null, 'due'],
    ['2026-08-25', null, 'upcoming'],
    ['2026-08-23', '2026-08-23T10:00:00Z', 'completed'],
  ])('classifies %s as %s', (dueDate, completedAt, status) => {
    expect(buildReviewPlan('2026-08-24', lists.slice(0, 1), [
      { id: 'n', listId: 'l1', dueDate, completedAt, sequence: 0 },
    ])[0].status).toBe(status);
  });

  it('skips orphaned nodes and chooses today, next future date, or final date', () => {
    const rows = buildReviewPlan('2026-08-24', lists, [
      { id: 'a', listId: 'missing', dueDate: '2026-08-24', completedAt: null, sequence: 0 },
      { id: 'b', listId: 'l1', dueDate: '2026-08-25', completedAt: null, sequence: 1 },
    ]);
    expect(rows).toHaveLength(1);
    expect(findPlanFocusDate('2026-08-24', rows)).toBe('2026-08-25');
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `corepack pnpm vitest run src/domain/review-plan.test.ts`
Expected: FAIL because `./review-plan` does not exist.

- [ ] **Step 3: Implement focused domain types and pure functions**

```ts
import type { LocalDate, ReviewNode } from './models';

export type PlanList = { id: string; listNumber: number };
export type PlanStatus = 'completed' | 'due' | 'overdue' | 'upcoming';
export type ReviewPlanRow = { date: LocalDate; status: PlanStatus; lists: PlanList[] };

export function buildReviewPlan(today: LocalDate, lists: PlanList[], nodes: ReviewNode[]): ReviewPlanRow[] {
  const byId = new Map(lists.map((list) => [list.id, list]));
  const grouped = new Map<LocalDate, ReviewNode[]>();
  for (const node of nodes) {
    if (!byId.has(node.listId)) continue;
    grouped.set(node.dueDate, [...(grouped.get(node.dueDate) ?? []), node]);
  }
  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, items]) => {
    const unique = [...new Map(items.map((node) => [node.listId, byId.get(node.listId)!])).values()]
      .sort((a, b) => a.listNumber - b.listNumber);
    const status: PlanStatus = items.every((node) => node.completedAt)
      ? 'completed' : date < today ? 'overdue' : date === today ? 'due' : 'upcoming';
    return { date, status, lists: unique };
  });
}

export function findPlanFocusDate(today: LocalDate, rows: ReviewPlanRow[]): LocalDate | null {
  return rows.find((row) => row.date === today)?.date
    ?? rows.find((row) => row.date > today)?.date
    ?? rows.at(-1)?.date
    ?? null;
}
```

- [ ] **Step 4: Run the domain tests**

Run: `corepack pnpm vitest run src/domain/review-plan.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/review-plan.ts src/domain/review-plan.test.ts
git commit -m "feat: derive dated review plan"
```

### Task 2: Add History tabs and schedule view

**Files:**
- Modify: `src/features/history/HistoryPage.tsx`
- Modify: `src/features/history/HistoryPage.test.tsx`
- Modify: `src/features/history/HistoryRoute.tsx`

- [ ] **Step 1: Add failing History interaction tests**

Extend the fixture to include yesterday, today, and future nodes, render with `today="2026-08-24"`, then assert:

```ts
expect(screen.getByRole('tab', { name: '复习计划' })).toHaveAttribute('aria-selected', 'true');
expect(screen.getByText('8月24日')).toBeInTheDocument();
expect(screen.getByRole('link', { name: '复习 List 1' })).toHaveAttribute(
  'href', '/review/l1?from=history&tab=plan',
);
await user.click(screen.getByRole('tab', { name: '全部 Lists' }));
expect(screen.getByRole('link', { name: '开始复习 List 1' })).toHaveAttribute(
  'href', '/review/l1?from=history&tab=lists',
);
```

- [ ] **Step 2: Run the History test and verify it fails**

Run: `corepack pnpm vitest run src/features/history/HistoryPage.test.tsx`
Expected: FAIL because tabs and review links are absent.

- [ ] **Step 3: Pass derived rows and the validated initial tab from the live route**

In `HistoryRoute`, calculate `today` with `format(new Date(), 'yyyy-MM-dd')`, call `buildReviewPlan(today, snapshot.lists, snapshot.reviewNodes)`, and return `{ groups, plan, today }` from one `liveQuery`. Read `tab` with `useSearchParams`; pass `initialTab="lists"` only for the exact value `lists`, otherwise pass `initialTab="plan"`. Pass all values to `HistoryPage` while preserving update and delete callbacks.

- [ ] **Step 4: Implement accessible tab panels and links**

Add an `initialTab: 'plan' | 'lists'` prop and initialize `tab` from it, a `role="tablist"`, two `role="tab"` buttons, and matching `role="tabpanel"` regions. Render plan rows with stable ids `plan-${row.date}` and status labels:

```ts
const labels = { completed: '已完成', due: '待复习', overdue: '已逾期', upcoming: '未开始' };
const canOpen = row.status !== 'upcoming';
```

Use `Link` for actionable plan Lists and for each archive item. Preserve the existing expand/edit/delete subtree under the Lists panel.

- [ ] **Step 5: Focus the relevant plan date once**

Use `findPlanFocusDate(today, plan)`, a ref map keyed by date, and a guarded effect that calls `scrollIntoView({ block: 'center' })` only when the plan panel first receives data. Do not repeatedly steal focus during live updates.

- [ ] **Step 6: Run History and route tests**

Run: `corepack pnpm vitest run src/features/history/HistoryPage.test.tsx src/app/AppRoutes.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/history/HistoryPage.tsx src/features/history/HistoryPage.test.tsx src/features/history/HistoryRoute.tsx
git commit -m "feat: show complete review plan in history"
```

### Task 3: Make review navigation origin-aware

**Files:**
- Modify: `src/features/review/ReviewPage.tsx`
- Modify: `src/features/review/ReviewPage.test.tsx`

- [ ] **Step 1: Write a failing back-link test**

Render `ReviewPage` with `backHref="/history?tab=lists"` and `backLabel="返回历史"`, then assert the named link has the expected href.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `corepack pnpm vitest run src/features/review/ReviewPage.test.tsx`
Expected: FAIL because the props do not exist.

- [ ] **Step 3: Add explicit navigation props**

Add `backHref` and `backLabel` to `ReviewPage` props and replace the hard-coded anchor:

```tsx
<Link to={backHref} className="review-back">
  <ArrowLeft aria-hidden="true" size={18} />{backLabel}
</Link>
```

Use React Router `Link`, not a document-reloading anchor.

- [ ] **Step 4: Run the ReviewPage test**

Run: `corepack pnpm vitest run src/features/review/ReviewPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/review/ReviewPage.tsx src/features/review/ReviewPage.test.tsx
git commit -m "feat: make review back navigation contextual"
```

### Task 4: Complete only today's node during manual review

**Files:**
- Create: `src/features/review/ReviewRoute.test.tsx`
- Modify: `src/features/review/ReviewRoute.tsx`

- [ ] **Step 1: Write failing route tests with a mocked repository**

Cover three cases: `from=history&tab=lists` re-queries and completes an unfinished node with `dueDate === today`; a future-only List calls no completion method; a missing List renders `这个 List 不存在或已被删除` and a History link. Mock `AudioController` so no browser audio is required.

- [ ] **Step 2: Run the route tests and verify failures**

Run: `corepack pnpm vitest run src/features/review/ReviewRoute.test.tsx`
Expected: FAIL on current overdue-node selection, return route, and endless missing state.

- [ ] **Step 3: Separate loading from missing data**

Use a discriminated state:

```ts
type ReviewState = { status: 'loading' } | { status: 'missing' } | {
  status: 'ready'; list: ListRecord; entries: EntryRecord[];
};
```

The live query sets `missing` when the List is absent. The missing UI provides a `Link` to `/history`.

- [ ] **Step 4: Parse and validate origin parameters**

Read `from` and `tab` with `useSearchParams`. Only `from === 'history'` is accepted; only `tab === 'lists'` selects the Lists tab, otherwise use `plan`. Build the return target and ReviewPage labels from these validated values.

- [ ] **Step 5: Re-query on completion**

Inside `onComplete`, obtain a fresh snapshot and select only:

```ts
const node = snapshot.reviewNodes
  .filter((item) => item.listId === listId && item.completedAt === null && item.dueDate === today)
  .sort((a, b) => a.sequence - b.sequence)[0];
if (node) await repository.completeReviewNode(node.id);
```

Navigate to `/history?tab=${returnTab}` for History origin, otherwise navigate to `/` and include `completedNodeId` only when a node was completed.

- [ ] **Step 6: Run review tests**

Run: `corepack pnpm vitest run src/features/review/ReviewRoute.test.tsx src/features/review/ReviewPage.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features/review/ReviewRoute.tsx src/features/review/ReviewRoute.test.tsx
git commit -m "feat: support safe manual List review"
```

### Task 5: Apply restrained responsive styling

**Files:**
- Modify: `src/ui/theme.css`
- Modify: `src/ui/background.test.ts`

- [ ] **Step 1: Add failing CSS contract assertions**

Assert the stylesheet contains `.history-tabs`, `.review-plan-row`, `.review-plan-lists`, status selectors for all four states, and a mobile rule that collapses each plan row without horizontal overflow.

- [ ] **Step 2: Run the CSS test and verify it fails**

Run: `corepack pnpm vitest run src/ui/background.test.ts`
Expected: FAIL because the new selectors are absent.

- [ ] **Step 3: Style the tabs and schedule as a linear editorial list**

Reuse the existing ink, moss, paper, spacing, and focus tokens. Give rows a date column, flexible List column, and status column; use only fine separators. At `max-width: 600px`, use a two-column grid with Lists spanning the full second row. Keep action targets at least 44px high and include `:focus-visible` styles.

- [ ] **Step 4: Run UI and History tests**

Run: `corepack pnpm vitest run src/ui/background.test.ts src/ui/ui.test.tsx src/features/history/HistoryPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/theme.css src/ui/background.test.ts
git commit -m "style: refine history review plan"
```

### Task 6: Verify the complete user journey

**Files:**
- Modify: `tests/e2e/review-loop.spec.ts`

- [ ] **Step 1: Add the end-to-end History scenario**

After creating a List, open History and assert the Review Plan tab is selected, its dates and List links render, switch to All Lists, open `开始复习 List 1`, finish the List, and assert navigation returns to `/history?tab=lists`. Also retain the existing review-loop assertions.

- [ ] **Step 2: Run the targeted browser test**

Run: `corepack pnpm playwright test tests/e2e/review-loop.spec.ts`
Expected: PASS.

- [ ] **Step 3: Run complete verification**

Run: `corepack pnpm test && corepack pnpm typecheck && corepack pnpm build && corepack pnpm test:e2e`
Expected: all Vitest files pass, TypeScript exits 0, Vite builds successfully, and all Playwright scenarios pass.

- [ ] **Step 4: Verify the background asset is unchanged**

Run: `sha256sum public/assets/clipboard-paper-background.png`
Expected: `12eee4f1326a320ac7f94ca675579b40e7bd4f8bac9843b8c6fd60db11b6d20d`.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/review-loop.spec.ts
git commit -m "test: cover manual history review flow"
```
