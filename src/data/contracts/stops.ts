import type { Stop, Arrival } from '@/types/transit';

export interface StopDetailDto {
  stop: Stop;
  arrivals: Arrival[];
  updatedAt: number;
}

export interface StopsProvider {
  getStop(stopId: string): Promise<StopDetailDto | null>;
  getAllStops(): Promise<Stop[]>;
}
