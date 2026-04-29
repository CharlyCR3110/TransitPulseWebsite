import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { ApiError } from '@/data/api/errors';
import { plannerProvider } from './planner-provider';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api plannerProvider', () => {
  it('searchTrips passes from/to/sort as query params', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue([]);
    await plannerProvider.searchTrips({ from: 'A', to: 'B', sort: 'fastest' });
    expect(spy).toHaveBeenCalledWith('GET', '/planner/search', {
      query: { from: 'A', to: 'B', sort: 'fastest' },
    });
  });

  it('getTripDetail URL-encodes the id', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue({});
    await plannerProvider.getTripDetail('trip 1/x');
    expect(spy).toHaveBeenCalledWith('GET', '/planner/trips/trip%201%2Fx');
  });

  it('getTripDetail maps not_found to null', async () => {
    vi.spyOn(apiClient, 'request').mockRejectedValue(
      new ApiError({ status: 404, code: 'not_found', message: 'gone' }),
    );
    const result = await plannerProvider.getTripDetail('nope');
    expect(result).toBeNull();
  });

  it('getTripDetail rethrows non-404 errors', async () => {
    const err = new ApiError({ status: 500, code: 'internal_error', message: 'boom' });
    vi.spyOn(apiClient, 'request').mockRejectedValue(err);
    await expect(plannerProvider.getTripDetail('x')).rejects.toBe(err);
  });

  it('startTrip and advanceStep still throw not-implemented (Step 7)', () => {
    expect(() => plannerProvider.startTrip('t1')).toThrow(/not implemented yet/);
    expect(() => plannerProvider.advanceStep('t1', 0)).toThrow(/not implemented yet/);
  });
});
