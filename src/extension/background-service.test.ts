import { describe, expect, it, vi } from 'vitest';
import type { CaptureDraft } from '../capture/model';
import { CaptureBackgroundService } from './background-service';

const draft: CaptureDraft = {
  id: 'c1', text: 'potential', normalizedText: 'potential', type: 'word', meaningsZh: ['潜力'],
  exampleEn: 'She has potential.', exampleZh: '她有潜力。', usIpa: null, ukIpa: null,
  usAudioUrl: null, ukAudioUrl: null, audioFallback: 'speech-synthesis', status: 'ready', capturedAt: '2026-08-25T00:00:00.000Z',
};

function setup(duplicate: { listId: string; listNumber: number } | null = null) {
  const repository = { findDuplicate: vi.fn().mockResolvedValue(duplicate) };
  const dailyList = { saveCapture: vi.fn().mockResolvedValue({ ok: true, listId: 'l3', listNumber: 3 }) };
  const service = new CaptureBackgroundService(repository, vi.fn().mockResolvedValue({ baseUrl: 'x', model: 'm', apiKey: 'k', enabled: true }), vi.fn().mockResolvedValue(draft), dailyList);
  return { service, repository, dailyList };
}

describe('CaptureBackgroundService', () => {
  it('validates before enrichment', async () => {
    const { service } = setup();
    await expect(service.preview('学习')).resolves.toEqual({ ok: false, code: 'NOT_ENGLISH' });
  });

  it('previews an enriched selection with duplicate metadata', async () => {
    const duplicate = { listId: 'l1', listNumber: 1 };
    const { service } = setup(duplicate);
    await expect(service.preview('potential')).resolves.toEqual({ ok: true, draft, duplicate });
  });

  it('requires explicit duplicate override when saving', async () => {
    const { service, dailyList } = setup({ listId: 'l1', listNumber: 1 });
    await expect(service.save(draft, false)).resolves.toEqual({ ok: false, code: 'DUPLICATE', duplicate: { listId: 'l1', listNumber: 1 } });
    await expect(service.save(draft, true)).resolves.toEqual({ ok: true, listId: 'l3', listNumber: 3 });
    expect(dailyList.saveCapture).toHaveBeenCalledWith(draft, true);
  });
});
