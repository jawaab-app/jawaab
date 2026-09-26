import type { SchoolKey } from '@/store/prefs';
import type { QuestionSummary, Tag } from './types';

const SCHOOL_LABELS: Record<string, string> = {
  hanafi: 'Ḥanafī',
  maliki: 'Mālikī',
  shafii: 'Shāfiʿī',
  hanbali: 'Ḥanbalī',
};

export function schoolLabel(madhab: string | null | undefined): string {
  return (madhab && SCHOOL_LABELS[madhab]) || 'General';
}

/** API filter for the reader's school; `unsure`/unset means every school. */
export function madhabFilter(school: SchoolKey | null | undefined): string | null {
  return school && school !== 'unsure' ? school : null;
}

// islamqa.org publisher slugs → display names. Unknown slugs are title-cased.
const PUBLISHERS: Record<string, string> = {
  askimam: 'AskImam',
  seekersguidance: 'SeekersGuidance',
  'darul-iftaa-mahmudiyyah': 'Darul Iftaa Mahmudiyyah',
  daruliftaa: 'Darul Iftaa',
  'daruliftaa-birmingham': 'Darul Iftaa Birmingham',
  'darulifta-deoband': 'Darul Ifta Deoband',
  'jamia-binoria': 'Jamia Binoria',
  hadithanswers: 'HadithAnswers',
  muftionline: 'Mufti Online',
  qibla: 'Qibla',
  'shafiifiqh': 'Shafiifiqh',
  'islamqa-org': 'IslamQA.org',
};

export function publisherName(slug: string | null | undefined): string {
  if (!slug) return 'IslamQA.org';
  return PUBLISHERS[slug] ?? titleCase(slug.replace(/[-_]+/g, ' '));
}

export function titleCase(s: string): string {
  return s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

const SCHOOL_TAGS = new Set(['hanafi', 'maliki', 'shafii', 'shafi-i', 'hanbali']);

/** First tag that names a topic rather than a school. */
export function topicTag(tags: Tag[]): Tag | null {
  return tags.find((t) => !SCHOOL_TAGS.has(t.slug)) ?? null;
}

export function readMinutes(text: string): number {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function relativeTime(then: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - then) / 1000));
  if (s < 60) return 'Just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d} days ago`;
  return new Date(then).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/** Row shape used by HistoryRow across home, search, saved and browse. */
export interface RowItem {
  id: string;
  question: string;
  publisher: string;
  school: string;
  when: string;
  live?: boolean;
}

export function toRow(q: QuestionSummary, when = ''): RowItem {
  return {
    id: String(q.id),
    question: q.title,
    publisher: q.scholar ? `${publisherName(q.source_slug)} · ${q.scholar}` : publisherName(q.source_slug),
    school: schoolLabel(q.madhab),
    when,
  };
}
