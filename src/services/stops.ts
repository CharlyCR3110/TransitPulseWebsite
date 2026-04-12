import { stops as _stops, getStop as _getStop } from '@/data/stops';
import type { Stop } from '@/types/transit';

export async function getStop(id: string): Promise<Stop | null> {
  // Future: const res = await fetch(`/api/stops/${id}`); return res.ok ? res.json() : null;
  return _getStop(id) ?? null;
}

export async function getStopsByIds(ids: string[]): Promise<Stop[]> {
  // Future: const res = await fetch(`/api/stops?ids=${ids.join(',')}`); return res.json();
  return _stops.filter((s) => ids.includes(s.id));
}

export async function getNearbyStops(lat: number, lng: number): Promise<Stop[]> {
  // Future: const res = await fetch(`/api/stops/nearby?lat=${lat}&lng=${lng}`); return res.json();
  // Mock: return a fixed set of stops regardless of coordinates
  void lat; void lng;
  const nearbyIds = ['stop-sjc', 'stop-hatillo', 'stop-sabana', 'stop-heredia', 'stop-tibas'];
  return _stops.filter((s) => nearbyIds.includes(s.id));
}
