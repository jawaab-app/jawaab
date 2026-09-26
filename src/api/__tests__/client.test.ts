import { api, ApiError, buildUrl } from '../client';
import { API_URL } from '../config';

const ok = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response);

afterEach(() => jest.restoreAllMocks());

it('builds URLs, dropping empty params and encoding values', () => {
  expect(buildUrl('/search', { q: 'wudu & ghusl', madhab: null, limit: 20, offset: undefined, tag: '' }, 'https://h')).toBe(
    'https://h/search?q=wudu%20%26%20ghusl&limit=20',
  );
  expect(buildUrl('/health', {}, 'https://h')).toBe('https://h/health');
});

it('defaults to the droplet over HTTPS', () => {
  expect(API_URL).toMatch(/^https:\/\//);
});

it('fetches search results with the school filter', async () => {
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => ok({ items: [], total: 0, limit: 20, offset: 0, query: 'fast' }));
  const page = await api.search('fast', { madhab: 'hanafi', limit: 20 });
  expect(page.total).toBe(0);
  expect(String(fetchMock.mock.calls[0][0])).toBe(`${API_URL}/search?q=fast&madhab=hanafi&limit=20`);
});

it('maps 404 and server errors to ApiError', async () => {
  jest.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve({ ok: false, status: 404 } as Response));
  await expect(api.question(1)).rejects.toMatchObject({ status: 404 });
  jest.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve({ ok: false, status: 500 } as Response));
  await expect(api.question(1)).rejects.toBeInstanceOf(ApiError);
});

it('reports network failures without a status', async () => {
  jest.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject(new TypeError('Network request failed')));
  await expect(api.questions()).rejects.toMatchObject({ status: null, message: expect.stringMatching(/connection/) });
});
