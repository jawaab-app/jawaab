// Shapes returned by the Jawāb API (backend/app/schemas.py).

export interface QuestionSummary {
  id: number;
  slug: string;
  title: string;
  madhab: string;
  source_slug: string | null;
  scholar: string | null;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface QuestionDetail extends QuestionSummary {
  url: string;
  question: string | null;
  answer: string | null;
  content_jmu: string;
  original_source_url: string | null;
  tags: Tag[];
}

export interface Page<T = QuestionSummary> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface SearchHit extends QuestionSummary {
  rank: number;
}

export interface SearchPage extends Page<SearchHit> {
  query: string;
}

export interface FacetCount {
  value: string;
  count: number;
}
