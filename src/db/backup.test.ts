import { exportBackup, importBackup } from './backup';
import { EnglishReviewRepository, type EntryDraft } from './repository';
import { EnglishReviewDatabase } from './schema';

const draft: EntryDraft = {
  english: 'retain', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null,
  meaningsZh: ['保持', '保留'], exampleEn: 'We retain more through review.',
  exampleZh: '通过复习，我们记住更多。', audioFallback: 'speech-synthesis',
  source: 'ai',
};

describe('backup and restore', () => {
  let db: EnglishReviewDatabase;
  let repo: EnglishReviewRepository;

  beforeEach(() => {
    db = new EnglishReviewDatabase(`backup-${crypto.randomUUID()}`);
    repo = new EnglishReviewRepository(db);
  });

  afterEach(async () => {
    db.close();
    await db.delete();
  });

  it('round-trips every durable table', async () => {
    await repo.saveEntries('2026-08-21', [draft]);
    await repo.saveDraft('capture', { text: 'subtle' });
    await repo.setSetting('accent', 'us');
    await repo.saveCaptureDraft({
      id: 'capture-1', text: 'potential', normalizedText: 'potential', type: 'word',
      meaningsZh: ['潜力'], exampleEn: 'She has potential.', exampleZh: '她有潜力。',
      usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null,
      audioFallback: 'speech-synthesis', status: 'ready', capturedAt: '2026-08-21T10:00:00.000Z',
    });
    const before = await repo.snapshot();
    const json = await exportBackup(repo, '2026-08-21T12:00:00.000Z');

    await repo.clearAll();
    await importBackup(repo, json, 'replace');

    expect(await repo.snapshot()).toEqual(before);
  });

  it('does not mutate data when validation fails', async () => {
    await repo.saveEntries('2026-08-21', [draft]);
    const before = await repo.snapshot();

    await expect(importBackup(repo, '{"version":99}', 'replace')).rejects.toThrow(
      '备份文件无效或版本不受支持',
    );
    expect(await repo.snapshot()).toEqual(before);
  });
});
