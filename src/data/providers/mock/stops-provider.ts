import { NEARBY_STOPS, INITIAL_ARRIVALS } from '@/data/transit';
import type { StopsProvider, StopDetailDto } from '@/data/contracts/stops';
import type { Stop } from '@/types/transit';

export const mockStopsProvider: StopsProvider = {
  async getStop(stopId: string): Promise<StopDetailDto | null> {
    const stop = NEARBY_STOPS.find((s) => s.id === stopId) ?? NEARBY_STOPS[0];
    return {
      stop,
      arrivals: INITIAL_ARRIVALS,
      updatedAt: Date.now(),
    };
  },

  async getAllStops(): Promise<Stop[]> {
    return NEARBY_STOPS;
  },
};
