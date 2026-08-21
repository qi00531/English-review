import { parseTerms } from './parseTerms';

it('trims lines, removes duplicates case-insensitively, and preserves order', () => {
  expect(parseTerms(' retain \nSubtle\nretain\n\nin light of ')).toEqual([
    'retain', 'Subtle', 'in light of',
  ]);
});

it('rejects more than 100 unique terms', () => {
  expect(() => parseTerms(Array.from({ length: 101 }, (_, index) => `word-${index}`).join('\n')))
    .toThrow('每次最多生成 100 条内容');
});
