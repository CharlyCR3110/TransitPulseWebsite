import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/data/api/errors';
import { AUTH_EXPIRED_EVENT, createQueryClient } from './query-provider';

afterEach(() => {
  vi.restoreAllMocks();
});

async function flush() {
  await new Promise((r) => setTimeout(r, 0));
}

describe('QueryClient defaults', () => {
  it('dispatches auth:expired when a query rejects with auth_required', async () => {
    const client = createQueryClient();
    const listener = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, listener);

    await client
      .fetchQuery({
        queryKey: ['test', 'auth'],
        queryFn: () => {
          throw new ApiError({ status: 401, code: 'auth_required', message: 'no' });
        },
        retry: false,
      })
      .catch(() => {});
    await flush();

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
  });

  it('does NOT dispatch auth:expired for non-auth errors', async () => {
    const client = createQueryClient();
    const listener = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, listener);

    await client
      .fetchQuery({
        queryKey: ['test', 'not-found'],
        queryFn: () => {
          throw new ApiError({ status: 404, code: 'not_found', message: 'gone' });
        },
        retry: false,
      })
      .catch(() => {});
    await flush();

    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
  });

  it('does not retry auth_required failures', async () => {
    const client = createQueryClient();
    const queryFn = vi.fn(() => {
      throw new ApiError({ status: 401, code: 'auth_required', message: 'no' });
    });

    await client
      .fetchQuery({ queryKey: ['test', 'retry-auth'], queryFn })
      .catch(() => {});

    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('does not retry not_found failures', async () => {
    const client = createQueryClient();
    const queryFn = vi.fn(() => {
      throw new ApiError({ status: 404, code: 'not_found', message: 'gone' });
    });

    await client
      .fetchQuery({ queryKey: ['test', 'retry-404'], queryFn })
      .catch(() => {});

    expect(queryFn).toHaveBeenCalledTimes(1);
  });
});
