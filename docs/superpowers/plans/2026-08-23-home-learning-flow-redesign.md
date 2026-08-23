# Focused Home Learning Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero layout with a restrained header, top progress rail, adaptive review state, single capture CTA, and history-derived learning streak without modifying the generated background bitmap.

**Architecture:** Pure domain functions calculate the consecutive List-date streak and today's completed/total review counts from the existing repository snapshot. `TodayPage` remains a presentational component, `Progress` owns the compact horizontal progress rail, and `AppShell` owns global header structure; CSS establishes the visual hierarchy while the existing background asset remains byte-identical.

**Tech Stack:** React 19, React Router, TypeScript, date-fns, Vitest, Testing Library, Playwright, CSS.

---

## File map

- Create `src/domain/streak.ts`: pure consecutive List-date calculation.
- Create `src/domain/streak.test.ts`: duplicate-date, gap, and latest-date coverage.
- Modify `src/features/today/useTodayState.ts`: derive progress and streak from repository snapshots.
- Modify `src/features/today/useTodayState.test.ts`: verifies today progress and streak projection.
- Modify `src/ui/Progress.tsx`: renders label, rail, and count in one compact semantic unit.
- Modify `src/ui/ui.test.tsx`: verifies Header structure and compact progress semantics.
- Modify `src/ui/AppShell.tsx`: adds the requested navigation separator while retaining routes.
- Modify `src/features/today/TodayPage.tsx`: implements complete and pending single-column states.
- Modify `src/features/today/TodayPage.test.tsx`: locks homepage content and CTA rules.
- Modify `src/ui/theme.css`: applies spacing, typography, line treatments, responsive layout, and CTA styling.
- Modify `tests/e2e/accessibility.spec.ts`: validates hierarchy, mobile overflow, and unchanged bitmap hash contract.

### Task 1: Add the learning streak domain function

**Files:**
- Create: `src/domain/streak.ts`
- Create: `src/domain/streak.test.ts`

- [ ] **Step 1: Write failing streak tests**

Create `src/domain/streak.test.ts`:

```ts
import { calculateLearningStreak } from './streak';

describe('calculateLearningStreak', () => {
  it('counts unique consecutive List creation dates from the latest date', () => {
    expect(calculateLearningStreak([
      '2026-08-23', '2026-08-23', '2026-08-22', '2026-08-21', '2026-08-19',
    ], '2026-08-23')).toBe(3);
  });

  it('starts from the nearest past learning date when today has no List', () => {
    expect(calculateLearningStreak([
      '2026-08-21', '2026-08-20', '2026-08-19',
    ], '2026-08-23')).toBe(3);
  });

  it('returns zero when there is no learning history', () => {
    expect(calculateLearningStreak([], '2026-08-23')).toBe(0);
  });
});
```

- [ ] **Step 2: Verify red state**

Run:

```bash
corepack pnpm vitest run src/domain/streak.test.ts
```

Expected: FAIL because `src/domain/streak.ts` does not exist.

- [ ] **Step 3: Implement the pure streak function**

Create `src/domain/streak.ts`:

```ts
import { format, parseISO, subDays } from 'date-fns';
import type { LocalDate } from './models';

export function calculateLearningStreak(dates: LocalDate[], today: LocalDate): number {
  const unique = [...new Set(dates.filter((date) => date <= today))].sort().reverse();
  if (unique.length === 0) return 0;

  let expected = unique[0];
  let streak = 0;
  for (const date of unique) {
    if (date !== expected) break;
    streak += 1;
    expected = format(subDays(parseISO(date), 1), 'yyyy-MM-dd') as LocalDate;
  }
  return streak;
}
```

- [ ] **Step 4: Verify green state**

Run:

```bash
corepack pnpm vitest run src/domain/streak.test.ts
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit the domain function**

```bash
git add src/domain/streak.ts src/domain/streak.test.ts
git commit -m "feat: calculate consecutive learning days"
```

### Task 2: Derive homepage progress and streak

**Files:**
- Modify: `src/features/today/useTodayState.ts`
- Modify: `src/features/today/useTodayState.test.ts`

- [ ] **Step 1: Add a failing snapshot projection test**

Extend `src/features/today/useTodayState.test.ts` with a completed node, two consecutive List dates, and these assertions:

```ts
const view = buildTodayViewState('2026-08-22', snapshot);
expect(view.progress).toEqual({ completed: 1, total: 2 });
expect(view.streakDays).toBe(2);
```

The snapshot must contain one incomplete node due on `2026-08-22`, one node due on `2026-08-21` with `completedAt: '2026-08-22T09:00:00.000Z'`, and Lists created on `2026-08-22` and `2026-08-21`.

- [ ] **Step 2: Verify red state**

Run:

```bash
corepack pnpm vitest run src/features/today/useTodayState.test.ts
```

Expected: FAIL because `progress` and `streakDays` are absent.

- [ ] **Step 3: Implement projection fields**

In `buildTodayViewState`, calculate completed nodes using local date formatting and calculate the List-date streak:

```ts
const completedToday = snapshot.reviewNodes.filter((node) =>
  node.dueDate <= today
  && node.completedAt !== null
  && format(new Date(node.completedAt), 'yyyy-MM-dd') === today,
).length;
const total = selected.due.length + completedToday;

return {
  due,
  captureLocked: selected.captureLocked,
  progress: { completed: completedToday, total: Math.max(total, 1) },
  streakDays: calculateLearningStreak(snapshot.lists.map((list) => list.createdDate), today),
};
```

Import `calculateLearningStreak` from `../../domain/streak`. Expand the hook state type and initial state to include:

```ts
progress: { completed: 0, total: 1 },
streakDays: 0,
```

- [ ] **Step 4: Verify focused tests**

Run:

```bash
corepack pnpm vitest run src/features/today/useTodayState.test.ts src/domain/streak.test.ts
```

Expected: all focused tests PASS.

- [ ] **Step 5: Commit state derivation**

```bash
git add src/features/today/useTodayState.ts src/features/today/useTodayState.test.ts
git commit -m "feat: derive daily progress and learning streak"
```

### Task 3: Rebuild Header and compact progress primitives

**Files:**
- Modify: `src/ui/AppShell.tsx`
- Modify: `src/ui/Progress.tsx`
- Modify: `src/ui/ui.test.tsx`

- [ ] **Step 1: Write failing semantic tests**

Add to `src/ui/ui.test.tsx`:

```tsx
it('separates history and settings without adding a header card', () => {
  render(<MemoryRouter><AppShell><p>Content</p></AppShell></MemoryRouter>);
  expect(screen.getByRole('separator', { name: '导航分隔' })).toBeInTheDocument();
  expect(screen.getByRole('banner')).not.toHaveClass('card');
});

it('renders a compact labeled progress rail with its count', () => {
  render(<Progress value={1} max={3} label="今日进度" />);
  expect(screen.getByText('今日进度')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: '今日进度' })).toHaveAttribute('value', '1');
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
});
```

Import `Progress` from `./Progress`.

- [ ] **Step 2: Verify red state**

Run:

```bash
corepack pnpm vitest run src/ui/ui.test.tsx
```

Expected: FAIL because the navigation separator is absent.

- [ ] **Step 3: Add the semantic separator and compact progress markup**

In `AppShell`, place this between History and Settings:

```tsx
<span className="nav-separator" role="separator" aria-label="导航分隔" />
```

Change `Progress` to:

```tsx
export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div className="progress-wrap">
      <span className="progress-label">{label}</span>
      <progress value={value} max={max} aria-label={label} />
      <span className="progress-count">{value} / {max}</span>
    </div>
  );
}
```

- [ ] **Step 4: Verify UI tests**

Run:

```bash
corepack pnpm vitest run src/ui/ui.test.tsx
```

Expected: all UI tests PASS.

- [ ] **Step 5: Commit primitives**

```bash
git add src/ui/AppShell.tsx src/ui/Progress.tsx src/ui/ui.test.tsx
git commit -m "feat: refine header and progress rail"
```

### Task 4: Implement complete and pending homepage states

**Files:**
- Modify: `src/features/today/TodayPage.tsx`
- Modify: `src/features/today/TodayPage.test.tsx`

- [ ] **Step 1: Replace tests with the new content contract**

Render `TodayPage` with `progress={{ completed: 0, total: 2 }}` and `streakDays={5}` for pending state, then assert:

```tsx
expect(screen.getByRole('heading', { name: '今天还有 2 个 List 待复习' })).toBeInTheDocument();
expect(screen.queryByRole('link', { name: /记录今天所学/ })).not.toBeInTheDocument();
expect(screen.getByText('连续学习')).toBeInTheDocument();
expect(screen.getByText('5')).toBeInTheDocument();
```

Render the completed state with `due={[]}`, `progress={{ completed: 1, total: 1 }}`, and `streakDays={5}`, then assert:

```tsx
expect(screen.getByRole('heading', { name: '今天的复习已经完成。' })).toBeInTheDocument();
expect(screen.getByRole('link', { name: '记录今天所学' })).toHaveAttribute('href', '/capture');
expect(screen.queryByText(/可以记录|保持每天|表现很好/)).not.toBeInTheDocument();
expect(screen.getAllByRole('link').filter((link) => link.classList.contains('primary-capture'))).toHaveLength(1);
```

- [ ] **Step 2: Verify red state**

Run:

```bash
corepack pnpm vitest run src/features/today/TodayPage.test.tsx
```

Expected: FAIL because the current hero copy and props do not match the new contract.

- [ ] **Step 3: Implement the adaptive single-column page**

Update props to accept `progress` and `streakDays`. Use `PencilLine`, `CalendarDays`, and `ArrowRight` from Lucide. The page structure must be:

```tsx
<section className="today-page page-enter">
  <div className="today-progress"><Progress value={progress.completed} max={progress.total} label="今日进度" /></div>
  <div className={`today-core ${locked ? 'today-core--pending' : ''}`}>
    <h2 className="today-status">{locked ? `今天还有 ${due.length} 个 List 待复习` : '今天的复习已经完成。'}</h2>
    {locked ? <div className="due-list" aria-label="待复习 Lists">{/* preserve ordered List links */}</div> : (
      <Link className="primary-capture" to="/capture" aria-label="记录今天所学">
        <PencilLine aria-hidden="true" /><span>记录今天所学</span><ArrowRight aria-hidden="true" />
      </Link>
    )}
  </div>
  <div className="learning-streak" aria-label={`连续学习 ${streakDays} 天`}>
    <span aria-hidden="true" className="streak-line" />
    <span className="streak-copy"><CalendarDays aria-hidden="true" /><span>连续学习</span><strong>{streakDays}</strong><span>天</span></span>
    <span aria-hidden="true" className="streak-line" />
  </div>
</section>
```

The loading state must preserve the same top progress position and expose `role="status"` without rendering the old Eyebrow or hero title.

- [ ] **Step 4: Verify homepage tests**

Run:

```bash
corepack pnpm vitest run src/features/today/TodayPage.test.tsx src/features/today/useTodayState.test.ts
```

Expected: all focused tests PASS.

- [ ] **Step 5: Commit homepage behavior**

```bash
git add src/features/today/TodayPage.tsx src/features/today/TodayPage.test.tsx
git commit -m "feat: create focused adaptive home flow"
```

### Task 5: Apply the restrained editorial layout

**Files:**
- Modify: `src/ui/theme.css`
- Modify: `src/ui/background.test.ts`

- [ ] **Step 1: Extend the CSS contract test before editing styles**

Add assertions to `src/ui/background.test.ts`:

```ts
expect(css).toContain('.today-status');
expect(css).toContain('max-width: 330px');
expect(css).toContain('.nav-separator');
expect(css).toContain('.learning-streak');
```

Keep the existing bitmap assertions unchanged.

- [ ] **Step 2: Verify red state**

Run:

```bash
corepack pnpm vitest run src/ui/background.test.ts
```

Expected: FAIL because the new selectors and CTA constraint are absent.

- [ ] **Step 3: Replace old homepage styles**

Implement these concrete constraints in `theme.css`:

```css
.site-header { min-height: 100px; border-bottom: 1px solid rgb(63 78 68 / 12%); }
.nav-separator { width: 1px; height: 24px; background: rgb(63 78 68 / 14%); }
.today-page { min-height: calc(100dvh - 100px); display: grid; grid-template-rows: auto minmax(360px, 1fr) auto; padding-bottom: clamp(40px, 6vh, 72px); }
.today-progress { padding: 38px 0 34px; border-bottom: 1px solid rgb(63 78 68 / 10%); }
.progress-wrap { display: grid; grid-template-columns: auto minmax(120px, 1fr) auto; align-items: center; gap: clamp(24px, 4vw, 58px); }
.progress-wrap progress { height: 6px; }
.today-core { display: grid; align-content: center; justify-items: center; padding: 64px 0; text-align: center; }
.today-status { margin: 0; color: var(--ink); font: 500 clamp(1.75rem, 3vw, 2.25rem)/1.35 "Iowan Old Style", Baskerville, "Songti SC", serif; letter-spacing: -.015em; }
.primary-capture { width: min(100%, 330px); min-height: 68px; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 18px; margin-top: 56px; padding: 0 28px; color: #fbf8ef; background: #385a43; border-radius: 9px; box-shadow: 0 9px 24px rgb(42 67 49 / 15%); text-decoration: none; transition: transform 160ms ease-out, background 160ms ease-out; }
.primary-capture:hover { background: #304f3a; transform: translateY(-1px); }
.learning-streak { display: grid; grid-template-columns: minmax(50px, 220px) auto minmax(50px, 220px); align-items: center; justify-content: center; gap: 32px; color: var(--ink-soft); }
.streak-line { height: 1px; background: rgb(63 78 68 / 14%); }
.streak-copy { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
.streak-copy strong { color: var(--moss); font-size: 1.28rem; font-weight: 600; }
```

Remove obsolete `.today-intro`, `.today-title`, `.today-subtitle`, `.today-work`, and `.capture-lock` styling. Keep compact pending List rows and all background declarations unchanged.

- [ ] **Step 4: Add responsive rules**

At `max-width: 820px`, use a two-row progress layout, 24px shell gutters, smaller core padding, and flexible streak lines:

```css
.progress-wrap { grid-template-columns: 1fr auto; gap: 14px 20px; }
.progress-wrap progress { grid-column: 1 / -1; grid-row: 2; }
.today-page { grid-template-rows: auto minmax(330px, 1fr) auto; }
.today-core { padding: 52px 0; }
.learning-streak { grid-template-columns: minmax(24px, 1fr) auto minmax(24px, 1fr); gap: 16px; }
```

- [ ] **Step 5: Verify CSS and component suites**

Run:

```bash
corepack pnpm vitest run src/ui/background.test.ts src/ui/ui.test.tsx src/features/today
corepack pnpm typecheck
```

Expected: all focused tests and typecheck PASS.

- [ ] **Step 6: Commit visual implementation**

```bash
git add src/ui/theme.css src/ui/background.test.ts
git commit -m "style: refine editorial home hierarchy"
```

### Task 6: Browser acceptance and bitmap integrity

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`

- [ ] **Step 1: Record the protected background hash**

Run:

```bash
sha256sum public/assets/clipboard-paper-background.png
```

Expected hash before and after implementation: record the exact value in the task execution notes and confirm it remains identical.

- [ ] **Step 2: Add homepage hierarchy acceptance**

Add a Playwright test that clears IndexedDB, opens `/`, waits for loading to finish, and asserts:

```ts
await expect(page.getByText('今日进度')).toBeVisible();
await expect(page.getByRole('heading', { name: '今天的复习已经完成。' })).toBeVisible();
await expect(page.getByRole('link', { name: '记录今天所学' })).toHaveCount(1);
await expect(page.getByText('连续学习')).toBeVisible();
```

- [ ] **Step 3: Run focused browser acceptance**

```bash
corepack pnpm exec playwright test tests/e2e/accessibility.spec.ts
```

Expected: background, hierarchy, keyboard, and 375/768/1440 viewport tests PASS.

- [ ] **Step 4: Inspect real screenshots**

Capture `/` at 375×900 and 1440×1000. Verify Header has no card, progress is directly beneath it, status type is 28–36px, CTA is the sole primary action, streak is visually subordinate, and pending content can extend without overlap.

- [ ] **Step 5: Run full verification**

```bash
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm test:e2e
sha256sum public/assets/clipboard-paper-background.png
```

Expected: zero failures and the bitmap hash matches Step 1.

- [ ] **Step 6: Commit acceptance coverage**

```bash
git add tests/e2e/accessibility.spec.ts
git commit -m "test: cover focused homepage hierarchy"
```
