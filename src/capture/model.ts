export type CaptureType = 'word' | 'phrase';
export type CaptureStatus = 'enriching' | 'ready' | 'saved' | 'failed';

export type CaptureDraft = {
  id: string;
  text: string;
  normalizedText: string;
  type: CaptureType;
  meaningsZh: string[];
  exampleEn: string;
  exampleZh: string;
  usIpa: string | null;
  ukIpa: string | null;
  usAudioUrl: string | null;
  ukAudioUrl: string | null;
  audioFallback: 'none' | 'speech-synthesis';
  status: CaptureStatus;
  capturedAt: string;
};

export type AiSettings = {
  baseUrl: string;
  model: string;
  apiKey: string;
  enabled: boolean;
};

export type DuplicateMatch = { listId: string; listNumber: number } | null;

export type CaptureMessage =
  | { type: 'PREVIEW_CAPTURE'; text: string }
  | { type: 'SAVE_CAPTURE'; draft: CaptureDraft; allowDuplicate: boolean }
  | { type: 'OPEN_WORD_JOURNAL'; route?: string };
