import { describe, expect, it, vi } from 'vitest';
import { enrichSelection } from './enrich-selection';

const settings = { baseUrl: 'https://api.example/v1', model: 'model', apiKey: 'secret', enabled: true };
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });

describe('enrichSelection', () => {
  it('combines dictionary audio with strict AI content', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(json([{ phonetics: [{ text: '/pəˈtenʃəl/', audio: 'https://audio.test/p.mp3' }] }]))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify({ meaningsZh: ['潜力', '可能性'], exampleEn: 'She has great potential.', exampleZh: '她很有潜力。' }) } }] }));

    await expect(enrichSelection('potential', settings, request)).resolves.toMatchObject({
      text: 'potential', normalizedText: 'potential', type: 'word', meaningsZh: ['潜力', '可能性'],
      usAudioUrl: 'https://audio.test/p.mp3', audioFallback: 'none', status: 'ready',
    });
    expect(request.mock.calls[1][1].body).not.toContain('https://audio.test');
  });

  it('falls back to speech synthesis when the dictionary fails', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify({ meaningsZh: ['考虑'], exampleEn: 'Take it into account.', exampleZh: '把它考虑进去。' }) } }] }));
    await expect(enrichSelection('take into account', settings, request)).resolves.toMatchObject({ audioFallback: 'speech-synthesis', type: 'phrase' });
  });

  it('rejects a missing key before any network request', async () => {
    const request = vi.fn();
    await expect(enrichSelection('potential', { ...settings, apiKey: '' }, request)).rejects.toThrow('AI_KEY_MISSING');
    expect(request).not.toHaveBeenCalled();
  });

  it('rejects malformed AI JSON without creating a draft', async () => {
    const request = vi.fn().mockResolvedValueOnce(json([])).mockResolvedValueOnce(json({ choices: [{ message: { content: '{}' } }] }));
    await expect(enrichSelection('potential', settings, request)).rejects.toThrow();
  });

  it('preserves only the provider status needed for safe error mapping', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(json([]))
      .mockResolvedValueOnce(json({ error: { message: 'secret provider body' } }, 401));
    await expect(enrichSelection('potential', settings, request)).rejects.toMatchObject({
      code: 'AI_REQUEST_FAILED', status: 401,
    });
  });
});
