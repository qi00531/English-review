import { requestEnrichment } from './enrichment';

it('posts terms and validates the response', async () => {
  const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [{
    status: 'error', english: 'retain', code: 'AI_UNAVAILABLE', message: 'retry',
  }] }), { status: 200 }));

  const results = await requestEnrichment(['retain'], request);

  expect(results[0]).toMatchObject({ english: 'retain' });
  expect(request).toHaveBeenCalledWith('/api/enrich', expect.objectContaining({ method: 'POST' }));
});
