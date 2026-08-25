# Fixed Navigation and History Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the paper navigation visible and stable, reset navigation scroll position, give History and Settings matching hover feedback, and open the History page directly on its useful content.

**Architecture:** `AppShell` owns global navigation state: it resets window scroll on location changes and records whether the document is scrolled. `HistoryPage` stops performing its competing automatic plan-row scroll and removes its decorative heading. CSS fixes the header to the viewport, compensates main content height, and centralizes navigation action states.

**Tech Stack:** React 19, React Router 7, TypeScript, CSS, Vitest, Testing Library, Playwright

---

### Task 1: Lock the navigation behavior with failing component tests

**Files:**
- Modify: `src/ui/ui.test.tsx`
- Modify: `src/features/history/HistoryPage.test.tsx`
- Modify: `tests/e2e/accessibility.spec.ts`

- [ ] **Step 1: Test matching navigation action classes and route scroll reset**

Add `RouteSwitcher` inside `src/ui/ui.test.tsx`, render it with `AppShell`, stub `window.scrollTo`, and assert that both “历史” and “设置” have `nav-action`. Click the switcher and require `scrollTo` to receive `{ top: 0, left: 0, behavior: 'auto' }` after the pathname changes.

```tsx
function RouteSwitcher() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate('/history')}>进入历史</button>;
}

it('shares navigation feedback and resets scroll after route changes', async () => {
  const user = userEvent.setup();
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  render(<MemoryRouter><AppShell><RouteSwitcher /></AppShell></MemoryRouter>);
  expect(screen.getByRole('link', { name: '历史' })).toHaveClass('nav-action');
  expect(screen.getByRole('link', { name: '设置' })).toHaveClass('nav-action');
  scrollTo.mockClear();
  await user.click(screen.getByRole('button', { name: '进入历史' }));
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  scrollTo.mockRestore();
});
```

- [ ] **Step 2: Test the compact History page and absence of automatic scrolling**

Install a temporary `scrollIntoView` spy on `HTMLElement.prototype`, render the plan tab, and assert that the removed heading copy is absent and automatic scrolling never runs.

```tsx
it('starts with useful history content without a decorative heading or automatic scroll', () => {
  const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
  const scrollIntoView = vi.fn();
  HTMLElement.prototype.scrollIntoView = scrollIntoView;
  try {
    renderPage();
    expect(screen.queryByText('Archive')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '历史' })).not.toBeInTheDocument();
    expect(screen.queryByText('查看复习安排，或回到任意 List 再练一次。')).not.toBeInTheDocument();
    expect(scrollIntoView).not.toHaveBeenCalled();
  } finally {
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  }
});
```

- [ ] **Step 3: Add a browser regression test**

Create a tall scroll position on the home page, click History, and assert both that `window.scrollY` returns to zero and the Header stays at `top: 0` after scrolling the History page.

```ts
test('opens History at the top and keeps navigation fixed while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await clearDatabase(page);
  await page.evaluate(() => {
    document.body.style.minHeight = '2000px';
    window.scrollTo(0, 800);
  });
  await page.getByRole('link', { name: '历史' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByText('Archive')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 300));
  const headerTop = await page.getByRole('banner').evaluate((header) => header.getBoundingClientRect().top);
  expect(headerTop).toBe(0);
});
```

- [ ] **Step 4: Run the focused tests and verify RED**

Run: `corepack pnpm vitest run src/ui/ui.test.tsx src/features/history/HistoryPage.test.tsx`

Expected: FAIL because navigation actions do not share `nav-action`, route changes do not reset scroll, and History still renders its heading and calls `scrollIntoView`.

Run: `corepack pnpm playwright test tests/e2e/accessibility.spec.ts --grep "opens History at the top" --workers=1`

Expected: FAIL because the current Header scrolls out of the viewport and History still renders `Archive`.

### Task 2: Implement fixed navigation and route scroll ownership

**Files:**
- Modify: `src/ui/AppShell.tsx`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Add route and scroll state effects to `AppShell`**

Import `useEffect` and `useState`, read both `pathname` and `search` from `useLocation`, reset the window position when either changes, and subscribe to passive window scroll events.

```tsx
const { pathname, search } = useLocation();
const [scrolled, setScrolled] = useState(() => window.scrollY > 0);

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}, [pathname, search]);

useEffect(() => {
  const updateScrolled = () => setScrolled(window.scrollY > 0);
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });
  return () => window.removeEventListener('scroll', updateScrolled);
}, []);
```

Set the Header class to `site-header${scrolled ? ' site-header--scrolled' : ''}`. Apply `className="nav-action history-nav-link"` to History and `className="nav-action icon-link"` to Settings.

- [ ] **Step 2: Fix Header positioning and compensate content flow**

In `src/ui/theme.css`, change `.site-header` from `position: relative` to `position: fixed`, add `top: 0` and `z-index: 40`, and preserve its existing centered width. Add `.app-shell > main { padding-top: 100px; }`, reduced to 88px under 600px.

- [ ] **Step 3: Centralize matching navigation feedback**

Replace `.icon-link:hover` with shared state rules:

```css
.nav-action { border-radius: 9px; }
.history-nav-link { padding: 0 12px; }
.icon-link { border-radius: 50%; }
.nav-action:hover { color: var(--moss); background: var(--moss-soft); }
.site-header:hover, .site-header--scrolled { box-shadow: 0 10px 28px rgb(45 49 40 / 7%); }
```

Keep the Header background transparent and do not add a card, blur, border container, or movement.

- [ ] **Step 4: Run `AppShell` tests and verify GREEN**

Run: `corepack pnpm vitest run src/ui/ui.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit global navigation behavior**

```bash
git add src/ui/AppShell.tsx src/ui/theme.css src/ui/ui.test.tsx
git commit -m "fix: keep paper navigation fixed"
```

### Task 3: Remove History page heading and competing auto-scroll

**Files:**
- Modify: `src/features/history/HistoryPage.tsx`
- Modify: `src/features/history/HistoryPage.test.tsx`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Remove decorative heading and plan auto-positioning**

Delete the `section-heading` Header, `planRefs`, `hasPositionedPlan`, the plan-positioning `useEffect`, and the unused `findPlanFocusDate` import. Remove the callback `ref` from each plan row. Retain all tab, plan, List, edit, delete, and review behavior.

- [ ] **Step 2: Tighten History page top spacing**

Change `.history-page, .settings-page` into separate spacing rules so `.history-page` starts with `padding: var(--space-5) 0 var(--space-6)` and `.history-tabs` no longer uses a negative top margin. Keep settings spacing unchanged.

- [ ] **Step 3: Run History tests and verify GREEN**

Run: `corepack pnpm vitest run src/features/history/HistoryPage.test.tsx`

Expected: PASS.

- [ ] **Step 4: Commit the History cleanup**

```bash
git add src/features/history/HistoryPage.tsx src/features/history/HistoryPage.test.tsx src/ui/theme.css
git commit -m "refactor: simplify history entry view"
```

### Task 4: Verify real browser behavior and responsive layout

**Files:**
- Verify: `public/assets/clipboard-paper-background.png`

- [ ] **Step 1: Run the complete browser suite**

Run: `corepack pnpm playwright test --workers=1`

Expected: all Playwright tests pass, including 375px, 768px, and 1440px overflow checks.

- [ ] **Step 2: Run all non-browser verification**

Run: `corepack pnpm test`

Expected: all Vitest tests pass.

Run: `corepack pnpm typecheck`

Expected: exit code 0.

Run: `corepack pnpm build`

Expected: exit code 0.

Run: `sha256sum public/assets/clipboard-paper-background.png`

Expected: `12eee4f1326a320ac7f94ca675579b40e7bd4f8bac9843b8c6fd60db11b6d20d`.

- [ ] **Step 3: Inspect desktop and mobile screenshots**

At 1440×900 and 375×900, verify that the fixed Header stays aligned, does not cover History tabs, uses no persistent card background, and gives History and Settings matching hover feedback.

- [ ] **Step 4: Commit the browser regression test**

```bash
git add tests/e2e/accessibility.spec.ts
git commit -m "test: cover fixed history navigation"
```
