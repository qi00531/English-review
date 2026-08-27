import type { AiSettings, CaptureDraft, DuplicateMatch } from '../capture/model';
import { validateSelection } from '../capture/validate-selection';
import type { SaveCaptureResult } from '../capture/model';

type Repository = {
  findDuplicate(normalizedText: string): Promise<DuplicateMatch>;
};
type DailyListWriter = { saveCapture(draft: CaptureDraft, allowDuplicate: boolean): Promise<SaveCaptureResult> };
type ReadSettings = () => Promise<AiSettings>;
type Enrich = (text: string, settings: AiSettings) => Promise<CaptureDraft>;

export class CaptureBackgroundService {
  constructor(
    private readonly repository: Repository,
    private readonly readSettings: ReadSettings,
    private readonly enrich: Enrich,
    private readonly dailyListWriter: DailyListWriter,
  ) {}

  async preview(text: string) {
    const validation = validateSelection(text);
    if (!validation.ok) return validation;
    const settings = await this.readSettings();
    if (!settings.enabled) return { ok: false as const, code: 'AI_DISABLED' as const };
    if (!settings.apiKey.trim()) return { ok: false as const, code: 'AI_KEY_MISSING' as const };
    const draft = await this.enrich(validation.text, settings);
    const duplicate = await this.repository.findDuplicate(validation.normalizedText);
    return { ok: true as const, draft, duplicate };
  }

  async save(draft: CaptureDraft, allowDuplicate: boolean) {
    if (draft.status !== 'ready') return { ok: false as const, code: 'INVALID_DRAFT' as const };
    const duplicate = await this.repository.findDuplicate(draft.normalizedText);
    if (duplicate && !allowDuplicate) return { ok: false as const, code: 'DUPLICATE' as const, duplicate };
    return this.dailyListWriter.saveCapture(draft, allowDuplicate);
  }
}
