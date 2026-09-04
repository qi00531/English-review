import { describe, expect, it, vi } from 'vitest';
import { enrichSelection } from './enrich-selection';

const settings = { baseUrl: 'https://api.example/v1', model: 'model', apiKey: 'secret', enabled: true };
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });

describe('enrichSelection', () => {
  it('starts dictionary and AI requests concurrently', async () => {
    let resolveDictionary!: (response: Response) => void;
    let resolveAi!: (response: Response) => void;
    const dictionaryResponse = new Promise<Response>((resolve) => { resolveDictionary = resolve; });
    const aiResponse = new Promise<Response>((resolve) => { resolveAi = resolve; });
    const request = vi.fn((input: RequestInfo | URL) => String(input).includes('dictionaryapi.dev')
      ? dictionaryResponse
      : aiResponse);

    const enrichment = enrichSelection('generate', settings, request);

    expect(request).toHaveBeenCalledTimes(2);
    expect(String(request.mock.calls[0][0])).toContain('dictionaryapi.dev');
    expect(String(request.mock.calls[1][0])).toContain('/chat/completions');

    resolveDictionary(json([{ phonetics: [{ text: '/ˈdʒenəreɪt/', audio: 'https://audio.test/generate.mp3' }] }]));
    resolveAi(json({ choices: [{ message: { content: JSON.stringify({
      term: 'generate', meaningsZh: ['生成', '产生'],
      exampleEn: 'Solar panels generate electricity.', exampleZh: '太阳能板产生电力。',
    }) } }] }));

    await expect(enrichment).resolves.toMatchObject({
      meaningsZh: ['生成', '产生'], usAudioUrl: 'https://audio.test/generate.mp3',
    });
  });

  it('combines dictionary audio with strict AI content', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(json([{ phonetics: [{ text: '/pəˈtenʃəl/', audio: 'https://audio.test/p.mp3' }] }]))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify({ term: 'potential', meaningsZh: ['潜力', '可能性'], exampleEn: 'She has great potential.', exampleZh: '她很有潜力。' }) } }] }));

    await expect(enrichSelection('potential', settings, request)).resolves.toMatchObject({
      text: 'potential', normalizedText: 'potential', type: 'word', meaningsZh: ['潜力', '可能性'],
      usAudioUrl: 'https://audio.test/p.mp3', audioFallback: 'none', status: 'ready',
    });
    expect(request.mock.calls[1][1].body).not.toContain('https://audio.test');
  });

  it('normalizes a provider string of Chinese meanings into separate meanings', async () => {
    const content = JSON.stringify({
      term: 'generate', meaningsZh: '生成；产生',
      exampleEn: 'Solar panels generate electricity from sunlight.',
      exampleZh: '太阳能电池板通过阳光发电。',
    });
    const request = vi.fn()
      .mockResolvedValueOnce(json([]))
      .mockResolvedValueOnce(json({ choices: [{ message: { content } }] }))
      .mockResolvedValueOnce(json({ choices: [{ message: { content } }] }));

    await expect(enrichSelection('generate', settings, request)).resolves.toMatchObject({
      meaningsZh: ['生成', '产生'],
    });
  });

  it('falls back to speech synthesis when the dictionary fails', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify({ term: 'take into account', meaningsZh: ['考虑'], exampleEn: 'Take it into account.', exampleZh: '把它考虑进去。' }) } }] }));
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

  it('rejects a mismatched meaning and retries once with the target term', async () => {
    const wrong = { term: 'apple', meaningsZh: ['苹果', '苹果树'], exampleEn: 'She ate an apple.', exampleZh: '她吃了一个苹果。' };
    const corrected = { term: 'generate', meaningsZh: ['产生', '生成'], exampleEn: 'Solar panels generate electricity.', exampleZh: '太阳能板产生电力。' };
    const request = vi.fn()
      .mockResolvedValueOnce(json([]))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify(wrong) } }] }))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify(corrected) } }] }));

    await expect(enrichSelection('generate', settings, request)).resolves.toMatchObject({
      text: 'generate', meaningsZh: ['产生', '生成'], exampleEn: 'Solar panels generate electricity.',
    });
    expect(request).toHaveBeenCalledTimes(3);
    expect(String(request.mock.calls[2][1]?.body)).toContain('generate');
  });

  it('fails safely when both AI attempts answer a different term', async () => {
    const wrong = { term: 'apple', meaningsZh: ['苹果'], exampleEn: 'She ate an apple.', exampleZh: '她吃了一个苹果。' };
    const request = vi.fn()
      .mockResolvedValueOnce(json([]))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify(wrong) } }] }))
      .mockResolvedValueOnce(json({ choices: [{ message: { content: JSON.stringify(wrong) } }] }));

    await expect(enrichSelection('generate', settings, request)).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });
});
