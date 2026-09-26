import { madhabFilter, publisherName, readMinutes, relativeTime, schoolLabel, toRow, topicTag } from '../format';

it('labels schools and falls back for unknown', () => {
  expect(schoolLabel('hanafi')).toBe('Ḥanafī');
  expect(schoolLabel('unknown')).toBe('General');
});

it('only filters by a concrete school', () => {
  expect(madhabFilter('shafii')).toBe('shafii');
  expect(madhabFilter('unsure')).toBeNull();
  expect(madhabFilter(null)).toBeNull();
});

it('names publishers, title-casing unknown slugs', () => {
  expect(publisherName('askimam')).toBe('AskImam');
  expect(publisherName('some-new-site')).toBe('Some New Site');
  expect(publisherName(null)).toBe('IslamQA.org');
});

it('skips school tags when choosing a topic', () => {
  expect(topicTag([{ name: 'Hanafi', slug: 'hanafi' }, { name: 'Ramadan', slug: 'ramadan' }])?.slug).toBe('ramadan');
  expect(topicTag([{ name: 'Hanafi', slug: 'hanafi' }])).toBeNull();
});

it('estimates reading time with a one-minute floor', () => {
  expect(readMinutes('')).toBe(1);
  expect(readMinutes(Array(660).fill('w').join(' '))).toBe(3);
});

it('formats relative times', () => {
  const now = 1_000_000_000_000;
  expect(relativeTime(now - 10_000, now)).toBe('Just now');
  expect(relativeTime(now - 5 * 60_000, now)).toBe('5 min ago');
  expect(relativeTime(now - 3 * 3_600_000, now)).toBe('3h ago');
  expect(relativeTime(now - 26 * 3_600_000, now)).toBe('Yesterday');
});

it('maps a question to a row', () => {
  expect(toRow({ id: 7, slug: 's', title: 'T?', madhab: 'maliki', source_slug: 'askimam', scholar: 'Mufti X' }, 'now')).toEqual({
    id: '7',
    question: 'T?',
    publisher: 'AskImam · Mufti X',
    school: 'Mālikī',
    when: 'now',
  });
});
