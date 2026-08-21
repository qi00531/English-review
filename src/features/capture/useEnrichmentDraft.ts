import type { EnrichmentResult, ReadyEnrichment } from '../../../server/enrichment/schema';
import type { EntryDraft } from '../../db/repository';

export function replaceResult(results: EnrichmentResult[], next: EnrichmentResult) {
  return results.map((result) => result.english === next.english ? next : result);
}

export function updateReadyResult(
  results: EnrichmentResult[],
  english: string,
  patch: Partial<ReadyEnrichment>,
) {
  return results.map((result) => result.status === 'ready' && result.english === english
    ? { ...result, ...patch }
    : result);
}

export function toEntryDrafts(results: EnrichmentResult[]): EntryDraft[] {
  return results.flatMap((result) => result.status === 'ready' ? [{
    english: result.english,
    usIpa: result.usIpa,
    ukIpa: result.ukIpa,
    usAudioUrl: result.usAudioUrl,
    ukAudioUrl: result.ukAudioUrl,
    meaningsZh: result.meaningsZh,
    exampleEn: result.exampleEn,
    exampleZh: result.exampleZh,
    audioFallback: result.audioFallback,
    source: result.usAudioUrl || result.ukAudioUrl ? 'dictionary-ai' as const : 'ai' as const,
  }] : []);
}
