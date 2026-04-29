'use client';
import { useQuery } from '@tanstack/react-query';
import { alertsProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { Alert } from '@/types/transit';

const EMPTY: Alert[] = [];

export function useAlerts() {
  const query = useQuery({
    queryKey: qk.alerts.all(),
    queryFn: () => alertsProvider.getAlerts(),
  });
  const alerts = query.data ?? EMPTY;

  return {
    alerts,
    loading: query.isLoading,
    error: query.error,
    alertsCount: alerts.filter((a) => a.severity !== 'ok').length,
  };
}
