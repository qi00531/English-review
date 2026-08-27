import { z } from 'zod';
import type { AiSettings, CaptureDraft } from './model';
import { validateSelection } from './validate-selection';

const DictionarySchema = z.array(z.object({
  phonetics: z.array(z.object({ text: z.string().optional(), audio: z.string().optional() })).optional(),
}));
const AiContentSchema = z.object({
  meaningsZh: z.array(z.string().trim().min(1)).min(1),
  exampleEn: z.string().trim().min(1),
  exampleZh: z.string().trim().min(1),
});
const CompletionSchema = z.object({
  choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1),
});

type Request = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

class AiRequestError extends Error {
  readonly code = 'AI_REQUEST_FAILED';
  constructor(readonly status: number) {
    super('AI request failed');
    this.name = 'AiRequestError';
  }
}

export async function enrichSelection(
  raw: string,
  settings: AiSettings,
  request: Request = fetch,
): Promise<CaptureDraft> {
  if (!settings.apiKey.trim()) throw new Error('AI_KEY_MISSING');
  const validated = validateSelection(raw);
  if (!validated.ok) throw new Error(validated.code);

  let ipa: string | null = null;
  let audioUrl: string | null = null;
  try {
    const response = await request(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(validated.text)}`);
    if (response.ok) {
      const dictionary = DictionarySchema.parse(await response.json());
      const phonetic = dictionary[0]?.phonetics?.find((item) => item.audio) ?? dictionary[0]?.phonetics?.[0];
      ipa = phonetic?.text ?? null;
      audioUrl = phonetic?.audio || null;
    }
  } catch {
    // Dictionary metadata is optional; AI content remains required.
  }

  const aiResponse = await request(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${settings.apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: settings.model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: '你是严谨的英汉学习词典编辑。只返回 JSON：meaningsZh 为主要中文义项；exampleEn 只能有一句常见义项例句；exampleZh 为准确翻译。' },
        { role: 'user', content: validated.text },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!aiResponse.ok) throw new AiRequestError(aiResponse.status);
  const completion = CompletionSchema.parse(await aiResponse.json());
  const content = AiContentSchema.parse(JSON.parse(completion.choices[0].message.content));

  return {
    id: crypto.randomUUID(),
    text: validated.text,
    normalizedText: validated.normalizedText,
    type: validated.type,
    ...content,
    usIpa: ipa,
    ukIpa: null,
    usAudioUrl: audioUrl,
    ukAudioUrl: null,
    audioFallback: audioUrl ? 'none' : 'speech-synthesis',
    status: 'ready',
    capturedAt: new Date().toISOString(),
  };
}
