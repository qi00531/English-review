import { buildReviewDates } from '../domain/schedule';
import type { LocalDate, ReviewNode } from '../domain/models';
import type { CaptureDraft, DuplicateMatch } from '../capture/model';
import {
  type DraftRecord,
  type EntryRecord,
  EnglishReviewDatabase,
  type ListRecord,
  type SettingRecord,
} from './schema';

export type EntryDraft = Omit<
  EntryRecord,
  'id' | 'listId' | 'normalizedEnglish' | 'updatedAt'
>;

export type RepositorySnapshot = {
  lists: ListRecord[];
  entries: EntryRecord[];
  reviewNodes: ReviewNode[];
  drafts: DraftRecord[];
  settings: SettingRecord[];
  captureDrafts: CaptureDraft[];
};

export class EnglishReviewRepository {
  constructor(private readonly db: EnglishReviewDatabase) {}

  async saveEntries(createdDate: LocalDate, drafts: EntryDraft[]): Promise<ListRecord> {
    if (drafts.length === 0) throw new Error('At least one entry is required');

    return this.db.transaction(
      'rw',
      this.db.lists,
      this.db.entries,
      this.db.reviewNodes,
      async () => {
        let list = await this.db.lists.where('createdDate').equals(createdDate).first();
        const now = new Date().toISOString();

        if (!list) {
          list = {
            id: crypto.randomUUID(),
            listNumber: (await this.db.lists.count()) + 1,
            createdDate,
            createdAt: now,
          };
          await this.db.lists.add(list);

          const nodes: ReviewNode[] = buildReviewDates(createdDate).map((dueDate, sequence) => ({
            id: crypto.randomUUID(),
            listId: list!.id,
            dueDate,
            completedAt: null,
            sequence,
          }));
          await this.db.reviewNodes.bulkAdd(nodes);
        }

        await this.db.entries.bulkAdd(
          drafts.map((draft) => ({
            ...draft,
            id: crypto.randomUUID(),
            listId: list!.id,
            normalizedEnglish: draft.english.trim().toLocaleLowerCase('en-US'),
            updatedAt: now,
          })),
        );

        return list;
      },
    );
  }

  getLists(): Promise<ListRecord[]> {
    return this.db.lists.orderBy('listNumber').toArray();
  }

  getEntries(listId: string): Promise<EntryRecord[]> {
    return this.db.entries.where('listId').equals(listId).toArray();
  }

  async saveCaptureDraft(draft: CaptureDraft): Promise<void> {
    await this.db.captureDrafts.put(draft);
  }

  getCaptureDrafts(): Promise<CaptureDraft[]> {
    return this.db.captureDrafts.orderBy('capturedAt').toArray();
  }

  async updateCaptureDraft(id: string, patch: Partial<CaptureDraft>): Promise<void> {
    const changed = await this.db.captureDrafts.update(id, patch);
    if (changed === 0) throw new Error('Capture not found');
  }

  deleteCaptureDraft(id: string): Promise<void> {
    return this.db.captureDrafts.delete(id);
  }

  async findDuplicate(normalizedText: string): Promise<DuplicateMatch> {
    const entry = await this.db.entries.where('normalizedEnglish').equals(normalizedText).first();
    if (!entry) return null;
    const list = await this.db.lists.get(entry.listId);
    return list ? { listId: list.id, listNumber: list.listNumber } : null;
  }

  async promoteCaptureDrafts(createdDate: LocalDate, ids: string[]): Promise<ListRecord> {
    if (ids.length === 0) throw new Error('At least one capture is required');
    return this.db.transaction(
      'rw',
      this.db.captureDrafts,
      this.db.lists,
      this.db.entries,
      this.db.reviewNodes,
      async () => {
        const captures = (await this.db.captureDrafts.bulkGet(ids)).filter(
          (capture): capture is CaptureDraft => capture !== undefined,
        );
        if (captures.length !== ids.length || captures.some((capture) => capture.status !== 'ready')) {
          throw new Error('Capture selection is incomplete');
        }

        let list = await this.db.lists.where('createdDate').equals(createdDate).first();
        const now = new Date().toISOString();
        if (!list) {
          list = {
            id: crypto.randomUUID(),
            listNumber: (await this.db.lists.count()) + 1,
            createdDate,
            createdAt: now,
          };
          await this.db.lists.add(list);
          await this.db.reviewNodes.bulkAdd(buildReviewDates(createdDate).map((dueDate, sequence) => ({
            id: crypto.randomUUID(), listId: list!.id, dueDate, completedAt: null, sequence,
          })));
        }

        await this.db.entries.bulkAdd(captures.map((capture) => ({
          id: crypto.randomUUID(),
          listId: list!.id,
          english: capture.text,
          normalizedEnglish: capture.normalizedText,
          usIpa: capture.usIpa,
          ukIpa: capture.ukIpa,
          usAudioUrl: capture.usAudioUrl,
          ukAudioUrl: capture.ukAudioUrl,
          meaningsZh: capture.meaningsZh,
          exampleEn: capture.exampleEn,
          exampleZh: capture.exampleZh,
          audioFallback: capture.audioFallback,
          source: capture.usAudioUrl || capture.ukAudioUrl ? 'dictionary-ai' : 'ai',
          updatedAt: now,
        })));
        await this.db.captureDrafts.bulkDelete(ids);
        return list;
      },
    );
  }

  async getReviewNodes(listId: string): Promise<ReviewNode[]> {
    const nodes = await this.db.reviewNodes.where('listId').equals(listId).toArray();
    return nodes.sort((left, right) => left.sequence - right.sequence);
  }

  async completeReviewNode(nodeId: string, completedAt = new Date().toISOString()): Promise<void> {
    const changed = await this.db.reviewNodes.update(nodeId, { completedAt });
    if (changed === 0) throw new Error('Review node not found');
  }

  async undoCompletion(nodeId: string): Promise<void> {
    const changed = await this.db.reviewNodes.update(nodeId, { completedAt: null });
    if (changed === 0) throw new Error('Review node not found');
  }

  async deleteList(listId: string): Promise<void> {
    await this.db.transaction(
      'rw',
      this.db.lists,
      this.db.entries,
      this.db.reviewNodes,
      async () => {
        await Promise.all([
          this.db.entries.where('listId').equals(listId).delete(),
          this.db.reviewNodes.where('listId').equals(listId).delete(),
        ]);
        await this.db.lists.delete(listId);
      },
    );
  }

  async updateEntry(
    entryId: string,
    patch: Partial<Omit<EntryRecord, 'id' | 'listId'>>,
  ): Promise<void> {
    const changed = await this.db.entries.update(entryId, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    if (changed === 0) throw new Error('Entry not found');
  }

  async saveDraft(id: string, payload: unknown): Promise<void> {
    await this.db.drafts.put({ id, payload, updatedAt: new Date().toISOString() });
  }

  async setSetting(key: string, value: unknown): Promise<void> {
    await this.db.settings.put({ key, value });
  }

  async snapshot(): Promise<RepositorySnapshot> {
    const [lists, entries, reviewNodes, drafts, settings, captureDrafts] = await Promise.all([
      this.db.lists.orderBy('listNumber').toArray(),
      this.db.entries.toArray(),
      this.db.reviewNodes.toArray(),
      this.db.drafts.toArray(),
      this.db.settings.toArray(),
      this.db.captureDrafts.orderBy('capturedAt').toArray(),
    ]);
    return { lists, entries, reviewNodes, drafts, settings, captureDrafts };
  }

  async clearAll(): Promise<void> {
    await this.db.transaction(
      'rw',
      [this.db.lists, this.db.entries, this.db.reviewNodes, this.db.drafts, this.db.settings, this.db.captureDrafts],
      () => Promise.all([
        this.db.lists.clear(),
        this.db.entries.clear(),
        this.db.reviewNodes.clear(),
        this.db.drafts.clear(),
        this.db.settings.clear(),
        this.db.captureDrafts.clear(),
      ]).then(() => undefined),
    );
  }

  async replaceSnapshot(snapshot: RepositorySnapshot): Promise<void> {
    await this.db.transaction(
      'rw',
      [this.db.lists, this.db.entries, this.db.reviewNodes, this.db.drafts, this.db.settings, this.db.captureDrafts],
      async () => {
        await Promise.all([
          this.db.lists.clear(),
          this.db.entries.clear(),
          this.db.reviewNodes.clear(),
          this.db.drafts.clear(),
          this.db.settings.clear(),
          this.db.captureDrafts.clear(),
        ]);
        await this.db.lists.bulkAdd(snapshot.lists);
        await this.db.entries.bulkAdd(snapshot.entries);
        await this.db.reviewNodes.bulkAdd(snapshot.reviewNodes);
        await this.db.drafts.bulkAdd(snapshot.drafts);
        await this.db.settings.bulkAdd(snapshot.settings);
        await this.db.captureDrafts.bulkAdd(snapshot.captureDrafts);
      },
    );
  }
}
