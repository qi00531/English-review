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

test('keeps navigation controls fixed across routes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await clearDatabase(page);

  const navigationPositions = async () => {
    const brand = await page.getByRole('link', { name: 'Word Journal 首页' }).boundingBox();
    const history = await page.getByRole('link', { name: '历史' }).boundingBox();
    const settings = await page.getByRole('link', { name: '设置' }).boundingBox();
    expect(brand).not.toBeNull();
    expect(history).not.toBeNull();
    expect(settings).not.toBeNull();
    return { brand: brand!.x, history: history!.x, settings: settings!.x };
  };

  const home = await navigationPositions();
  for (const path of ['/history', '/settings']) {
    await page.goto(path);
    const current = await navigationPositions();
    expect(current.brand).toBeCloseTo(home.brand, 0);
    expect(current.history).toBeCloseTo(home.history, 0);
    expect(current.settings).toBeCloseTo(home.settings, 0);
  }
});

test('opens History at the top and keeps navigation fixed while scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await clearDatabase(page);
  await page.evaluate(() => {
    document.body.style.minHeight = '2000px';
    window.scrollTo(0, 800);
  });
  await page.getByRole('link', { name: '历史' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByText('Archive')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 300));
  const headerTop = await page.getByRole('banner').evaluate((header) => header.getBoundingClientRect().top);
  expect(headerTop).toBe(0);
});

test('presents the focused completed-day hierarchy', async ({ page }) => {
  await clearDatabase(page);
  await expect(page.getByText('今日进度')).toBeVisible();
  await expect(page.getByRole('heading', { name: '今天的复习已经完成。' })).toBeVisible();
  await expect(page.getByRole('link', { name: '记录今天所学' })).toHaveCount(1);
  await expect(page.getByText('连续学习')).toBeVisible();
});
