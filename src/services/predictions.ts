import { getArrivalsByStop, getArrivalsByRoute } from '@/data/arrivals';
import type { Arrival } from '@/types/transit';

interface PredictionsParams {
  stopId?: string;
  routeId?: string;
}

export async function getPredictions({ stopId, routeId }: PredictionsParams): Promise<Arrival[]> {
  // Future: const params = new URLSearchParams({ ...(stopId && { stopId }), ...(routeId && { routeId }) });
  //         const res = await fetch(`/api/predictions?${params}`); return res.json();
  if (stopId) return getArrivalsByStop(stopId);
  if (routeId) return getArrivalsByRoute(routeId);
  return [];
}
