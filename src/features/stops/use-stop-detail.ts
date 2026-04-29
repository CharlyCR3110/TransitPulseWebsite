'use client';
import { useQuery } from '@tanstack/react-query';
import { stopsProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';

export function useStopDetail(stopId: string) {
  const query = useQuery({
    queryKey: qk.stops.byId(stopId),
    queryFn: () => stopsProvider.getStop(stopId),
    enabled: stopId.length > 0,
  });

  return {
    detail: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? 'Failed to load stop' : null,
    refresh: () => query.refetch(),
  };
}
