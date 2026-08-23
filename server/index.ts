import { serve } from '@hono/node-server';
import { createApp } from './app';
import { AiJsonProvider } from './enrichment/ai';
import { FreeDictionaryProvider } from './enrichment/dictionary';
import { EnrichmentService } from './enrichment/service';
import { loadLocalEnv, readEnv } from './env';

loadLocalEnv();
const env = readEnv();
const service = new EnrichmentService(
  new FreeDictionaryProvider(),
  new AiJsonProvider({ baseUrl: env.AI_BASE_URL, apiKey: env.AI_API_KEY, model: env.AI_MODEL }),
);
const app = createApp(service);

serve({ fetch: app.fetch, port: env.PORT });
