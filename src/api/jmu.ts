// Parser for Jawaab Markup (JMU), the compact markup the backend compiles
// scraped answers into (backend/app/services/jmu.py):
//   ## / ###  headings · blank line = paragraph · > quote · - / 1. list items
//   **bold** · *italic* · [text](url)

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; children: Inline[] }
  | { kind: 'italic'; children: Inline[] }
  | { kind: 'link'; text: string; url: string };

export type Block =
  | { kind: 'heading'; level: 2 | 3; inlines: Inline[] }
  | { kind: 'paragraph'; inlines: Inline[] }
  | { kind: 'quote'; inlines: Inline[] }
  | { kind: 'listItem'; ordered: boolean; marker: string; inlines: Inline[] };

const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)/;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let buf = '';
  const flush = () => {
    if (buf) out.push({ kind: 'text', text: buf });
    buf = '';
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    if (rest.startsWith('**')) {
      const end = src.indexOf('**', i + 2);
      if (end > i + 2) {
        flush();
        out.push({ kind: 'bold', children: parseInline(src.slice(i + 2, end)) });
        i = end + 2;
        continue;
      }
    } else if (rest[0] === '*' && rest[1] !== ' ') {
      const end = src.indexOf('*', i + 1);
      if (end > i + 1 && src[end + 1] !== '*') {
        flush();
        out.push({ kind: 'italic', children: parseInline(src.slice(i + 1, end)) });
        i = end + 1;
        continue;
      }
    } else if (rest[0] === '[') {
      const m = LINK.exec(rest);
      if (m) {
        flush();
        out.push({ kind: 'link', text: m[1], url: m[2] });
        i += m[0].length;
        continue;
      }
    }
    buf += src[i];
    i += 1;
  }
  flush();
  return out;
}

export function parseJmu(jmu: string): Block[] {
  const blocks: Block[] = [];
  const chunks = (jmu || '').replace(/\r\n?/g, '\n').split(/\n{2,}/);
  for (const raw of chunks) {
    const chunk = raw.trim();
    if (!chunk) continue;
    const lines = chunk.split('\n');

    const heading = /^(#{2,3})\s+(.*)$/.exec(chunk);
    if (heading && lines.length === 1) {
      blocks.push({ kind: 'heading', level: heading[1].length === 2 ? 2 : 3, inlines: parseInline(heading[2]) });
      continue;
    }
    if (lines.every((l) => /^>\s?/.test(l))) {
      blocks.push({ kind: 'quote', inlines: parseInline(lines.map((l) => l.replace(/^>\s?/, '')).join('\n')) });
      continue;
    }
    if (lines.every((l) => /^(-|\d+\.)\s+/.test(l))) {
      for (const l of lines) {
        const m = /^(-|\d+\.)\s+(.*)$/.exec(l)!;
        const ordered = m[1] !== '-';
        blocks.push({ kind: 'listItem', ordered, marker: ordered ? m[1] : '•', inlines: parseInline(m[2]) });
      }
      continue;
    }
    blocks.push({ kind: 'paragraph', inlines: parseInline(chunk) });
  }
  return blocks;
}

export function inlineText(inlines: Inline[]): string {
  return inlines.map((n) => (n.kind === 'text' ? n.text : n.kind === 'link' ? n.text : inlineText(n.children))).join('');
}

export function jmuText(jmu: string): string {
  return parseJmu(jmu)
    .map((b) => inlineText(b.inlines))
    .join('\n');
}
