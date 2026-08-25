# Stable Paper Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Word Journal header controls fixed at identical horizontal positions across routes, render the header directly on the paper with a hover-only shadow, and move home progress below the clipboard clip without changing the background asset.

**Architecture:** Keep the existing React markup and route-specific content widths. Give `.site-header` a viewport-derived width and center it independently of `.app-shell`, then express the transparent and hover states entirely in CSS. Protect the behavior with source-level CSS contracts and a Playwright route-position test.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Playwright

---

### Task 1: Lock the visual contract with failing tests

**Files:**
- Modify: `src/ui/background.test.ts`
- Modify: `tests/e2e/accessibility.spec.ts`

- [ ] **Step 1: Replace the old home-header assertions with the new CSS contract**

Add assertions requiring a transparent header, viewport-derived desktop/mobile widths, centered positioning, hover-only shadow, 180ms transition, and the larger home progress top padding. Remove assertions that require the old semi-transparent home header.

- [ ] **Step 2: Add a route stability browser test**

Capture the bounding boxes for the brand, history link, and settings link on `/`, navigate to `/history` and `/settings`, and assert that each control's `x` coordinate stays within one pixel at a 1440px viewport.

- [ ] **Step 3: Run the focused unit test and verify RED**

Run: `corepack pnpm vitest run src/ui/background.test.ts`

Expected: FAIL because the current CSS still has the home-only background and lacks the stable header layout and hover shadow.

- [ ] **Step 4: Run the focused Playwright test and verify RED**

Run: `corepack pnpm playwright test tests/e2e/accessibility.spec.ts --grep "keeps navigation controls fixed" --workers=1`

Expected: FAIL because the header currently inherits different home and inner shell widths.

### Task 2: Implement the stable transparent header and progress spacing

**Files:**
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Center the header independently from route content**

Set `.site-header` to `position: relative`, `left: 50%`, `width: min(calc(100vw - 112px), 1400px)`, and `transform: translateX(-50%)`. Keep its current flex layout, minimum height, and faint bottom divider.

- [ ] **Step 2: Apply the transparent default and hover-only feedback**

Remove the home-only header background. Set `background: transparent` and `box-shadow: none` on `.site-header`, add `transition: box-shadow 180ms ease-out`, and add `.site-header:hover { box-shadow: 0 10px 28px rgb(45 49 40 / 7%); }`. Do not add a hover background, radius, or movement.

- [ ] **Step 3: Add the mobile safe width**

Inside the existing `max-width: 820px` media query, set `.site-header { width: calc(100vw - 40px); }` so the header retains 20px viewport margins without overflow.

- [ ] **Step 4: Move home progress below the clip**

Change `.today-progress` desktop padding to `clamp(88px, 10vh, 112px) 0 34px` and its mobile padding to `72px 0 24px`. Keep the existing 840px progress width, 6px track, colors, labels, and responsive two-row layout.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `corepack pnpm vitest run src/ui/background.test.ts`

Expected: PASS.

Run: `corepack pnpm playwright test tests/e2e/accessibility.spec.ts --workers=1`

Expected: PASS, including route stability and 375/768/1440 overflow coverage.

### Task 3: Verify the complete result

**Files:**
- Verify only: `public/assets/clipboard-paper-background.png`

- [ ] **Step 1: Verify the unchanged background asset**

Run: `sha256sum public/assets/clipboard-paper-background.png`

Expected: `12eee4f1326a320ac7f94ca675579b40e7bd4f8bac9843b8c6fd60db11b6d20d`.

- [ ] **Step 2: Run the full automated checks**

Run: `corepack pnpm test`

Expected: all Vitest tests pass.

Run: `corepack pnpm typecheck`

Expected: exit code 0.

Run: `corepack pnpm build`

Expected: exit code 0.

Run: `corepack pnpm playwright test --workers=1`

Expected: all Playwright tests pass.

- [ ] **Step 3: Perform visual checks at representative viewports**

Inspect screenshots at 375px and 1440px. Confirm the header controls do not move between home/history/settings, the default header remains transparent, the hover shadow is subtle, the progress row is below the clip, and there is no horizontal overflow.

- [ ] **Step 4: Commit the implementation**

```bash
git add src/ui/theme.css src/ui/background.test.ts tests/e2e/accessibility.spec.ts
git commit -m "fix: stabilize paper navigation layout"
```
