import { jmuText, parseInline, parseJmu } from '../jmu';

describe('parseJmu', () => {
  it('splits headings, paragraphs, quotes and lists', () => {
    const blocks = parseJmu('## Ruling\n\nFirst para.\n\n> quoted\n> more\n\n- one\n- two\n\n1. a\n2. b\n\n### Sub');
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph', 'quote', 'listItem', 'listItem', 'listItem', 'listItem', 'heading']);
    expect(blocks[0]).toMatchObject({ kind: 'heading', level: 2 });
    expect(blocks[7]).toMatchObject({ kind: 'heading', level: 3 });
    expect(blocks[5]).toMatchObject({ kind: 'listItem', ordered: true, marker: '1.' });
    expect(blocks[3]).toMatchObject({ kind: 'listItem', ordered: false, marker: '•' });
  });

  it('treats plain scraped text as one paragraph', () => {
    const blocks = parseJmu('asalam o alikum I have to ask about my fasts.');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].kind).toBe('paragraph');
  });

  it('handles empty input', () => {
    expect(parseJmu('')).toEqual([]);
  });
});

describe('parseInline', () => {
  it('parses bold, italic and links', () => {
    expect(parseInline('a **b** *c* [d](https://x.y/z)')).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'bold', children: [{ kind: 'text', text: 'b' }] },
      { kind: 'text', text: ' ' },
      { kind: 'italic', children: [{ kind: 'text', text: 'c' }] },
      { kind: 'text', text: ' ' },
      { kind: 'link', text: 'd', url: 'https://x.y/z' },
    ]);
  });

  it('leaves unmatched markers as text', () => {
    expect(parseInline('5 * 3 and **open')).toEqual([{ kind: 'text', text: '5 * 3 and **open' }]);
  });
});

it('jmuText strips markup', () => {
  expect(jmuText('## Title\n\nSee **this** [link](http://a)')).toBe('Title\nSee this link');
});
