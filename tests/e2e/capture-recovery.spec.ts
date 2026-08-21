import { expect, test } from '@playwright/test';
import { clearDatabase, ready } from './helpers';

test('allows a failed term to be retried without losing successful work', async ({ page }) => {
  await clearDatabase(page); let calls = 0;
  await page.route('**/api/enrich', async (route) => { calls += 1; const body = route.request().postDataJSON() as { terms: string[] }; const results = calls === 1 ? body.terms.map((term, i) => i ? { status: 'error', english: term, code: 'AI_UNAVAILABLE', message: '暂时失败' } : ready(term)) : body.terms.map(ready); await route.fulfill({ json: { results } }); });
  await page.goto('/capture'); await page.getByLabel('今天学到的英文').fill('focus\nrecover'); await page.getByRole('button', { name: '生成学习内容' }).click();
  await expect(page.getByText('暂时失败')).toBeVisible(); await page.getByRole('button', { name: '重试 recover' }).click(); await expect(page.getByLabel('recover 的中文义项')).toBeVisible();
});
