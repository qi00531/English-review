import { z } from 'zod';
import { existsSync } from 'node:fs';

const EnvSchema = z.object({
  AI_BASE_URL: z.string().url(),
  AI_API_KEY: z.string().min(1),
  AI_MODEL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(8787),
});

export function loadLocalEnv(
  path = '.env',
  exists: (path: string) => boolean = existsSync,
  load: (path: string) => void = (file) => process.loadEnvFile(file),
) {
  if (exists(path)) load(path);
}

export function readEnv(source: NodeJS.ProcessEnv = process.env) {
  return EnvSchema.parse(source);
}
