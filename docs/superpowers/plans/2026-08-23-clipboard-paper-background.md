# Clipboard Paper Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a real textured clipboard-paper bitmap and integrate it as the responsive visual foundation of the Word Journal homepage and supporting pages.

**Architecture:** A single project-owned 2048×1152 raster asset provides all paper fibers, torn edges, metal, lighting, and desk texture. `AppShell` derives a home/inner modifier from the current route, while CSS only positions the bitmap, adds a restrained readability wash, and supplies a solid-color loading fallback.

**Tech Stack:** React 19, React Router, CSS, Vitest, Playwright, built-in image generation.

---

## File map

- Create `public/assets/clipboard-paper-background.png`: generated production background with no embedded text.
- Create `src/ui/background.test.ts`: guards asset presence, dimensions, and non-repeating CSS usage.
- Modify `src/ui/AppShell.tsx`: exposes home and inner page modifiers without changing navigation behavior.
- Modify `src/ui/ui.test.tsx`: verifies route-sensitive shell semantics.
- Modify `src/ui/theme.css`: applies the bitmap, responsive crop, readability layer, and solid fallback.
- Modify `tests/e2e/accessibility.spec.ts`: verifies background loading and content containment at supported viewports.

### Task 1: Generate and validate the production bitmap

**Files:**
- Create: `public/assets/clipboard-paper-background.png`

- [ ] **Step 1: Generate one project-bound bitmap from the approved reference direction**

Use the built-in image generation tool with the conversation reference image as a style/composition reference and this prompt:

```text
Use case: product-mockup
Asset type: responsive website background for an English study journal
Primary request: Create a wide, photorealistic handcrafted clipboard-paper background inspired by the reference image.
Input image: the user-provided clipboard and handmade paper image is a composition and material reference, not an edit target.
Scene/backdrop: matte deep warm gray-brown desktop, quiet and evenly lit.
Subject: one large centered sheet of warm ivory handmade paper with naturally deckled edges and visible low-contrast fibers; a substantial muted antique-bronze metal clip centered at the top.
Composition/framing: 16:9 landscape, clip fully visible near the upper center, paper occupies most of the frame and provides a broad uninterrupted central safe area for web content; enough desk margin remains around the paper.
Lighting/mood: soft diffuse daylight, restrained realistic shadows, calm focused study mood.
Materials/textures: genuine fibrous paper, subtle tonal variation, brushed aged metal, matte desk.
Constraints: no words, no letters, no UI, no icons, no rules, no stationery, no plants, no watermark; paper center must stay visually quiet; preserve readability; no repeated or tiled texture.
```

Copy the selected built-in output into `public/assets/clipboard-paper-background.png`. Do not leave the consumed asset only under the generator output directory.

- [ ] **Step 2: Inspect the generated image**

Use `view_image` on the saved workspace path and reject the image if the clip is cropped, the center contains objects, the paper lacks visible fibers, or any text/watermark appears.

- [ ] **Step 3: Verify dimensions and file type**

Run:

```bash
file public/assets/clipboard-paper-background.png
```

Expected: PNG image data with landscape dimensions of at least 1536×864; target 2048×1152.

- [ ] **Step 4: Commit the approved asset**

```bash
git add public/assets/clipboard-paper-background.png
git commit -m "feat: add textured clipboard paper background"
```

### Task 2: Add route-aware background semantics with TDD

**Files:**
- Modify: `src/ui/AppShell.tsx`
- Modify: `src/ui/ui.test.tsx`

- [ ] **Step 1: Write failing route-sensitive shell tests**

Add these cases to `src/ui/ui.test.tsx`:

```tsx
it('marks the homepage for the full clipboard composition', () => {
  render(<MemoryRouter initialEntries={['/']}><AppShell><p>Content</p></AppShell></MemoryRouter>);
  expect(screen.getByTestId('app-shell')).toHaveClass('app-shell--home');
});

it('marks inner pages for the quiet paper crop', () => {
  render(<MemoryRouter initialEntries={['/history']}><AppShell><p>Content</p></AppShell></MemoryRouter>);
  expect(screen.getByTestId('app-shell')).toHaveClass('app-shell--inner');
});
```

- [ ] **Step 2: Run the focused test and verify red state**

Run:

```bash
corepack pnpm vitest run src/ui/ui.test.tsx
```

Expected: FAIL because `AppShell` has no route-specific modifier or test id.

- [ ] **Step 3: Implement the route modifier**

Update `AppShell` to use the existing router context:

```tsx
import { NavLink, useLocation } from 'react-router-dom';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const pageClass = pathname === '/' ? 'app-shell--home' : 'app-shell--inner';

  return (
    <div className={`app-shell ${pageClass}`} data-testid="app-shell">
      {/* keep the existing skip link, header, navigation, and main unchanged */}
    </div>
  );
}
```

- [ ] **Step 4: Verify focused tests pass**

Run:

```bash
corepack pnpm vitest run src/ui/ui.test.tsx
```

Expected: all `src/ui/ui.test.tsx` tests PASS.

- [ ] **Step 5: Commit route semantics**

```bash
git add src/ui/AppShell.tsx src/ui/ui.test.tsx
git commit -m "feat: distinguish home and inner paper layouts"
```

### Task 3: Apply the bitmap without programmatic texture

**Files:**
- Create: `src/ui/background.test.ts`
- Modify: `src/ui/theme.css`

- [ ] **Step 1: Write a failing CSS contract test**

Create `src/ui/background.test.ts`:

```ts
// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./theme.css', import.meta.url), 'utf8');

describe('clipboard background', () => {
  it('uses the generated bitmap once and does not synthesize paper texture', () => {
    expect(css).toContain("url('/assets/clipboard-paper-background.png')");
    expect(css).toContain('background-repeat: no-repeat');
    expect(css).not.toContain('repeating-radial-gradient');
    expect(css).not.toContain('repeating-linear-gradient');
  });
});
```

- [ ] **Step 2: Run the CSS contract and verify red state**

Run:

```bash
corepack pnpm vitest run src/ui/background.test.ts
```

Expected: FAIL because `theme.css` does not reference the generated bitmap.

- [ ] **Step 3: Add a single fixed background layer and readability wash**

Add CSS following this contract:

```css
body { background: #817c73; }

.app-shell::before {
  position: fixed;
  inset: 0;
  z-index: -2;
  background-color: #817c73;
  background-image: url('/assets/clipboard-paper-background.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  content: '';
}

.app-shell::after {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgb(246 241 229 / 10%);
  pointer-events: none;
  content: '';
}

.app-shell--home { min-height: 100dvh; }
.app-shell--inner::before { background-position: center 58%; filter: saturate(.82) brightness(1.08); }
.app-shell--inner::after { background: rgb(246 241 229 / 48%); }
```

Tune only positioning, sizing, opacity, and fallback colors against the actual image. Do not create paper fibers or clip shapes in CSS.

- [ ] **Step 4: Add responsive crop rules**

```css
@media (max-width: 820px) {
  .app-shell::before { background-size: auto 100%; background-position: center top; }
  .app-shell::after { background: rgb(246 241 229 / 18%); }
  .app-shell--inner::after { background: rgb(246 241 229 / 58%); }
}
```

Adjust existing header and homepage top padding only if visual inspection shows the metal clip overlaps navigation or the main heading.

- [ ] **Step 5: Verify CSS contract and UI tests**

Run:

```bash
corepack pnpm vitest run src/ui/background.test.ts src/ui/ui.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 6: Commit the integration**

```bash
git add src/ui/background.test.ts src/ui/theme.css
git commit -m "feat: apply responsive clipboard background"
```

### Task 4: Browser acceptance and final verification

**Files:**
- Modify: `tests/e2e/accessibility.spec.ts`

- [ ] **Step 1: Add a failing browser asset assertion**

Add:

```ts
test('loads the generated clipboard background', async ({ page }) => {
  await page.goto('/');
  const background = await page.getByTestId('app-shell').evaluate((element) =>
    getComputedStyle(element, '::before').backgroundImage,
  );
  expect(background).toContain('clipboard-paper-background.png');
});
```

- [ ] **Step 2: Run the focused browser test**

Run:

```bash
corepack pnpm exec playwright test tests/e2e/accessibility.spec.ts
```

Expected before the CSS integration: FAIL because the bitmap is absent; after Task 3: PASS.

- [ ] **Step 3: Inspect the actual page at three widths**

Open the running app at 375×900, 768×900, and 1440×1000. Verify the full clip is visible on desktop, the mobile crop keeps content on paper, inner pages suppress the complete clip, focus rings remain visible, and no text crosses onto the dark desk.

- [ ] **Step 4: Run the complete verification suite**

```bash
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm test:e2e
```

Expected: 0 failures; `dist/assets` and the copied public background are present in the build output.

- [ ] **Step 5: Commit browser acceptance**

```bash
git add tests/e2e/accessibility.spec.ts
git commit -m "test: verify clipboard background across viewports"
```
