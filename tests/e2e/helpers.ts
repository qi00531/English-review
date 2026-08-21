import type { Page } from '@playwright/test';

export async function clearDatabase(page: Page) {
  await page.goto('/');
  await page.evaluate(() => new Promise<void>((resolve, reject) => { const req = indexedDB.deleteDatabase('english-review'); req.onsuccess = () => resolve(); req.onerror = () => reject(req.error); }));
  await page.reload();
}

export const ready = (english: string) => ({ status: 'ready', english, usIpa: '/test/', ukIpa: '/test/', usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['测试释义'], exampleEn: `${english} helps me learn.`, exampleZh: `${english} 帮助我学习。`, audioFallback: 'speech-synthesis', source: 'ai' });
