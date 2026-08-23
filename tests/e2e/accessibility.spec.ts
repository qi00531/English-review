import { expect, test } from '@playwright/test';
import { clearDatabase } from './helpers';

for (const width of [375, 768, 1440]) test(`core pages fit a ${width}px viewport`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); await clearDatabase(page);
  await expect(page.getByRole('heading', { name: 'Word Journal' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('keyboard navigation exposes a visible skip link', async ({ page }) => {
  await clearDatabase(page); await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳到主要内容' })).toBeFocused();
});

test('loads the generated clipboard background', async ({ page }) => {
  await page.goto('/');
  const background = await page.getByTestId('app-shell').evaluate((element) =>
    getComputedStyle(element, '::before').backgroundImage,
  );
  expect(background).toContain('clipboard-paper-background.png');
});

test('presents the focused completed-day hierarchy', async ({ page }) => {
  await clearDatabase(page);
  await expect(page.getByText('今日进度')).toBeVisible();
  await expect(page.getByRole('heading', { name: '今天的复习已经完成。' })).toBeVisible();
  await expect(page.getByRole('link', { name: '记录今天所学' })).toHaveCount(1);
  await expect(page.getByText('连续学习')).toBeVisible();
});
