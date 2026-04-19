import { NEARBY_STOPS } from '@/data/transit';
import type { Stop } from '@/types/transit';

export function useStop(id: string): Stop {
  return NEARBY_STOPS.find((s) => s.id === id) ?? NEARBY_STOPS[0];
}
