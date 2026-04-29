'use client';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { plannerProvider } from '@/data/providers';
import type { ActiveTripDto } from '@/data/contracts/planner';

type ErrorKind = 'not-found' | 'load-failed' | null;

export function useActiveTrip(tripId: string) {
  const [activeTrip, setActiveTrip] = useState<ActiveTripDto | null>(null);
  const [error, setError] = useState<ErrorKind>(null);

  const startMutation = useMutation({
    mutationFn: (id: string) => plannerProvider.startTrip(id),
    onSuccess: (data) => {
      if (!data) {
        setError('not-found');
        setActiveTrip(null);
        return;
      }
      setError(null);
      setActiveTrip(data);
    },
    onError: () => setError('load-failed'),
  });

  const advanceMutation = useMutation({
    mutationFn: ({ activeTripId, currentStepIndex }: { activeTripId: string; currentStepIndex: number }) =>
      plannerProvider.advanceStep(activeTripId, currentStepIndex),
    onSuccess: (data) => {
      if (!data) {
        setError('not-found');
        return;
      }
      setActiveTrip(data);
    },
    onError: () => setError('load-failed'),
  });

  useEffect(() => {
    if (!tripId) return;
    setActiveTrip(null);
    setError(null);
    startMutation.mutate(tripId);
    // intentionally only react to tripId — startMutation is stable per QueryClient
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const advance = useCallback(async () => {
    if (!activeTrip) return;
    await advanceMutation.mutateAsync({
      activeTripId: activeTrip.activeTripId,
      currentStepIndex: activeTrip.currentStepIndex,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip]);

  const loading = Boolean(tripId) && !activeTrip && !error;

  return { activeTrip, loading, error, advance };
}
