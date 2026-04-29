'use client';
import { useState, useEffect } from 'react';
import { arrivalsProvider } from '@/data/providers';
import type { Arrival } from '@/types/transit';

export function useArrivals() {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void arrivalsProvider.getHomeArrivals().then((data) => {
      if (cancelled) return;
      setArrivals(data);
      setLoading(false);
    });

    const iv = setInterval(() => {
      setArrivals((prev) =>
        prev.map((a) => ({ ...a, etaSec: a.etaSec > 0 ? Math.max(0, a.etaSec - 1) : 1800 }))
      );
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, []);

  return { arrivals, loading };
}
