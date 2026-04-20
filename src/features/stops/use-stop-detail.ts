'use client';
import { useState, useEffect, useCallback } from 'react';
import { mockStopsProvider } from '@/data/providers/mock';
import type { StopDetailDto } from '@/data/contracts/stops';

export function useStopDetail(stopId: string) {
  const [detail, setDetail] = useState<StopDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockStopsProvider.getStop(stopId);
      setDetail(data);
    } catch {
      setError('Failed to load stop');
    } finally {
      setLoading(false);
    }
  }, [stopId]);

  useEffect(() => { load(); }, [load]);

  return { detail, loading, error, refresh: load };
}
