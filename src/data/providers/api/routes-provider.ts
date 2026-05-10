import { apiClient } from '@/data/api/client';
import { isNotFound } from '@/data/api/errors';
import type {
  RouteDetailDto,
  RouteSummaryDto,
  RoutesProvider,
} from '@/data/contracts/routes';

export const routesProvider: RoutesProvider = {
  listRoutes: () => apiClient.request<RouteSummaryDto[]>('GET', '/routes'),
  async getRoute(routeId) {
    try {
      return await apiClient.request<RouteDetailDto>(
        'GET',
        `/routes/${encodeURIComponent(routeId)}`,
      );
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },
};
