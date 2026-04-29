'use client';
import { useQuery } from '@tanstack/react-query';
import { stopsProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { Stop } from '@/types/transit';

const EMPTY: Stop[] = [];

export function useStops() {
  const query = useQuery({
    queryKey: qk.stops.list(),
    queryFn: () => stopsProvider.getAllStops(),
  });
  return {
    stops: query.data ?? EMPTY,
    loading: query.isLoading,
    error: query.error,
  };
}
