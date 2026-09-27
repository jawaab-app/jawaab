// Split a title into plain and matched runs so search results can show which
// words hit. Matching is by word prefix, case-insensitive, on words of three or
// more letters, which is close to how Postgres stems the query.

export interface Run {
  text: string;
  hit: boolean;
}

export function queryTerms(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^\p{L}\p{N}']+/u)
        .map((w) => w.replace(/^'+|'+$/g, ''))
        .filter((w) => w.length >= 3),
    ),
  );
}

export function highlightRuns(text: string, terms: string[]): Run[] {
  if (!terms.length || !text) return [{ text, hit: false }];
  const runs: Run[] = [];
  const re = /[\p{L}\p{N}']+/gu;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const word = m[0];
    const start = m.index ?? 0;
    const lower = word.toLowerCase();
    const hit = terms.some((t) => lower.startsWith(t) || (t.length >= 5 && lower.startsWith(t.slice(0, -1))));
    if (start > last) push(runs, text.slice(last, start), false);
    push(runs, word, hit);
    last = start + word.length;
  }
  if (last < text.length) push(runs, text.slice(last), false);
  return runs;
}

function push(runs: Run[], text: string, hit: boolean) {
  const prev = runs[runs.length - 1];
  if (prev && prev.hit === hit) prev.text += text;
  else runs.push({ text, hit });
}
