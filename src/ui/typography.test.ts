// @vitest-environment node
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const css = readFileSync(new URL('./theme.css', import.meta.url), 'utf8');

it('uses an explicit readable Chinese UI typography hierarchy', () => {
  expect(css).toContain('--font-ui: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif');
  expect(css).toMatch(/\.history-nav-link\s*{[^}]*font-size:\s*1rem[^}]*font-weight:\s*500/s);
  expect(css).toMatch(/\.primary-capture\s*{[^}]*font-size:\s*1\.0625rem[^}]*font-weight:\s*500/s);
  expect(css).toMatch(/\.history-tabs button\s*{[^}]*font-size:\s*1rem/s);
  expect(css).toMatch(/\.review-plan-row time\s*{[^}]*1\.25rem/s);
  expect(css).toMatch(/\.review-plan-status\s*{[^}]*font-size:\s*\.9375rem/s);
  expect(css).toMatch(/\.review-header > strong\s*{[^}]*font-size:\s*1rem/s);
  expect(css).toMatch(/\.word-meanings\s*{[^}]*font-size:\s*1\.1875rem/s);
  expect(css).toMatch(/\.example-reveal\s*{[^}]*font-size:\s*1\.0625rem/s);
});
