import { z } from 'zod';
import type { DictionaryEntry, DictionaryProvider } from './schema';

const DictionaryResponseSchema = z.array(z.object({
  phonetics: z.array(z.object({
    text: z.string().optional(),
    audio: z.string().optional(),
  })).default([]),
}));

type RequestLike = typeof fetch;

export class FreeDictionaryProvider implements DictionaryProvider {
  constructor(
    private readonly request: RequestLike = fetch,
    private readonly baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en',
  ) {}

  async lookup(term: string): Promise<DictionaryEntry | null> {
    const response = await this.request(`${this.baseUrl}/${encodeURIComponent(term)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Dictionary request failed: ${response.status}`);

    const [entry] = DictionaryResponseSchema.parse(await response.json());
    if (!entry) return null;
    const us = entry.phonetics.find((item) => item.audio?.toLowerCase().includes('-us.'));
    const uk = entry.phonetics.find((item) => item.audio?.toLowerCase().includes('-uk.'));
    const first = entry.phonetics.find((item) => item.text || item.audio);

    return {
      usIpa: us?.text ?? first?.text ?? null,
      ukIpa: uk?.text ?? first?.text ?? null,
      usAudioUrl: us?.audio || null,
      ukAudioUrl: uk?.audio || null,
    };
  }
}
