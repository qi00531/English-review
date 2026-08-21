import { Hono } from 'hono';
import { EnrichmentRequestSchema, type EnrichmentResult } from './enrichment/schema';

export type EnrichmentPort = {
  enrich(term: string): Promise<EnrichmentResult>;
};

export function createApp(service: EnrichmentPort) {
  const app = new Hono();

  app.get('/api/health', (context) => context.json({ status: 'ok' }));
  app.post('/api/enrich', async (context) => {
    const parsed = EnrichmentRequestSchema.safeParse(await context.req.json().catch(() => null));
    if (!parsed.success) {
      return context.json({ error: 'INVALID_REQUEST' }, 400);
    }

    const results = await Promise.all(parsed.data.terms.map((term) => service.enrich(term)));
    return context.json({ results });
  });

  return app;
}
