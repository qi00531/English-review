import { EnglishReviewDatabase } from './schema';
import { EnglishReviewRepository, type EntryDraft } from './repository';

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

describe('EnglishReviewRepository', () => {
  let db: EnglishReviewDatabase;
  let repo: EnglishReviewRepository;

  beforeEach(() => {
    db = new EnglishReviewDatabase(`english-review-${crypto.randomUUID()}`);
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
});
