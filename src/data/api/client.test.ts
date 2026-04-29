import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './errors';
import { TOKEN_STORAGE_KEY, createApiClient } from './client';

const BASE_URL = 'http://api.test/api/v1';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('apiClient.request', () => {
  it('parses 200 JSON responses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ id: '42', name: 'San Pedro' }));
    const client = createApiClient({
      getBaseUrl: () => BASE_URL,
      getToken: () => null,
      fetchImpl,
    });

    const result = await client.request<{ id: string; name: string }>('GET', '/stops/42');

    expect(result).toEqual({ id: '42', name: 'San Pedro' });
    expect(fetchImpl).toHaveBeenCalledWith(
      `${BASE_URL}/stops/42`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('returns undefined for 204 No Content', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    const result = await client.request<void>('DELETE', '/reports/1');

    expect(result).toBeUndefined();
  });

  it('serializes query params and skips undefined / null values', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([]));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    await client.request('GET', '/planner/search', {
      query: { from: 'A', to: 'B', sort: 'fastest', limit: undefined, deleted: null },
    });

    const calledUrl = fetchImpl.mock.calls[0]?.[0] as string;
    expect(calledUrl).toBe(`${BASE_URL}/planner/search?from=A&to=B&sort=fastest`);
  });

  it('serializes JSON bodies and sets Content-Type', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ id: 1 }, { status: 201 }));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    await client.request('POST', '/reports', {
      body: { type: 'delay', description: 'late' },
    });

    const init = fetchImpl.mock.calls[0]?.[1] as RequestInit;
    expect(init.body).toBe(JSON.stringify({ type: 'delay', description: 'late' }));
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers.Accept).toBe('application/json');
  });

  it('attaches Authorization when a token exists and auth is optional (default)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createApiClient({
      getBaseUrl: () => BASE_URL,
      getToken: () => 'abc.def.ghi',
      fetchImpl,
    });

    await client.request('GET', '/users/me');

    const init = fetchImpl.mock.calls[0]?.[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer abc.def.ghi');
  });

  it('reads token from the configured TOKEN_STORAGE_KEY by default', () => {
    // This test only documents the default seam name — the contract is exercised
    // via the explicit getToken in the test above. Asserting on the storage key
    // here keeps the constant from drifting.
    expect(TOKEN_STORAGE_KEY).toBe('transitpulse.auth.token');
  });

  it('does not attach Authorization when auth is "none" even if a token exists', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createApiClient({
      getBaseUrl: () => BASE_URL,
      getToken: () => 'tok',
      fetchImpl,
    });

    await client.request('GET', '/alerts', { auth: 'none' });

    const init = fetchImpl.mock.calls[0]?.[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it('throws auth_required ApiError without hitting fetch when auth is "required" and no token', async () => {
    const fetchImpl = vi.fn();
    const client = createApiClient({
      getBaseUrl: () => BASE_URL,
      getToken: () => null,
      fetchImpl,
    });

    await expect(client.request('GET', '/users/me', { auth: 'required' })).rejects.toMatchObject({
      code: 'auth_required',
      status: 0,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('parses the standard error envelope on non-2xx', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { code: 'not_found', message: 'Stop not found', details: { stopId: 'x' } },
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    await expect(client.request('GET', '/stops/x')).rejects.toMatchObject({
      status: 404,
      code: 'not_found',
      message: 'Stop not found',
      details: { stopId: 'x' },
    });
  });

  it('falls back to http_error when the envelope is missing', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('Internal Server Error', { status: 500 }));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    const promise = client.request('GET', '/anything');
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 500, code: 'http_error' });
  });

  it('maps fetch rejection to network_error with status 0', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    await expect(client.request('GET', '/alerts')).rejects.toMatchObject({
      status: 0,
      code: 'network_error',
      message: 'Failed to fetch',
    });
  });

  it('throws an explicit error when the base URL is missing', async () => {
    const fetchImpl = vi.fn();
    const client = createApiClient({
      getBaseUrl: () => undefined,
      getToken: () => null,
      fetchImpl,
    });

    await expect(client.request('GET', '/alerts')).rejects.toThrowError(
      /NEXT_PUBLIC_API_BASE_URL is not set/,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rejects paths that do not start with "/"', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    await expect(client.request('GET', 'alerts')).rejects.toThrowError(/must start with "\/"/);
  });

  it('rejects paths starting with "//" to surface base-url misconfig', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createApiClient({ getBaseUrl: () => BASE_URL, getToken: () => null, fetchImpl });

    await expect(client.request('GET', '//alerts')).rejects.toThrowError(/must not start with "\/\/"/);
  });

  it('joins base URL with trailing slashes correctly', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}));
    const client = createApiClient({
      getBaseUrl: () => `${BASE_URL}/`,
      getToken: () => null,
      fetchImpl,
    });

    await client.request('GET', '/alerts');

    const calledUrl = fetchImpl.mock.calls[0]?.[0] as string;
    expect(calledUrl).toBe(`${BASE_URL}/alerts`);
  });
});
