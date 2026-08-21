import { AiJsonProvider } from './ai';
import { FreeDictionaryProvider } from './dictionary';

describe('FreeDictionaryProvider', () => {
  it('maps US and UK pronunciation resources', async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      phonetics: [
        { text: '/rɪˈteɪn/', audio: 'https://audio/retain-us.mp3' },
        { text: '/rɪˈteɪn/', audio: 'https://audio/retain-uk.mp3' },
      ],
    }]), { status: 200 }));

    const result = await new FreeDictionaryProvider(request).lookup('retain');

    expect(result).toEqual({
      usIpa: '/rɪˈteɪn/', ukIpa: '/rɪˈteɪn/',
      usAudioUrl: 'https://audio/retain-us.mp3',
      ukAudioUrl: 'https://audio/retain-uk.mp3',
    });
  });

  it('returns null for a missing phrase', async () => {
    const request = vi.fn().mockResolvedValue(new Response('{}', { status: 404 }));
    await expect(new FreeDictionaryProvider(request).lookup('in light of')).resolves.toBeNull();
  });
});

describe('AiJsonProvider', () => {
  it('validates structured JSON returned by an OpenAI-compatible endpoint', async () => {
    const content = JSON.stringify({
      meaningsZh: ['保持', '保留'],
      exampleEn: 'We retain more through review.',
      exampleZh: '通过复习，我们能记住更多。',
    });
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content } }],
    }), { status: 200 }));
    const provider = new AiJsonProvider({
      baseUrl: 'https://ai.example/v1', apiKey: 'secret', model: 'model-name', request,
    });

    await expect(provider.enrich('retain')).resolves.toMatchObject({ meaningsZh: ['保持', '保留'] });
    expect(request).toHaveBeenCalledWith(
      'https://ai.example/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('rejects malformed model JSON', async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: '{"meaningsZh":[]}' } }],
    }), { status: 200 }));
    const provider = new AiJsonProvider({
      baseUrl: 'https://ai.example/v1', apiKey: 'secret', model: 'model-name', request,
    });

    await expect(provider.enrich('retain')).rejects.toThrow();
  });
});
