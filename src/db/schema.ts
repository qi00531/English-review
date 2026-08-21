import Dexie, { type EntityTable } from 'dexie';
import type { LocalDate, ReviewNode } from '../domain/models';

export type ListRecord = {
  id: string;
  listNumber: number;
  createdDate: LocalDate;
  createdAt: string;
};

export type EntryRecord = {
  id: string;
  listId: string;
  english: string;
  normalizedEnglish: string;
  usIpa: string | null;
  ukIpa: string | null;
  usAudioUrl: string | null;
  ukAudioUrl: string | null;
  meaningsZh: string[];
  exampleEn: string;
  exampleZh: string;
  audioFallback: 'none' | 'speech-synthesis';
  source: 'dictionary-ai' | 'ai' | 'manual';
  updatedAt: string;
};

export type DraftRecord = {
  id: string;
  payload: unknown;
  updatedAt: string;
};

export type SettingRecord = {
  key: string;
  value: unknown;
};

export class EnglishReviewDatabase extends Dexie {
  lists!: EntityTable<ListRecord, 'id'>;
  entries!: EntityTable<EntryRecord, 'id'>;
  reviewNodes!: EntityTable<ReviewNode, 'id'>;
  drafts!: EntityTable<DraftRecord, 'id'>;
  settings!: EntityTable<SettingRecord, 'key'>;

  constructor(name = 'english-review') {
    super(name);
    this.version(1).stores({
      lists: '&id,&createdDate,listNumber,createdAt',
      entries: '&id,listId,english,[listId+english],updatedAt',
      reviewNodes: '&id,listId,dueDate,completedAt,[dueDate+completedAt],[listId+sequence]',
      drafts: '&id,updatedAt',
      settings: '&key',
    });
    this.version(2)
      .stores({
        entries: '&id,listId,english,normalizedEnglish,[listId+normalizedEnglish],updatedAt',
      })
      .upgrade((transaction) =>
        transaction.table<EntryRecord>('entries').toCollection().modify((entry) => {
          entry.normalizedEnglish = entry.english.trim().toLocaleLowerCase('en-US');
        }),
      );
  }
}
