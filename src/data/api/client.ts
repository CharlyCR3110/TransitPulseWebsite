import { captureException } from '@/lib/observability';
import { ApiError, type ApiErrorCode } from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type AuthMode = 'required' | 'optional' | 'none';

export interface RequestOptions<TBody = unknown> {
  body?: TBody;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: AuthMode;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ApiClient {
  request<TResponse, TBody = unknown>(
    method: HttpMethod,
    path: string,
    options?: RequestOptions<TBody>,
  ): Promise<TResponse>;
}

export const TOKEN_STORAGE_KEY = 'transitpulse.auth.token';

interface ApiClientConfig {
  /** Read the API base URL. Defaults to `process.env.NEXT_PUBLIC_API_BASE_URL`. */
  getBaseUrl?: () => string | undefined;
  /** Read the bearer token. Defaults to reading `TOKEN_STORAGE_KEY` from `localStorage`. */
  getToken?: () => string | null;
  /** Network primitive. Defaults to the global `fetch`. Override in tests. */
  fetchImpl?: typeof fetch;
}

function defaultGetBaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

function defaultGetToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']): string {
  if (!path.startsWith('/')) {
    throw new Error(`apiClient path must start with "/", got: ${path}`);
  }
  if (path.startsWith('//')) {
    throw new Error(`apiClient path must not start with "//", got: ${path}`);
  }
  const trimmedBase = baseUrl.replace(/\/+$/, '');
  let url = `${trimmedBase}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params.append(key, String(value));
    }
    const qs = params.toString();
    if (qs.length > 0) {
      url += `?${qs}`;
    }
  }
  return url;
}

interface ErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown> | null;
  };
}

async function parseErrorBody(response: Response): Promise<ApiError> {
  let payload: ErrorEnvelope | undefined;
  try {
    payload = (await response.json()) as ErrorEnvelope;
  } catch {
    payload = undefined;
  }
  const envelope = payload?.error;
  if (envelope && typeof envelope.code === 'string') {
    return new ApiError({
      status: response.status,
      code: envelope.code as ApiErrorCode,
      message: envelope.message ?? response.statusText ?? 'Request failed',
      details: envelope.details ?? null,
    });
  }
  return new ApiError({
    status: response.status,
    code: 'http_error',
    message: response.statusText || `HTTP ${response.status}`,
    details: null,
  });
}

export function createApiClient(config: ApiClientConfig = {}): ApiClient {
  const getBaseUrl = config.getBaseUrl ?? defaultGetBaseUrl;
  const getToken = config.getToken ?? defaultGetToken;
  const fetchImpl = config.fetchImpl ?? globalThis.fetch;

  return {
    async request<TResponse, TBody = unknown>(
      method: HttpMethod,
      path: string,
      options: RequestOptions<TBody> = {},
    ): Promise<TResponse> {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        throw new Error(
          'apiClient: NEXT_PUBLIC_API_BASE_URL is not set. Define it in .env.local (e.g. http://localhost:8080/api/v1).',
        );
      }

      const authMode: AuthMode = options.auth ?? 'optional';
      const token = authMode === 'none' ? null : getToken();

      if (authMode === 'required' && !token) {
        throw new ApiError({
          status: 0,
          code: 'auth_required',
          message: 'Authentication required',
        });
      }

      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.headers ?? {}),
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let body: string | undefined;
      if (options.body !== undefined) {
        body = JSON.stringify(options.body);
        headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
      }

      const url = buildUrl(baseUrl, path, options.query);

      let response: Response;
      try {
        response = await fetchImpl(url, {
          method,
          headers,
          body,
          signal: options.signal,
        });
      } catch (cause) {
        throw new ApiError({
          status: 0,
          code: 'network_error',
          message: cause instanceof Error ? cause.message : 'Network request failed',
        });
      }

      if (response.status === 204) {
        return undefined as TResponse;
      }

      if (!response.ok) {
        const apiError = await parseErrorBody(response);
        if (apiError.status >= 500) {
          captureException(apiError, { url, method, status: apiError.status });
        }
        throw apiError;
      }

      const text = await response.text();
      if (text.length === 0) {
        return undefined as TResponse;
      }
      return JSON.parse(text) as TResponse;
    },
  };
}

export const apiClient: ApiClient = createApiClient();
