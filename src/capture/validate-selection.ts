import type { CaptureType } from './model';

export type SelectionValidation =
  | { ok: false; code: 'EMPTY' | 'NOT_ENGLISH' | 'TOO_LONG' }
  | { ok: true; text: string; normalizedText: string; type: CaptureType };

const WORD_PATTERN = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g;
const SELECTION_PATTERN = /^[A-Za-z]+(?:['’-][A-Za-z]+)*(?:[\s.,!?;:()\-]+[A-Za-z]+(?:['’-][A-Za-z]+)*)*[.,!?;:]?$/;

export function validateSelection(raw: string): SelectionValidation {
  const text = raw.trim().replace(/\s+/g, ' ');
  if (!text) return { ok: false, code: 'EMPTY' };
  if (!SELECTION_PATTERN.test(text)) return { ok: false, code: 'NOT_ENGLISH' };

  const wordCount = text.match(WORD_PATTERN)?.length ?? 0;
  if (wordCount > 8) return { ok: false, code: 'TOO_LONG' };

  return {
    ok: true,
    text,
    normalizedText: text.toLocaleLowerCase('en-US'),
    type: wordCount === 1 ? 'word' : 'phrase',
  };
}
