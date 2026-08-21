export function parseTerms(input: string): string[] {
  const seen = new Set<string>();
  const terms = input.split(/\r?\n/).map((term) => term.trim()).filter((term) => {
    if (!term) return false;
    const normalized = term.toLocaleLowerCase('en-US');
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
  if (terms.length > 100) throw new Error('每次最多生成 100 条内容');
  return terms;
}
