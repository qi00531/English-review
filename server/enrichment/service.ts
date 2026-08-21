import type {
  AiProvider,
  DictionaryProvider,
  EnrichmentResult,
} from './schema';

const AI_ERROR_MESSAGE = '内容生成暂时失败，请重试或手动填写。';

export class EnrichmentService {
  constructor(
    private readonly dictionary: DictionaryProvider,
    private readonly ai: AiProvider,
  ) {}

  async enrich(rawTerm: string): Promise<EnrichmentResult> {
    const english = rawTerm.trim();
    const dictionaryEntry = await this.dictionary.lookup(english).catch(() => null);

    try {
      const generated = await this.ai.enrich(english);
      return {
        status: 'ready',
        english,
        usIpa: dictionaryEntry?.usIpa ?? null,
        ukIpa: dictionaryEntry?.ukIpa ?? null,
        usAudioUrl: dictionaryEntry?.usAudioUrl ?? null,
        ukAudioUrl: dictionaryEntry?.ukAudioUrl ?? null,
        ...generated,
        audioFallback: dictionaryEntry?.usAudioUrl || dictionaryEntry?.ukAudioUrl
          ? 'none'
          : 'speech-synthesis',
      };
    } catch {
      return {
        status: 'error',
        english,
        code: 'AI_UNAVAILABLE',
        message: AI_ERROR_MESSAGE,
      };
    }
  }
}
