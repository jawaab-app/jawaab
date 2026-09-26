import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError, type ListParams } from './client';
import type { Page, QuestionDetail, QuestionSummary } from './types';

export interface Query<T> {
  data: T | undefined;
  error: ApiError | null;
  loading: boolean;
  reload: () => void;
}

// Session cache so going back to a screen doesn't refetch. The API also sends
// ETag/Cache-Control, so this only saves the round trip.
const cache = new Map<string, unknown>();

export function clearApiCache() {
  cache.clear();
}

/** Fetch `fetcher` once per `key`; `key === null` skips the request. */
export function useApi<T>(key: string | null, fetcher: (signal: AbortSignal) => Promise<T>): Query<T> {
  const [state, setState] = useState<{ key: string | null; data?: T; error: ApiError | null; loading: boolean }>(() => ({
    key,
    data: key ? (cache.get(key) as T | undefined) : undefined,
    error: null,
    loading: !!key && !cache.has(key),
  }));
  const [nonce, setNonce] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) {
      setState({ key, error: null, loading: false });
      return;
    }
    if (nonce === 0 && cache.has(key)) {
      setState({ key, data: cache.get(key) as T, error: null, loading: false });
      return;
    }
    const controller = new AbortController();
    setState((s) => ({ key, data: s.key === key ? s.data : undefined, error: null, loading: true }));
    fetcherRef
      .current(controller.signal)
      .then((data) => {
        cache.set(key, data);
        if (!controller.signal.aborted) setState({ key, data, error: null, loading: false });
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        const error = e instanceof ApiError ? e : new ApiError(String(e), null);
        setState({ key, error, loading: false });
      });
    return () => controller.abort();
  }, [key, nonce]);

  const reload = useCallback(() => {
    if (key) cache.delete(key);
    setNonce((n) => n + 1);
  }, [key]);

  const current = state.key === key;
  return {
    data: current ? state.data : undefined,
    error: current ? state.error : null,
    loading: current ? state.loading : !!key,
    reload,
  };
}

export function useQuestion(id: string | undefined) {
  const valid = !!id && /^\d+$/.test(id);
  return useApi<QuestionDetail>(valid ? `question:${id}` : null, (s) => api.question(id!, s));
}

export function useQuestionCount(madhab: string | null) {
  return useApi<Page>(`count:${madhab ?? '*'}`, (s) => api.questions({ madhab, limit: 1 }, s));
}

export function useQuestionList(params: ListParams) {
  return useApi<Page>(`list:${JSON.stringify(params)}`, (s) => api.questions(params, s));
}

export function useSearchCount(q: string, madhab: string | null) {
  return useApi<Page>(`searchcount:${madhab ?? '*'}:${q}`, (s) => api.search(q, { madhab, limit: 1 }, s));
}

type PageLoader = (offset: number, signal: AbortSignal) => Promise<Page<QuestionSummary>>;

export interface Paged {
  items: QuestionSummary[];
  total: number | null;
  loading: boolean;
  error: ApiError | null;
  hasMore: boolean;
  loadMore: () => void;
  /** Retry after an error: the failed page if some loaded, else from the start. */
  retry: () => void;
  reload: () => void;
}

/** Offset-paginated list. Changing `key` resets it; `key === null` shows nothing. */
export function usePaged(key: string | null, load: PageLoader): Paged {
  const [items, setItems] = useState<QuestionSummary[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [nonce, setNonce] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;
  const inflight = useRef<AbortController | null>(null);
  const keyRef = useRef(key);

  const fetchPage = useCallback((offset: number, replace: boolean) => {
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;
    const forKey = keyRef.current;
    setLoading(true);
    setError(null);
    loadRef
      .current(offset, controller.signal)
      .then((page) => {
        if (controller.signal.aborted || forKey !== keyRef.current) return;
        setItems((prev) => {
          const base = replace ? [] : prev;
          const seen = new Set(base.map((q) => q.id));
          return [...base, ...page.items.filter((q) => !seen.has(q.id))];
        });
        setTotal(page.total);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setError(e instanceof ApiError ? e : new ApiError(String(e), null));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    keyRef.current = key;
    setItems([]);
    setTotal(null);
    setError(null);
    if (key) fetchPage(0, true);
    else {
      inflight.current?.abort();
      setLoading(false);
    }
    return () => inflight.current?.abort();
  }, [key, nonce, fetchPage]);

  const hasMore = total === null ? false : items.length < total;
  const loadMore = useCallback(() => {
    if (!keyRef.current || loading || error || !hasMore) return;
    fetchPage(items.length, false);
  }, [loading, error, hasMore, items.length, fetchPage]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const retry = useCallback(() => {
    if (!keyRef.current || loading) return;
    if (items.length) fetchPage(items.length, false);
    else setNonce((n) => n + 1);
  }, [loading, items.length, fetchPage]);

  return { items, total, loading, error, hasMore, loadMore, retry, reload };
}
