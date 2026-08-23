import { expect, test } from '@playwright/test';
import { clearDatabase, ready } from './helpers';

test('captures English terms and persists the List after reload', async ({ page }) => {
  await clearDatabase(page);
  await page.route('**/api/enrich', async (route) => { const body = route.request().postDataJSON() as { terms: string[] }; await route.fulfill({ json: { results: body.terms.map(ready) } }); });
  await page.getByRole('link', { name: /记录今天所学/ }).click();
  await page.getByLabel('今天学到的英文').fill('focus\nresilient');
  await page.getByRole('button', { name: '生成学习内容' }).click();
  await expect(page.getByText('focus', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '保存到今日 List' }).click();
  await page.getByRole('link', { name: '历史' }).click();
  await expect(page.getByRole('tab', { name: '复习计划' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('List 1');
  await page.getByRole('tab', { name: '全部 Lists' }).click();
  await expect(page.getByRole('button', { name: /List 1/ })).toContainText('2 个词条');
  await page.getByRole('link', { name: '开始复习 List 1' }).click();
  await page.getByRole('button', { name: '下一个' }).click();
  await page.getByRole('button', { name: '完成复习' }).click();
  await expect(page).toHaveURL(/\/history\?tab=lists$/);
  await expect(page.getByRole('tab', { name: '全部 Lists' })).toHaveAttribute('aria-selected', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: /List 1/ })).toBeVisible();
});
