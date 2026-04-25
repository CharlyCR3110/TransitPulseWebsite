import { NEARBY_STOPS } from '@/data/transit';
import type { StopsProvider, StopDetailDto } from '@/data/contracts/stops';
import type { Stop } from '@/types/transit';
import { mockArrivalsProvider } from './arrivals-provider';

export const mockStopsProvider: StopsProvider = {
  async getStop(stopId: string): Promise<StopDetailDto | null> {
    const stop = NEARBY_STOPS.find((s) => s.id === stopId);
    if (!stop) return null;

    return {
      stop,
      arrivals: await mockArrivalsProvider.getArrivalsForStop(stopId),
      updatedAt: Date.now(),
    };
  },

  async getAllStops(): Promise<Stop[]> {
    return NEARBY_STOPS;
  },
};
