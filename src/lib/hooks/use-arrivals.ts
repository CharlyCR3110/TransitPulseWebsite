'use client';
import { useQuery } from '@tanstack/react-query';
import { arrivalsProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { Arrival } from '@/types/transit';

const EMPTY: Arrival[] = [];

export function useArrivals() {
  const query = useQuery({
    queryKey: qk.arrivals.home(),
    queryFn: () => arrivalsProvider.getHomeArrivals(),
    refetchInterval: 15_000,
  });
  return {
    arrivals: query.data ?? EMPTY,
    loading: query.isLoading,
    error: query.error,
  };
}
