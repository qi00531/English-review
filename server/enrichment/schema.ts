import { z } from 'zod';

export const AiEnrichmentSchema = z.object({
  meaningsZh: z.array(z.string().trim().min(1)).min(1),
  exampleEn: z.string().trim().min(1),
  exampleZh: z.string().trim().min(1),
});

export type AiEnrichment = z.infer<typeof AiEnrichmentSchema>;

export type DictionaryEntry = {
  usIpa: string | null;
  ukIpa: string | null;
  usAudioUrl: string | null;
  ukAudioUrl: string | null;
};

export type DictionaryProvider = {
  lookup(term: string): Promise<DictionaryEntry | null>;
};

export type AiProvider = {
  enrich(term: string): Promise<AiEnrichment>;
};

export type ReadyEnrichment = AiEnrichment & DictionaryEntry & {
  status: 'ready';
  english: string;
  audioFallback: 'none' | 'speech-synthesis';
};

export type ErrorEnrichment = {
  status: 'error';
  english: string;
  code: 'AI_UNAVAILABLE';
  message: string;
};

export type EnrichmentResult = ReadyEnrichment | ErrorEnrichment;

export const EnrichmentRequestSchema = z.object({
  terms: z.array(z.string().trim().min(1).max(120)).min(1).max(100),
});

export const EnrichmentResponseSchema = z.object({
  results: z.array(z.discriminatedUnion('status', [
    z.object({
      status: z.literal('ready'),
      english: z.string(),
      usIpa: z.string().nullable(),
      ukIpa: z.string().nullable(),
      usAudioUrl: z.string().nullable(),
      ukAudioUrl: z.string().nullable(),
      meaningsZh: z.array(z.string()),
      exampleEn: z.string(),
      exampleZh: z.string(),
      audioFallback: z.enum(['none', 'speech-synthesis']),
    }),
    z.object({
      status: z.literal('error'),
      english: z.string(),
      code: z.literal('AI_UNAVAILABLE'),
      message: z.string(),
    }),
  ])),
});
