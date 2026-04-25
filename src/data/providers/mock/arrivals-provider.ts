import { INITIAL_ARRIVALS } from '@/data/transit';
import type { Arrival } from '@/types/transit';
import type { ArrivalsProvider } from '@/data/contracts/arrivals';

export const mockArrivalsProvider: ArrivalsProvider = {
  async getHomeArrivals(): Promise<Arrival[]> {
    return INITIAL_ARRIVALS;
  },

  async getArrivalsForStop(stopId: string): Promise<Arrival[]> {
    void stopId;
    return INITIAL_ARRIVALS;
  },
};
