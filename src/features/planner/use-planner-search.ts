'use client';
import { useQuery } from '@tanstack/react-query';
import { plannerProvider } from '@/data/providers';
import { qk } from '@/data/api/queryKeys';
import type { SortMode } from '@/data/contracts/planner';
import type { TripOption } from '@/types/transit';

const EMPTY: TripOption[] = [];

export function usePlannerSearch(from: string, to: string, sort: SortMode) {
  const input = { from, to, sort };
  const query = useQuery({
    queryKey: qk.planner.search(input),
    queryFn: () => plannerProvider.searchTrips(input),
    enabled: from.length > 0 && to.length > 0,
  });

  return {
    results: query.data ?? EMPTY,
    loading: query.isFetching,
    error: query.error ? 'Failed to load trip options' : null,
    refresh: () => query.refetch(),
  };
}
