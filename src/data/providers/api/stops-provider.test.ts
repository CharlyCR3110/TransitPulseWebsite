import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { ApiError } from '@/data/api/errors';
import { stopsProvider } from './stops-provider';
import type { Stop } from '@/types/transit';
import type { StopDetailDto } from '@/data/contracts/stops';

afterEach(() => {
  vi.restoreAllMocks();
});

const stops: Stop[] = [
  { id: 's1', nameKey: 'stop_1', addrKey: 'a1', dist: 100, live: true, routes: ['100'] },
];
const detail: StopDetailDto = {
  stop: stops[0],
  arrivals: [],
  updatedAt: 1714300000,
};

describe('api stopsProvider', () => {
  it('getAllStops calls GET /stops', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(stops);
    const result = await stopsProvider.getAllStops();
    expect(spy).toHaveBeenCalledWith('GET', '/stops');
    expect(result).toBe(stops);
  });

  it('getStop URL-encodes the id and returns the detail', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(detail);
    const result = await stopsProvider.getStop('s/1 weird');
    expect(spy).toHaveBeenCalledWith('GET', '/stops/s%2F1%20weird');
    expect(result).toBe(detail);
  });

  it('getStop maps not_found ApiError to null', async () => {
    vi.spyOn(apiClient, 'request').mockRejectedValue(
      new ApiError({ status: 404, code: 'not_found', message: 'gone' }),
    );
    const result = await stopsProvider.getStop('missing');
    expect(result).toBeNull();
  });

  it('getStop rethrows non-404 ApiError', async () => {
    const err = new ApiError({ status: 500, code: 'internal_error', message: 'boom' });
    vi.spyOn(apiClient, 'request').mockRejectedValue(err);
    await expect(stopsProvider.getStop('x')).rejects.toBe(err);
  });
});
