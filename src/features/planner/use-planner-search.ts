'use client';
import { useState, useEffect, useCallback } from 'react';
import { mockPlannerProvider } from '@/data/providers/mock';
import type { SortMode } from '@/data/contracts/planner';
import type { TripOption } from '@/types/transit';

export function usePlannerSearch(from: string, to: string, sort: SortMode) {
  const [results, setResults] = useState<TripOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockPlannerProvider.searchTrips({ from, to, sort });
      setResults(data);
    } catch {
      setError('Failed to load trip options');
    } finally {
      setLoading(false);
    }
  }, [from, to, sort]);

  useEffect(() => { search(); }, [search]);

  return { results, loading, error, refresh: search };
}
