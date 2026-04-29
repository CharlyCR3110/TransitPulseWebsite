import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn(), back: vi.fn() }),
}));

vi.mock('@/data/providers', () => ({
  authProvider: { login: vi.fn(), register: vi.fn() },
  usersProvider: { me: vi.fn() },
}));

import { ApiError } from '@/data/api/errors';
import { TOKEN_STORAGE_KEY } from '@/data/api/client';
import { authProvider, usersProvider } from '@/data/providers';
import { AuthProvider, useAuth } from './auth-provider';
import { AUTH_EXPIRED_EVENT } from './query-provider';

const tokenStore: Record<string, string> = {};
const fakeStorage = {
  getItem: (key: string) => tokenStore[key] ?? null,
  setItem: (key: string, value: string) => {
    tokenStore[key] = value;
  },
  removeItem: (key: string) => {
    delete tokenStore[key];
  },
  clear: () => {
    for (const k of Object.keys(tokenStore)) delete tokenStore[k];
  },
  key: () => null,
  get length() {
    return Object.keys(tokenStore).length;
  },
} as unknown as Storage;

beforeEach(() => {
  for (const k of Object.keys(tokenStore)) delete tokenStore[k];
  vi.stubGlobal('localStorage', fakeStorage);
  Object.defineProperty(window, 'localStorage', { configurable: true, value: fakeStorage });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  replace.mockReset();
});

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }
  return Wrapper;
}

const sampleUser = {
  id: 'u1',
  email: 'a@b.c',
  displayName: 'Ana',
  reputationScore: 0,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('AuthProvider', () => {
  it('starts unauthenticated when no token in storage', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('unauthenticated'));
    expect(result.current.user).toBeNull();
    expect(usersProvider.me).not.toHaveBeenCalled();
  });

  it('boots authenticated when token + me() succeeds', async () => {
    tokenStore[TOKEN_STORAGE_KEY] = 'abc.def.ghi';
    vi.mocked(usersProvider.me).mockResolvedValue(sampleUser);
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('authenticated'));
    expect(result.current.user).toEqual(sampleUser);
  });

  it('clears token and goes unauthenticated when token + me() returns 401', async () => {
    tokenStore[TOKEN_STORAGE_KEY] = 'expired.token';
    vi.mocked(usersProvider.me).mockRejectedValue(
      new ApiError({ status: 401, code: 'auth_required', message: 'expired' }),
    );
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('unauthenticated'));
    expect(tokenStore[TOKEN_STORAGE_KEY]).toBeUndefined();
  });

  it('login() stores token, fetches user, and sets authenticated', async () => {
    vi.mocked(authProvider.login).mockResolvedValue({ accessToken: 'tok', expiresAt: '2026-12-31T00:00:00Z' });
    vi.mocked(usersProvider.me).mockResolvedValue(sampleUser);

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('unauthenticated'));

    await act(async () => {
      await result.current.login({ email: 'a@b.c', password: 'pw12345!' });
    });

    expect(tokenStore[TOKEN_STORAGE_KEY]).toBe('tok');
    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(sampleUser);
  });

  it('register() chains into login()', async () => {
    vi.mocked(authProvider.register).mockResolvedValue(sampleUser);
    vi.mocked(authProvider.login).mockResolvedValue({ accessToken: 'tok', expiresAt: '2026-12-31T00:00:00Z' });
    vi.mocked(usersProvider.me).mockResolvedValue(sampleUser);

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('unauthenticated'));

    await act(async () => {
      await result.current.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    });

    expect(authProvider.register).toHaveBeenCalledOnce();
    expect(authProvider.login).toHaveBeenCalledWith({ email: 'a@b.c', password: 'pw12345!' });
    expect(result.current.status).toBe('authenticated');
  });

  it('logout() clears token, navigates to /login, and resets state', async () => {
    tokenStore[TOKEN_STORAGE_KEY] = 'tok';
    vi.mocked(usersProvider.me).mockResolvedValue(sampleUser);
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('authenticated'));

    act(() => result.current.logout());

    expect(tokenStore[TOKEN_STORAGE_KEY]).toBeUndefined();
    expect(replace).toHaveBeenCalledWith('/login');
    expect(result.current.status).toBe('unauthenticated');
  });

  it('reacts to auth:expired window event by logging out', async () => {
    tokenStore[TOKEN_STORAGE_KEY] = 'tok';
    vi.mocked(usersProvider.me).mockResolvedValue(sampleUser);
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.status).toBe('authenticated'));

    act(() => {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    });

    await waitFor(() => expect(result.current.status).toBe('unauthenticated'));
    expect(tokenStore[TOKEN_STORAGE_KEY]).toBeUndefined();
  });
});
