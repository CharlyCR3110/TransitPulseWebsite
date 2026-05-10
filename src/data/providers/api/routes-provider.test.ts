import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/data/api/client';
import { ApiError } from '@/data/api/errors';
import { routesProvider } from './routes-provider';
import type { RouteDetailDto, RouteSummaryDto } from '@/data/contracts/routes';

afterEach(() => {
  vi.restoreAllMocks();
});

const summaries: RouteSummaryDto[] = [
  { id: '400p', code: '400 Pista', nameEs: 'Heredia → SJ', nameEn: 'Heredia → SJ', operator: 'TU400', color: '#0a84ff', fareCrc: 750 },
];

const detail: RouteDetailDto = {
  ...summaries[0],
  directions: {
    outbound: {
      stops: [{ stopId: 's1', sequence: 1, scheduledOffsetMin: 0, nameEs: 'A', nameEn: 'A', lat: 9.99, lng: -84.11 }],
      shape: { type: 'LineString', coordinates: [[-84.11, 9.99]] },
    },
  },
  schedules: [],
};

describe('api routesProvider', () => {
  it('listRoutes calls GET /routes', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(summaries);
    const result = await routesProvider.listRoutes();
    expect(spy).toHaveBeenCalledWith('GET', '/routes');
    expect(result).toBe(summaries);
  });

  it('getRoute URL-encodes the id', async () => {
    const spy = vi.spyOn(apiClient, 'request').mockResolvedValue(detail);
    await routesProvider.getRoute('400 p');
    expect(spy).toHaveBeenCalledWith('GET', '/routes/400%20p');
  });

  it('getRoute maps not_found to null', async () => {
    vi.spyOn(apiClient, 'request').mockRejectedValue(
      new ApiError({ status: 404, code: 'not_found', message: 'gone' }),
    );
    const result = await routesProvider.getRoute('missing');
    expect(result).toBeNull();
  });

  it('getRoute rethrows non-404 errors', async () => {
    const err = new ApiError({ status: 500, code: 'internal_error', message: 'boom' });
    vi.spyOn(apiClient, 'request').mockRejectedValue(err);
    await expect(routesProvider.getRoute('x')).rejects.toBe(err);
  });
});
