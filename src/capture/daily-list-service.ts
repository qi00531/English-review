import type { LocalDate } from '../domain/models';
import type { AppendToDailyListResult, EntryDraft } from '../db/repository';
import { captureToEntryDraft } from './capture-to-entry';
import type { CaptureDraft, SaveCaptureResult } from './model';

type DailyListRepository = {
  appendToDailyList(
    createdDate: LocalDate,
    drafts: EntryDraft[],
    allowDuplicates?: boolean,
  ): Promise<AppendToDailyListResult>;
};

export class DailyListService {
  constructor(
    private readonly repository: DailyListRepository,
    private readonly getLocalDate: () => LocalDate,
  ) {}

  async saveCapture(capture: CaptureDraft, allowDuplicate: boolean): Promise<SaveCaptureResult> {
    if (capture.status !== 'ready') return { ok: false, code: 'INVALID_DRAFT' };
    const result = await this.repository.appendToDailyList(
      this.getLocalDate(),
      [captureToEntryDraft(capture)],
      allowDuplicate,
    );
    if (!result.ok) {
      const first = result.duplicates[0];
      return first
        ? { ok: false, code: 'DUPLICATE', duplicate: { listId: first.listId, listNumber: first.listNumber } }
        : { ok: false, code: 'INVALID_DRAFT' };
    }
    return { ok: true, listId: result.list.id, listNumber: result.list.listNumber };
  }
}
