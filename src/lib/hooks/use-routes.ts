'use client';
import { useQuery } from '@tanstack/react-query';
import { routesProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { RouteSummaryDto } from '@/data/contracts/routes';

const EMPTY: RouteSummaryDto[] = [];

export function useRoutes() {
  const query = useQuery({
    queryKey: qk.routes.list(),
    queryFn: () => routesProvider.listRoutes(),
  });
  return {
    routes: query.data ?? EMPTY,
    loading: query.isLoading,
    error: query.error,
  };
}

export function useRoute(routeId: string) {
  const query = useQuery({
    queryKey: qk.routes.byId(routeId),
    queryFn: () => routesProvider.getRoute(routeId),
    enabled: routeId.length > 0,
  });
  return {
    route: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
  };
}
