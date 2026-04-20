'use client';
import { useState, useEffect } from 'react';
import { mockPlannerProvider } from '@/data/providers/mock';
import { mockAlertsProvider } from '@/data/providers/mock';
import type { TripDetailDto } from '@/data/contracts/planner';
import type { Alert, BusStep } from '@/types/transit';

export function useTripDetail(tripId: string) {
  const [trip, setTrip] = useState<TripDetailDto | null>(null);
  const [relatedAlerts, setRelatedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    mockPlannerProvider.getTripDetail(tripId).then(async (detail) => {
      if (cancelled) return;
      setTrip(detail);
      if (detail) {
        const routes = detail.steps
          .filter((s): s is BusStep => s.kind === 'bus')
          .map((s) => s.route);
        const alerts = await mockAlertsProvider.getAlertsForRoutes(routes);
        if (!cancelled) setRelatedAlerts(alerts.slice(0, 2));
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) { setError('Failed to load trip'); setLoading(false); }
    });

    return () => { cancelled = true; };
  }, [tripId]);

  return { trip, relatedAlerts, loading, error };
}
