'use client';
import { useState, useEffect, useCallback } from 'react';
import { mockPlannerProvider } from '@/data/providers/mock';
import type { ActiveTripDto } from '@/data/contracts/planner';

export function useActiveTrip(tripId: string) {
  const [activeTrip, setActiveTrip] = useState<ActiveTripDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    mockPlannerProvider.startTrip(tripId).then((data) => {
      setActiveTrip(data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to start trip');
      setLoading(false);
    });
  }, [tripId]);

  const advance = useCallback(async () => {
    if (!activeTrip) return;
    const updated = await mockPlannerProvider.advanceStep(activeTrip.tripId, activeTrip.currentStepIndex);
    setActiveTrip(updated);
  }, [activeTrip]);

  return { activeTrip, loading, error, advance };
}
