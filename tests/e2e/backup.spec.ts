import { expect, test } from '@playwright/test';
import { clearDatabase } from './helpers';

test('settings exposes local-data warning and JSON backup controls', async ({ page }) => {
  await clearDatabase(page); await page.goto('/settings');
  await expect(page.getByText(/清除浏览器站点数据也会删除/)).toBeVisible();
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: '导出 JSON 备份' }).click();
  expect((await download).suggestedFilename()).toMatch(/english-review-\d{4}-\d{2}-\d{2}\.json/);
});
