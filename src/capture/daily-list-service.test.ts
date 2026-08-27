import { describe, expect, it, vi } from 'vitest';
import type { CaptureDraft } from './model';
import { DailyListService } from './daily-list-service';

const readyCapture: CaptureDraft = {
  id: 'capture-1', text: 'retain', normalizedText: 'retain', type: 'word',
  meaningsZh: ['保持', '保留'], exampleEn: 'We retain more through review.',
  exampleZh: '通过复习，我们记住更多。', usIpa: '/rɪˈteɪn/', ukIpa: null,
  usAudioUrl: null, ukAudioUrl: null, audioFallback: 'speech-synthesis',
  status: 'ready', capturedAt: '2026-08-27T08:00:00.000Z',
};

describe('DailyListService', () => {
  it('saves a ready capture to the injected local date and returns its List', async () => {
    const appendToDailyList = vi.fn().mockResolvedValue({
      ok: true, list: { id: 'list-3', listNumber: 3, createdDate: '2026-08-27', createdAt: '' },
    });
    const service = new DailyListService({ appendToDailyList }, () => '2026-08-27');

    await expect(service.saveCapture(readyCapture, false)).resolves.toEqual({
      ok: true, listId: 'list-3', listNumber: 3,
    });
    expect(appendToDailyList).toHaveBeenCalledWith('2026-08-27', [expect.objectContaining({
      english: 'retain', meaningsZh: ['保持', '保留'], source: 'ai',
    })], false);
  });

  it('rejects non-ready captures before writing', async () => {
    const appendToDailyList = vi.fn();
    const service = new DailyListService({ appendToDailyList }, () => '2026-08-27');
    await expect(service.saveCapture({ ...readyCapture, status: 'failed' }, false))
      .resolves.toEqual({ ok: false, code: 'INVALID_DRAFT' });
    expect(appendToDailyList).not.toHaveBeenCalled();
  });

  it('returns the first duplicate List without writing a success', async () => {
    const appendToDailyList = vi.fn().mockResolvedValue({
      ok: false, code: 'DUPLICATE',
      duplicates: [{ listId: 'list-1', listNumber: 1, normalizedEnglish: 'retain' }],
    });
    const service = new DailyListService({ appendToDailyList }, () => '2026-08-27');
    await expect(service.saveCapture(readyCapture, false)).resolves.toEqual({
      ok: false, code: 'DUPLICATE', duplicate: { listId: 'list-1', listNumber: 1 },
    });
  });
});
