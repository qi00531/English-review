import { z } from 'zod';

const LocalDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const ListSchema = z.object({
  id: z.string(), listNumber: z.number().int().positive(),
  createdDate: LocalDateSchema, createdAt: z.string(),
});
const EntrySchema = z.object({
  id: z.string(), listId: z.string(), english: z.string(), normalizedEnglish: z.string(),
  usIpa: z.string().nullable(), ukIpa: z.string().nullable(),
  usAudioUrl: z.string().nullable(), ukAudioUrl: z.string().nullable(),
  meaningsZh: z.array(z.string()), exampleEn: z.string(), exampleZh: z.string(),
  audioFallback: z.enum(['none', 'speech-synthesis']),
  source: z.enum(['dictionary-ai', 'ai', 'manual']), updatedAt: z.string(),
});
const ReviewNodeSchema = z.object({
  id: z.string(), listId: z.string(), dueDate: LocalDateSchema,
  completedAt: z.string().nullable(), sequence: z.number().int().min(0).max(5),
});

export const BackupV1Schema = z.object({
  format: z.literal('english-review-backup'),
  version: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    lists: z.array(ListSchema),
    entries: z.array(EntrySchema),
    reviewNodes: z.array(ReviewNodeSchema),
    drafts: z.array(z.object({ id: z.string(), payload: z.unknown(), updatedAt: z.string() })),
    settings: z.array(z.object({ key: z.string(), value: z.unknown() })),
  }),
});
