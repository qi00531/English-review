import { EnrichmentService } from './service';
import type { AiEnrichment, AiProvider, DictionaryEntry, DictionaryProvider } from './schema';

const aiResult: AiEnrichment = {
  meaningsZh: ['保持', '保留', '记住', '雇用'],
  exampleEn: 'We retain more through regular review.',
  exampleZh: '通过定期复习，我们能记住更多内容。',
};

function providers(dictionaryResult: DictionaryEntry | null) {
  const dictionary: DictionaryProvider = { lookup: vi.fn().mockResolvedValue(dictionaryResult) };
  const ai: AiProvider = { enrich: vi.fn().mockResolvedValue(aiResult) };
  return { dictionary, ai };
}

describe('EnrichmentService', () => {
  it('keeps dictionary pronunciation and asks AI for meanings and one example', async () => {
    const { dictionary, ai } = providers({
      usIpa: '/rɪˈteɪn/',
      ukIpa: null,
      usAudioUrl: 'https://audio.example/retain.mp3',
      ukAudioUrl: null,
    });
    const service = new EnrichmentService(dictionary, ai);

    const result = await service.enrich('retain');

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') throw new Error('Expected a ready result');
    expect(result.meaningsZh).toHaveLength(4);
    expect(result.usAudioUrl).toBe('https://audio.example/retain.mp3');
    expect(result.audioFallback).toBe('none');
  });

  it('uses speech synthesis metadata when a phrase has no dictionary result', async () => {
    const { dictionary, ai } = providers(null);
    const service = new EnrichmentService(dictionary, ai);

    const result = await service.enrich('in light of');

    expect(result).toMatchObject({
      status: 'ready',
      english: 'in light of',
      audioFallback: 'speech-synthesis',
      usAudioUrl: null,
    });
  });

  it('returns a recoverable item error when AI enrichment fails', async () => {
    const { dictionary, ai } = providers(null);
    vi.mocked(ai.enrich).mockRejectedValue(new Error('AI timeout'));
    const service = new EnrichmentService(dictionary, ai);

    await expect(service.enrich('retain')).resolves.toEqual({
      status: 'error',
      english: 'retain',
      code: 'AI_UNAVAILABLE',
      message: '内容生成暂时失败，请重试或手动填写。',
    });
  });
});
