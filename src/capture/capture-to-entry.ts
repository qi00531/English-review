import type { EntryDraft } from '../db/repository';
import type { CaptureDraft } from './model';

export function captureToEntryDraft(capture: CaptureDraft): EntryDraft {
  return {
    english: capture.text,
    usIpa: capture.usIpa,
    ukIpa: capture.ukIpa,
    usAudioUrl: capture.usAudioUrl,
    ukAudioUrl: capture.ukAudioUrl,
    meaningsZh: capture.meaningsZh,
    exampleEn: capture.exampleEn,
    exampleZh: capture.exampleZh,
    audioFallback: capture.audioFallback,
    source: capture.usAudioUrl || capture.ukAudioUrl ? 'dictionary-ai' : 'ai',
  };
}
