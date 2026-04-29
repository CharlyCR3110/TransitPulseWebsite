import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { authProvider } from './auth-provider';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api authProvider', () => {
  it('register POSTs to /auth/register with auth: none', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({});
    await authProvider.register({ email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' });
    expect(spy).toHaveBeenCalledWith('POST', '/auth/register', {
      auth: 'none',
      body: { email: 'a@b.c', password: 'pw12345!', displayName: 'Ana' },
    });
  });

  it('login POSTs to /auth/login with auth: none', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({});
    await authProvider.login({ email: 'a@b.c', password: 'pw12345!' });
    expect(spy).toHaveBeenCalledWith('POST', '/auth/login', {
      auth: 'none',
      body: { email: 'a@b.c', password: 'pw12345!' },
    });
  });
});
