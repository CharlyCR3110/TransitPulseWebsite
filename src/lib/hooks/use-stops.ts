'use client';
import { useEffect, useState } from 'react';
import { stopsProvider } from '@/data/providers';
import type { Stop } from '@/types/transit';

export function useStops() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void stopsProvider.getAllStops().then((data) => {
      if (cancelled) return;
      setStops(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { stops, loading };
}
