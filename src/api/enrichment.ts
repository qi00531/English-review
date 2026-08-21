import {
  EnrichmentResponseSchema,
  type EnrichmentResult,
} from '../../server/enrichment/schema';

export async function requestEnrichment(
  terms: string[],
  request: typeof fetch = fetch,
): Promise<EnrichmentResult[]> {
  const response = await request('/api/enrich', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ terms }),
  });
  if (!response.ok) throw new Error(`Enrichment request failed: ${response.status}`);

  return EnrichmentResponseSchema.parse(await response.json()).results;
}
