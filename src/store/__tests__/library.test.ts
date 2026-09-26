import { summaryOf, withRead, withSaved, type Library } from '../library';

const q = (id: number) => ({ id, slug: `s${id}`, title: `Q${id}`, madhab: 'hanafi', source_slug: 'askimam', scholar: null });
const empty: Library = { saved: [], history: [] };

it('records reads newest first without duplicates', () => {
  let lib = withRead(empty, q(1), 1);
  lib = withRead(lib, q(2), 2);
  lib = withRead(lib, q(1), 3);
  expect(lib.history.map((e) => [e.question.id, e.at])).toEqual([
    [1, 3],
    [2, 2],
  ]);
});

it('caps history at 50', () => {
  let lib = empty;
  for (let i = 0; i < 60; i++) lib = withRead(lib, q(i), i);
  expect(lib.history).toHaveLength(50);
  expect(lib.history[0].question.id).toBe(59);
});

it('toggles saved answers', () => {
  const on = withSaved(empty, q(5), true, 1);
  expect(on.saved.map((e) => e.question.id)).toEqual([5]);
  expect(withSaved(on, q(5), false).saved).toEqual([]);
});

it('stores only summary fields', () => {
  const detail = { ...q(9), url: 'u', content_jmu: 'long', tags: [] };
  expect(summaryOf(detail)).toEqual(q(9));
});
