import { fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CaptureDraft } from '../capture/model';
import { createCaptureOverlay } from './capture-overlay';

const draft: CaptureDraft = {
  id: 'c1', text: 'take into account', normalizedText: 'take into account', type: 'phrase',
  meaningsZh: ['考虑'], exampleEn: 'Take it into account.', exampleZh: '把它考虑进去。',
  usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null,
  audioFallback: 'speech-synthesis', status: 'ready', capturedAt: '2026-08-25T00:00:00.000Z',
};

describe('capture overlay', () => {
  afterEach(() => document.body.replaceChildren());

  it('requests preview only after launcher click and saves edited content', async () => {
    const user = userEvent.setup();
    const sendMessage = vi.fn()
      .mockResolvedValueOnce({ ok: true, draft, duplicate: null })
      .mockResolvedValueOnce({ ok: true, listId: 'l3', listNumber: 3 });
    const overlay = createCaptureOverlay({ sendMessage });
    const ui = within(overlay.root as unknown as HTMLElement);
    overlay.showLauncher('take into account', new DOMRect(20, 30, 100, 20));

    expect(sendMessage).not.toHaveBeenCalled();
    await user.click(ui.getByRole('button', { name: '收录到 Word Journal' }));
    expect(sendMessage).toHaveBeenCalledWith({ type: 'PREVIEW_CAPTURE', text: 'take into account' });
    fireEvent.change(ui.getByLabelText('中文释义'), { target: { value: '纳入考虑' } });
    await user.click(ui.getByRole('button', { name: '加入今日 List' }));
    expect(sendMessage).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'SAVE_CAPTURE', draft: expect.objectContaining({ meaningsZh: ['纳入考虑'] }), allowDuplicate: false,
    }));
    expect(ui.getByText('已加入 List 3')).toBeInTheDocument();
  });

  it('shows safe error details, copies them, and retries the selection', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const error = {
      code: 'AUTH_FAILED', message: 'AI 服务认证失败，请检查 API Key', stage: 'enrich',
      status: 401, detail: '错误类型: AUTH_FAILED\n阶段: enrich\n状态码: 401',
    };
    const sendMessage = vi.fn()
      .mockResolvedValueOnce({ ok: false, error })
      .mockResolvedValueOnce({ ok: true, draft, duplicate: null });
    const overlay = createCaptureOverlay({ sendMessage });
    const ui = within(overlay.root as unknown as HTMLElement);
    overlay.showLauncher(draft.text, new DOMRect());

    await user.click(ui.getByRole('button', { name: '收录到 Word Journal' }));
    expect(ui.getByRole('alert')).toHaveTextContent(error.message);
    await user.click(ui.getByRole('button', { name: '复制错误详情' }));
    expect(writeText).toHaveBeenCalledWith(error.detail);
    await user.click(ui.getByRole('button', { name: '重试' }));
    expect(sendMessage).toHaveBeenLastCalledWith({ type: 'PREVIEW_CAPTURE', text: draft.text });
    expect(ui.getByRole('button', { name: '加入今日 List' })).toBeInTheDocument();
  });

  it('retries a failed save with the edited preview intact', async () => {
    const user = userEvent.setup();
    const error = {
      code: 'STORAGE_FAILED', message: '本地保存失败，请重试', stage: 'save',
      detail: '错误类型: STORAGE_FAILED\n阶段: save',
    };
    const sendMessage = vi.fn()
      .mockResolvedValueOnce({ ok: true, draft, duplicate: null })
      .mockResolvedValueOnce({ ok: false, error })
      .mockResolvedValueOnce({ ok: true, listId: 'l3', listNumber: 3 });
    const overlay = createCaptureOverlay({ sendMessage });
    const ui = within(overlay.root as unknown as HTMLElement);
    overlay.showLauncher(draft.text, new DOMRect());
    await user.click(ui.getByRole('button', { name: '收录到 Word Journal' }));
    fireEvent.change(ui.getByLabelText('中文释义'), { target: { value: '完整考虑' } });
    await user.click(ui.getByRole('button', { name: '加入今日 List' }));
    await user.click(ui.getByRole('button', { name: '重试' }));
    expect(sendMessage).toHaveBeenLastCalledWith(expect.objectContaining({
      type: 'SAVE_CAPTURE', draft: expect.objectContaining({ meaningsZh: ['完整考虑'] }),
    }));
    expect(ui.getByText('已加入 List 3')).toBeInTheDocument();
  });

  it('requires explicit override for a duplicate', async () => {
    const user = userEvent.setup();
    const sendMessage = vi.fn().mockResolvedValueOnce({ ok: true, draft, duplicate: { listId: 'l1', listNumber: 1 } }).mockResolvedValueOnce({ ok: true });
    const overlay = createCaptureOverlay({ sendMessage });
    const ui = within(overlay.root as unknown as HTMLElement);
    overlay.showLauncher(draft.text, new DOMRect());
    await user.click(ui.getByRole('button', { name: '收录到 Word Journal' }));
    expect(ui.getByText('已收录于 List 1')).toBeInTheDocument();
    await user.click(ui.getByRole('button', { name: '再次加入' }));
    expect(sendMessage).toHaveBeenLastCalledWith(expect.objectContaining({ allowDuplicate: true }));
  });

  it('dismisses on Escape', () => {
    const overlay = createCaptureOverlay({ sendMessage: vi.fn() });
    const ui = within(overlay.root as unknown as HTMLElement);
    overlay.showLauncher('potential', new DOMRect());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(ui.queryByRole('button', { name: '收录到 Word Journal' })).not.toBeInTheDocument();
  });
});
