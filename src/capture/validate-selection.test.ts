import { describe, expect, it } from 'vitest';
import { validateSelection } from './validate-selection';

describe('validateSelection', () => {
  it.each([
    ['Potential', 'Potential', 'potential', 'word'],
    [' take   into account ', 'take into account', 'take into account', 'phrase'],
    ["learner's", "learner's", "learner's", 'word'],
  ])('accepts %s', (input, text, normalizedText, type) => {
    expect(validateSelection(input)).toEqual({ ok: true, text, normalizedText, type });
  });

  it.each([
    ['', 'EMPTY'],
    ['学习', 'NOT_ENGLISH'],
    ['hello 世界', 'NOT_ENGLISH'],
    ['one two three four five six seven eight nine', 'TOO_LONG'],
  ])('rejects %s with %s', (input, code) => {
    expect(validateSelection(input)).toEqual({ ok: false, code });
  });
});
