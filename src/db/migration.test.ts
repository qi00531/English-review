import Dexie, { type Table } from 'dexie';
import { EnglishReviewDatabase, type EntryRecord } from './schema';

class LegacyDatabase extends Dexie {
  entries!: Table<Omit<EntryRecord, 'normalizedEnglish'>, string>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      lists: '&id,&createdDate,listNumber,createdAt',
      entries: '&id,listId,english,[listId+english],updatedAt',
      reviewNodes: '&id,listId,dueDate,completedAt,[dueDate+completedAt],[listId+sequence]',
      drafts: '&id,updatedAt',
      settings: '&key',
    });
  }
}

it('normalizes legacy English values during the version 2 migration', async () => {
  const name = `migration-${crypto.randomUUID()}`;
  const legacy = new LegacyDatabase(name);
  await legacy.entries.add({
    id: 'entry-1',
    listId: 'list-1',
    english: '  Retain  ',
    usIpa: null,
    ukIpa: null,
    usAudioUrl: null,
    ukAudioUrl: null,
    meaningsZh: ['保留'],
    exampleEn: 'We retain more.',
    exampleZh: '我们记住更多。',
    audioFallback: 'speech-synthesis',
    source: 'manual',
    updatedAt: '2026-08-21T00:00:00.000Z',
  });
  legacy.close();

  const migrated = new EnglishReviewDatabase(name);
  const entry = await migrated.entries.get('entry-1');
  expect(entry?.normalizedEnglish).toBe('retain');
  expect(await migrated.captureDrafts.toArray()).toEqual([]);

  migrated.close();
  await Dexie.delete(name);
});
