import { z } from 'zod';
import type { AiSettings, CaptureDraft } from './model';
import { validateSelection } from './validate-selection';

const DictionarySchema = z.array(z.object({
  phonetics: z.array(z.object({ text: z.string().optional(), audio: z.string().optional() })).optional(),
}));
const AiContentSchema = z.object({
  term: z.string().trim().min(1),
  meaningsZh: z.preprocess(
    (value) => typeof value === 'string'
      ? value.split(/[；;\n]+/).map((meaning) => meaning.trim()).filter(Boolean)
      : value,
    z.array(z.string().trim().min(1)).min(1),
  ),
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

class InvalidAiResponseError extends Error {
  readonly code = 'INVALID_RESPONSE';
  constructor() {
    super('AI response does not match the selected term');
    this.name = 'InvalidAiResponseError';
  }
}

function normalizeTerm(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}

function exampleUsesTerm(example: string, term: string) {
  const exampleWords: string[] = example.toLocaleLowerCase('en-US').match(/[a-z]+(?:['’-][a-z]+)*/g) ?? [];
  const termWords: string[] = term.toLocaleLowerCase('en-US').match(/[a-z]+(?:['’-][a-z]+)*/g) ?? [];
  let cursor = 0;
  return termWords.length > 0 && termWords.every((word) => {
    const index = exampleWords.indexOf(word, cursor);
    if (index < 0) return false;
    cursor = index + 1;
    return true;
  });
}

async function lookupDictionary(term: string, request: Request) {
  let ipa: string | null = null;
  let audioUrl: string | null = null;
  try {
    const response = await request(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
    if (response.ok) {
      const dictionary = DictionarySchema.parse(await response.json());
      const phonetic = dictionary[0]?.phonetics?.find((item) => item.audio) ?? dictionary[0]?.phonetics?.[0];
      ipa = phonetic?.text ?? null;
      audioUrl = phonetic?.audio || null;
    }
  } catch {
    // Dictionary metadata is optional; AI content remains required.
  }
  return { ipa, audioUrl };
}

async function generateLearningContent(
  target: { text: string; normalizedText: string },
  settings: AiSettings,
  request: Request,
) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const aiResponse = await request(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${settings.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: settings.model,
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              '你是严谨的英汉学习词典编辑，只处理用户给出的目标英文。',
              '只返回 JSON，字段必须为 term、meaningsZh、exampleEn、exampleZh。',
              'term 必须原样等于目标英文；meaningsZh 只能是该词或短语的主要中文义项；',
              'exampleEn 只能有一句且必须原样包含目标英文；exampleZh 是该句的准确翻译。',
              '禁止回答其他单词。',
            ].join(''),
          },
          { role: 'user', content: `目标英文：${target.text}${attempt === 1 ? '\n上一次回答与目标不一致，请严格重新生成。' : ''}` },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!aiResponse.ok) throw new AiRequestError(aiResponse.status);
    try {
      const completion = CompletionSchema.parse(await aiResponse.json());
      const candidate = AiContentSchema.parse(JSON.parse(completion.choices[0].message.content));
      if (normalizeTerm(candidate.term) === target.normalizedText
        && exampleUsesTerm(candidate.exampleEn, target.text)) return candidate;
    } catch {
      // A malformed or mismatched answer gets one constrained retry.
    }
  }
  throw new InvalidAiResponseError();
}

export async function enrichSelection(
  raw: string,
  settings: AiSettings,
  request: Request = fetch,
): Promise<CaptureDraft> {
  if (!settings.apiKey.trim()) throw new Error('AI_KEY_MISSING');
  const validated = validateSelection(raw);
  if (!validated.ok) throw new Error(validated.code);

  const dictionaryTask = lookupDictionary(validated.text, request);
  const aiTask = generateLearningContent(validated, settings, request);
  const [{ ipa, audioUrl }, content] = await Promise.all([dictionaryTask, aiTask]);
  const { term: _term, ...learningContent } = content;

  return {
    id: crypto.randomUUID(),
    text: validated.text,
    normalizedText: validated.normalizedText,
    type: validated.type,
    ...learningContent,
    usIpa: ipa,
    ukIpa: null,
    usAudioUrl: audioUrl,
    ukAudioUrl: null,
    audioFallback: audioUrl ? 'none' : 'speech-synthesis',
    status: 'ready',
    capturedAt: new Date().toISOString(),
  };
}
