'use client';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { plannerProvider, alertsProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { Alert, BusStep } from '@/types/transit';

const EMPTY_ALERTS: Alert[] = [];

export function useTripDetail(tripId: string, departureAt?: string) {
  const tripQuery = useQuery({
    queryKey: qk.planner.trip(tripId, departureAt),
    queryFn: () => plannerProvider.getTripDetail(tripId, departureAt),
    enabled: tripId.length > 0,
  });

  const routes = useMemo(() => {
    const detail = tripQuery.data;
    if (!detail) return [] as string[];
    return detail.steps
      .filter((s): s is BusStep => s.kind === 'bus')
      .map((s) => s.route);
  }, [tripQuery.data]);

  const alertsQuery = useQuery({
    queryKey: qk.alerts.byRoutes(routes),
    queryFn: () => alertsProvider.getAlertsForRoutes(routes),
    enabled: routes.length > 0,
  });

  const trip = tripQuery.data ?? null;
  const error = tripQuery.error
    ? 'load-failed'
    : !tripQuery.isLoading && trip === null
      ? 'not-found'
      : null;

  return {
    trip,
    relatedAlerts: (alertsQuery.data ?? EMPTY_ALERTS).slice(0, 2),
    loading: tripQuery.isLoading,
    error,
  };
}
