'use client';
import { useState, useEffect, useCallback } from 'react';
import { plannerProvider } from '@/data/providers';
import type { ActiveTripDto } from '@/data/contracts/planner';

export function useActiveTrip(tripId: string) {
  const [activeTrip, setActiveTrip] = useState<ActiveTripDto | null>(null);
  const [loading, setLoading] = useState(Boolean(tripId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    void plannerProvider.startTrip(tripId).then((data) => {
      if (!data) {
        setError('not-found');
        setLoading(false);
        return;
      }
      setActiveTrip(data);
      setLoading(false);
    }).catch(() => {
      setError('load-failed');
      setLoading(false);
    });
  }, [tripId]);

  const advance = useCallback(async () => {
    if (!activeTrip) return;
    const updated = await plannerProvider.advanceStep(activeTrip.tripId, activeTrip.currentStepIndex);
    if (!updated) {
      setError('not-found');
      return;
    }
    setActiveTrip(updated);
  }, [activeTrip]);

  return { activeTrip, loading, error, advance };
}
