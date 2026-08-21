import { z } from 'zod';

const EnvSchema = z.object({
  AI_BASE_URL: z.string().url(),
  AI_API_KEY: z.string().min(1),
  AI_MODEL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(8787),
});

export function readEnv(source: NodeJS.ProcessEnv = process.env) {
  return EnvSchema.parse(source);
}
