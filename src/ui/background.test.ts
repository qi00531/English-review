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
    expect(css).toContain('.history-tabs');
    expect(css).toContain('.review-plan-row');
    expect(css).toContain('.review-plan-lists');
    expect(css).toContain('.review-plan-row--completed');
    expect(css).toContain('.review-plan-row--due');
    expect(css).toContain('.review-plan-row--overdue');
    expect(css).toContain('.review-plan-row--upcoming');
    expect(css).toContain('.history-summary-row');
    expect(css).toContain('.audio-recovery');
    expect(css).toContain('.audio-unavailable');
    expect(css).toContain('width: min(calc(100vw - 112px), 1400px)');
    expect(css).toContain('left: 50%');
    expect(css).toContain('transform: translateX(-50%)');
    expect(css).toContain('background: transparent');
    expect(css).toContain('box-shadow: none');
    expect(css).toContain('transition: box-shadow 180ms ease-out');
    expect(css).toContain('.site-header:hover');
    expect(css).toContain('box-shadow: 0 10px 28px rgb(45 49 40 / 7%)');
    expect(css).toContain('width: calc(100vw - 40px)');
    expect(css).toContain('padding: clamp(88px, 10vh, 112px) 0 34px');
    expect(css).not.toContain('background: rgb(248 244 235 / 56%)');
    expect(css).not.toContain('100vmax');
    expect(css).not.toContain('clip-path: inset(0 -100vmax)');
    expect(css).toContain('.today-progress .progress-wrap');
    expect(css).toContain('width: min(100%, 840px)');
    expect(css).toContain('margin: 0 auto');
  });
});
