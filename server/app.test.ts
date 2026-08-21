import { createApp } from './app';
import type { EnrichmentResult } from './enrichment/schema';

it('rejects an empty enrichment batch', async () => {
  const app = createApp({ enrich: vi.fn() });
  const response = await app.request('/api/enrich', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ terms: [] }),
  });

  expect(response.status).toBe(400);
});

it('returns results in input order even when completion order differs', async () => {
  const enrich = vi.fn(async (term: string): Promise<EnrichmentResult> => ({
    status: 'error', english: term, code: 'AI_UNAVAILABLE', message: term,
  }));
  const app = createApp({ enrich });
  const response = await app.request('/api/enrich', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ terms: ['retain', 'in light of'] }),
  });

  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    results: [{ english: 'retain' }, { english: 'in light of' }],
  });
});
