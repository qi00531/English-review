import { z } from 'zod';
import { AiEnrichmentSchema, type AiProvider } from './schema';

const CompletionSchema = z.object({
  choices: z.array(z.object({
    message: z.object({ content: z.string() }),
  })).min(1),
});

type AiOptions = {
  baseUrl: string;
  apiKey: string;
  model: string;
  request?: typeof fetch;
};

export class AiJsonProvider implements AiProvider {
  private readonly request: typeof fetch;

  constructor(private readonly options: AiOptions) {
    this.request = options.request ?? fetch;
  }

  async enrich(term: string) {
    const response = await this.request(
      `${this.options.baseUrl.replace(/\/$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.options.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: this.options.model,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: [
                '你是严谨的英汉学习词典编辑。',
                '返回 JSON：meaningsZh 为多个主要中文义项；exampleEn 只能有一句，',
                '且对应最常见义项；exampleZh 是该句准确中文翻译。不要输出其他字段。',
              ].join(''),
            },
            { role: 'user', content: term },
          ],
        }),
        signal: AbortSignal.timeout(20_000),
      },
    );
    if (!response.ok) throw new Error(`AI request failed: ${response.status}`);

    const completion = CompletionSchema.parse(await response.json());
    return AiEnrichmentSchema.parse(JSON.parse(completion.choices[0].message.content));
  }
}
