import { trips as _trips, getTrip as _getTrip } from '@/data/trips';
import type { Trip } from '@/types/transit';

export async function getTrip(id: string): Promise<Trip | null> {
  // Future: const res = await fetch(`/api/trips/${id}`); return res.ok ? res.json() : null;
  return _getTrip(id) ?? null;
}

export async function searchTrips(origin: string, destination: string): Promise<Trip[]> {
  // Future: const res = await fetch(`/api/routes/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  //         return res.json();
  void origin; void destination;
  return _trips;
}
