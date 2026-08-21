import { buildReviewDates } from '../domain/schedule';
import type { LocalDate, ReviewNode } from '../domain/models';
import {
  type EntryRecord,
  EnglishReviewDatabase,
  type ListRecord,
} from './schema';

export type EntryDraft = Omit<
  EntryRecord,
  'id' | 'listId' | 'normalizedEnglish' | 'updatedAt'
>;

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
}
