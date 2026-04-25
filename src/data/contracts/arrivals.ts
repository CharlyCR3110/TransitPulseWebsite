import type { Arrival } from '@/types/transit';

export interface ArrivalsProvider {
  getHomeArrivals(): Promise<Arrival[]>;
  getArrivalsForStop(stopId: string): Promise<Arrival[]>;
}
