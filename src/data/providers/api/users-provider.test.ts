import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { usersProvider } from './users-provider';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api usersProvider', () => {
  it('me GETs /users/me with auth: required', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({});
    await usersProvider.me();
    expect(spy).toHaveBeenCalledWith('GET', '/users/me', { auth: 'required' });
  });

  it('stats GETs /users/me/stats with auth: required', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({ trips: 0 });
    const result = await usersProvider.stats();
    expect(spy).toHaveBeenCalledWith('GET', '/users/me/stats', { auth: 'required' });
    expect(result).toEqual({ trips: 0 });
  });
});
