'use client';
import { useState, useEffect } from 'react';
import { INITIAL_ARRIVALS } from '@/data/transit';
import type { Arrival } from '@/types/transit';

export function useArrivals(): Arrival[] {
  const [arrivals, setArrivals] = useState<Arrival[]>(INITIAL_ARRIVALS);

  useEffect(() => {
    const iv = setInterval(() => {
      setArrivals((prev) =>
        prev.map((a) => ({ ...a, etaSec: a.etaSec > 0 ? Math.max(0, a.etaSec - 1) : 1800 }))
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return arrivals;
}
