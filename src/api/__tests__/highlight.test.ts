import { highlightRuns, queryTerms } from '../highlight';

describe('queryTerms', () => {
  it('drops short words and duplicates', () => {
    expect(queryTerms('Can I pray in my shoes, shoes?')).toEqual(['can', 'pray', 'shoes']);
  });
});

describe('highlightRuns', () => {
  it('marks matched words by prefix and merges adjacent runs', () => {
    const runs = highlightRuns('Praying in shoes while travelling', queryTerms('pray shoe'));
    expect(runs).toEqual([
      { text: 'Praying', hit: true },
      { text: ' in ', hit: false },
      { text: 'shoes', hit: true },
      { text: ' while travelling', hit: false },
    ]);
  });

  it('returns one plain run without terms', () => {
    expect(highlightRuns('Zakat on gold', [])).toEqual([{ text: 'Zakat on gold', hit: false }]);
  });
});
