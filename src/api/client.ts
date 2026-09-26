import { API_URL, REQUEST_TIMEOUT_MS } from './config';
import type { Page, QuestionDetail, SearchPage } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Params = Record<string, string | number | null | undefined>;

export function buildUrl(path: string, params: Params = {}, base = API_URL): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `${base}${path}${qs ? `?${qs}` : ''}`;
}

export async function getJson<T>(path: string, params?: Params, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    let res: Response;
    try {
      res = await fetch(buildUrl(path, params), { headers: { Accept: 'application/json' }, signal: controller.signal });
    } catch {
      throw new ApiError(signal?.aborted ? 'Request cancelled' : 'Could not reach Jawāb. Check your connection.', null);
    }
    if (res.status === 404) throw new ApiError('Not found', 404);
    if (!res.ok) throw new ApiError(`Server error (${res.status})`, res.status);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

/** `madhab` is omitted when the reader follows every school. */
export interface ListParams {
  madhab?: string | null;
  tag?: string | null;
  source?: string | null;
  limit?: number;
  offset?: number;
}

export const api = {
  questions: (p: ListParams = {}, signal?: AbortSignal) => getJson<Page>('/questions', { ...p }, signal),
  question: (id: number | string, signal?: AbortSignal) => getJson<QuestionDetail>(`/questions/${id}`, undefined, signal),
  search: (q: string, p: { madhab?: string | null; limit?: number; offset?: number } = {}, signal?: AbortSignal) =>
    getJson<SearchPage>('/search', { q, ...p }, signal),
};
