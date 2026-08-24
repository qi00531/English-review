# Home Progress and Header Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the homepage progress labels and rail inside the paper safe area while making the header blend into the paper texture.

**Architecture:** Keep the existing React structure and implement the refinement entirely through scoped homepage CSS. Add source-level CSS assertions for the design contract and use the existing Playwright viewport suite to catch overflow or layout regressions.

**Tech Stack:** CSS, React 19, Vitest, Playwright

---

## File Structure

- Modify `src/ui/theme.css`: constrain the homepage progress group and replace the full-viewport header wash with a restrained translucent surface.
- Modify `src/ui/background.test.ts`: protect the new CSS contract and ensure the full-viewport header expansion does not return.
- Verify `tests/e2e/accessibility.spec.ts`: reuse its 375px, 768px, and 1440px overflow coverage without changing the test unless it fails to exercise the homepage.

### Task 1: Specify the Homepage CSS Contract

**Files:**
- Modify: `src/ui/background.test.ts`

- [ ] **Step 1: Write the failing header and progress assertions**

Extend the existing clipboard-background test with:

```ts
expect(css).toContain('.app-shell--home .site-header');
expect(css).toContain('background: rgb(248 244 235 / 56%)');
expect(css).not.toContain('100vmax');
expect(css).not.toContain('clip-path: inset(0 -100vmax)');
expect(css).toContain('.today-progress .progress-wrap');
expect(css).toContain('width: min(100%, 840px)');
expect(css).toContain('margin: 0 auto');
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
corepack pnpm vitest run src/ui/background.test.ts
```

Expected: FAIL because the current Header still contains `100vmax` and the homepage progress wrapper has no 840px width constraint.

### Task 2: Implement the Scoped Visual Refinement

**Files:**
- Modify: `src/ui/theme.css`
- Modify: `src/ui/background.test.ts`

- [ ] **Step 1: Replace the homepage Header wash**

Replace the current homepage Header rule with:

```css
.app-shell--home .site-header {
  color: var(--ink);
  background: rgb(248 244 235 / 56%);
  border-bottom-color: rgb(63 78 68 / 8%);
}
```

Do not change `.site-header` sizing, navigation hit areas, hover states, or the inner-page treatment.

- [ ] **Step 2: Constrain and center the homepage progress group**

Add directly after `.today-progress`:

```css
.today-progress .progress-wrap {
  width: min(100%, 840px);
  margin: 0 auto;
  gap: clamp(20px, 3vw, 40px);
}
```

Keep the existing 6px progress height and mobile grid override.

- [ ] **Step 3: Run the focused CSS test**

Run:

```bash
corepack pnpm vitest run src/ui/background.test.ts src/ui/ui.test.tsx
```

Expected: both test files PASS.

- [ ] **Step 4: Commit the visual contract and implementation**

```bash
git add src/ui/theme.css src/ui/background.test.ts
git commit -m "style: refine home progress and header"
```

### Task 3: Responsive and Regression Verification

**Files:**
- Verify only

- [ ] **Step 1: Run all unit and component tests**

Run:

```bash
corepack pnpm test
```

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Run typecheck and production build**

Run:

```bash
corepack pnpm typecheck
corepack pnpm build
```

Expected: TypeScript exits with code 0 and Vite creates `dist/`.

- [ ] **Step 3: Run browser tests serially**

Run:

```bash
corepack pnpm playwright test --workers=1
```

Expected: the existing 375px, 768px, and 1440px homepage viewport checks report no horizontal overflow, and all browser tests PASS.

- [ ] **Step 4: Confirm the generated background image is unchanged**

Run:

```bash
sha256sum public/assets/clipboard-paper-background.png
```

Expected:

```text
12eee4f1326a320ac7f94ca675579b40e7bd4f8bac9843b8c6fd60db11b6d20d  public/assets/clipboard-paper-background.png
```

- [ ] **Step 5: Inspect the final branch state**

Run:

```bash
git diff --check
git status --short
git log --oneline -5
```

Expected: no whitespace errors, no uncommitted implementation files, and the homepage refinement commit appears at the top of history.
