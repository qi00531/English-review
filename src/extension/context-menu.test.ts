import { expect, it, vi } from 'vitest';
import { deliverSelectionCapture } from './context-menu';

it('injects the content script and retries when a page has no receiver', async () => {
  const sendMessage = vi.fn().mockRejectedValueOnce(new Error('Receiving end does not exist')).mockResolvedValueOnce(undefined);
  const executeScript = vi.fn().mockResolvedValue(undefined);

  await deliverSelectionCapture(7, 'potential', { sendMessage }, { executeScript });

  expect(executeScript).toHaveBeenCalledWith({ target: { tabId: 7 }, files: ['extension/content.js'] });
  expect(sendMessage).toHaveBeenCalledTimes(2);
});
