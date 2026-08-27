import { EnglishReviewDatabase } from './schema';
import { EnglishReviewRepository, type EntryDraft } from './repository';
import type { CaptureDraft } from '../capture/model';

const retain: EntryDraft = {
  english: 'retain',
  usIpa: '/rɪˈteɪn/',
  ukIpa: '/rɪˈteɪn/',
  usAudioUrl: 'https://audio.example/retain-us.mp3',
  ukAudioUrl: null,
  meaningsZh: ['保持', '保留', '记住', '雇用'],
  exampleEn: 'We retain more through regular review.',
  exampleZh: '通过定期复习，我们能记住更多内容。',
  audioFallback: 'none',
  source: 'dictionary-ai',
};

function captureDraft(patch: Partial<CaptureDraft> = {}): CaptureDraft {
  return {
    id: 'capture-1',
    text: 'potential',
    normalizedText: 'potential',
    type: 'word',
    meaningsZh: ['潜力', '可能性'],
    exampleEn: 'She has great potential.',
    exampleZh: '她很有潜力。',
    usIpa: null,
    ukIpa: null,
    usAudioUrl: null,
    ukAudioUrl: null,
    audioFallback: 'speech-synthesis',
    status: 'ready',
    capturedAt: '2026-08-25T08:00:00.000Z',
    ...patch,
  };
}

describe('EnglishReviewRepository', () => {
  let db: EnglishReviewDatabase;
  let repo: EnglishReviewRepository;
  let databaseName: string;

  beforeEach(() => {
    databaseName = `english-review-${crypto.randomUUID()}`;
    db = new EnglishReviewDatabase(databaseName);
    repo = new EnglishReviewRepository(db);
  });

  afterEach(async () => {
    db.close();
    await db.delete();
  });

  it('appends multiple saves on one date to the same List', async () => {
    const first = await repo.saveEntries('2026-08-21', [retain]);
    const second = await repo.saveEntries('2026-08-21', [
      { ...retain, english: 'subtle', meaningsZh: ['细微的'] },
    ]);

    expect(second.id).toBe(first.id);
    expect(await repo.getLists()).toHaveLength(1);
    expect(await repo.getEntries(first.id)).toHaveLength(2);
  });

  it('appends directly to one daily List and creates review nodes once', async () => {
    const first = await repo.appendToDailyList('2026-08-21', [retain]);
    const second = await repo.appendToDailyList('2026-08-21', [
      { ...retain, english: 'subtle', meaningsZh: ['细微的'] },
    ]);

    expect(first).toMatchObject({ ok: true, list: { listNumber: 1 } });
    expect(second).toMatchObject({ ok: true, list: { listNumber: 1 } });
    expect(await db.lists.count()).toBe(1);
    expect(await db.entries.count()).toBe(2);
    expect(await db.reviewNodes.count()).toBe(6);
  });

  it('blocks normalized duplicates unless the user explicitly overrides', async () => {
    const original = await repo.appendToDailyList('2026-08-20', [retain]);
    expect(original.ok).toBe(true);

    const blocked = await repo.appendToDailyList('2026-08-21', [
      { ...retain, english: '  RETAIN  ' },
    ]);
    expect(blocked).toEqual({
      ok: false,
      code: 'DUPLICATE',
      duplicates: [{ listId: original.ok ? original.list.id : '', listNumber: 1, normalizedEnglish: 'retain' }],
    });

    const allowed = await repo.appendToDailyList('2026-08-21', [retain], true);
    expect(allowed).toMatchObject({ ok: true, list: { listNumber: 2 } });
  });

  it('converges simultaneous first saves from separate connections on one List', async () => {
    const secondDb = new EnglishReviewDatabase(databaseName);
    const secondRepo = new EnglishReviewRepository(secondDb);
    try {
      const [left, right] = await Promise.all([
        repo.appendToDailyList('2026-08-21', [retain]),
        secondRepo.appendToDailyList('2026-08-21', [{ ...retain, english: 'subtle' }]),
      ]);
      expect(left.ok && right.ok).toBe(true);
      expect(await db.lists.count()).toBe(1);
      expect(await db.entries.count()).toBe(2);
      expect(await db.reviewNodes.count()).toBe(6);
    } finally {
      secondDb.close();
    }
  });

  it('creates six ordered review nodes atomically with a new List', async () => {
    const list = await repo.saveEntries('2026-08-21', [retain]);
    const nodes = await repo.getReviewNodes(list.id);

    expect(nodes.map((node) => node.dueDate)).toEqual([
      '2026-08-22', '2026-08-23', '2026-08-25',
      '2026-08-28', '2026-09-05', '2026-09-20',
    ]);
    expect(nodes.map((node) => node.sequence)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('completes and restores an exact review node', async () => {
    const list = await repo.saveEntries('2026-08-21', [retain]);
    const [node] = await repo.getReviewNodes(list.id);

    await repo.completeReviewNode(node.id, '2026-08-22T10:00:00.000Z');
    expect((await repo.getReviewNodes(list.id))[0].completedAt).toBe(
      '2026-08-22T10:00:00.000Z',
    );

    await repo.undoCompletion(node.id);
    expect((await repo.getReviewNodes(list.id))[0].completedAt).toBeNull();
  });

  it('deletes a List and all dependent records', async () => {
    const list = await repo.saveEntries('2026-08-21', [retain]);
    await repo.deleteList(list.id);

    expect(await repo.getLists()).toEqual([]);
    expect(await repo.getEntries(list.id)).toEqual([]);
    expect(await repo.getReviewNodes(list.id)).toEqual([]);
  });

  it('stores local capture drafts and locates existing List duplicates', async () => {
    const draft = captureDraft();
    await repo.saveCaptureDraft(draft);
    expect(await repo.getCaptureDrafts()).toEqual([draft]);
    expect(await repo.findDuplicate('potential')).toBeNull();

    const list = await repo.saveEntries('2026-08-25', [retain]);
    expect(await repo.findDuplicate('retain')).toEqual({ listId: list.id, listNumber: 1 });
  });

  it('promotes selected ready captures and leaves unselected captures in the inbox', async () => {
    await repo.saveCaptureDraft(captureDraft());
    await repo.saveCaptureDraft(captureDraft({ id: 'capture-2', text: 'subtle', normalizedText: 'subtle' }));

    const list = await repo.promoteCaptureDrafts('2026-08-25', ['capture-1']);

    expect((await repo.getEntries(list.id)).map((entry) => entry.english)).toEqual(['potential']);
    expect((await repo.getCaptureDrafts()).map((draft) => draft.id)).toEqual(['capture-2']);
    expect(await repo.getReviewNodes(list.id)).toHaveLength(6);
  });

  it('rejects missing and non-ready capture selections', async () => {
    await repo.saveCaptureDraft(captureDraft({ status: 'failed' }));
    await expect(repo.promoteCaptureDrafts('2026-08-25', [])).rejects.toThrow('At least one capture is required');
    await expect(repo.promoteCaptureDrafts('2026-08-25', ['missing'])).rejects.toThrow('Capture selection is incomplete');
    await expect(repo.promoteCaptureDrafts('2026-08-25', ['capture-1'])).rejects.toThrow('Capture selection is incomplete');
  });

  it('migrates ready legacy captures and preserves failed records', async () => {
    await db.captureDrafts.bulkAdd([
      captureDraft(),
      captureDraft({ id: 'capture-2', text: 'subtle', normalizedText: 'subtle' }),
      captureDraft({ id: 'capture-3', text: 'broken', normalizedText: 'broken', status: 'failed' }),
    ]);

    await expect(repo.migrateReadyCaptures('2026-08-27')).resolves.toEqual({
      migrated: 2, listNumber: 1,
    });
    expect((await db.entries.toArray()).map((entry) => entry.english).sort()).toEqual(['potential', 'subtle'].sort());
    expect((await db.captureDrafts.toArray()).map((draft) => draft.text)).toEqual(['broken']);
    await expect(repo.migrateReadyCaptures('2026-08-27')).resolves.toEqual({ migrated: 0 });
  });
});
