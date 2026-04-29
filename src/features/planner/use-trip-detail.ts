'use client';
import { useState, useEffect } from 'react';
import { plannerProvider, alertsProvider } from '@/data/providers';
import type { TripDetailDto } from '@/data/contracts/planner';
import type { Alert, BusStep } from '@/types/transit';

export function useTripDetail(tripId: string) {
  const [trip, setTrip] = useState<TripDetailDto | null>(null);
  const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void plannerProvider.getTripDetail(tripId).then(async (detail) => {
      if (cancelled) return;
      if (!detail) {
        setError('not-found');
        setLoading(false);
        return;
      }
      setTrip(detail);
      const routes = detail.steps
        .filter((s): s is BusStep => s.kind === 'bus')
        .map((s) => s.route);
      const alerts = await alertsProvider.getAlertsForRoutes(routes);
      if (!cancelled) setRelatedAlerts(alerts.slice(0, 2));
      setLoading(false);
    }).catch(() => {
      if (!cancelled) { setError('load-failed'); setLoading(false); }
    });

    return () => { cancelled = true; };
  }, [tripId]);

  return { trip, relatedAlerts, loading, error };
}
