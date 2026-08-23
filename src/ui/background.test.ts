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
    expect(css).toContain('.today-status');
    expect(css).toContain('max-width: 330px');
    expect(css).toContain('.nav-separator');
    expect(css).toContain('.learning-streak');
  });
});
