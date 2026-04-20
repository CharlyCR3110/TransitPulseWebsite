import type { TripOption, TripStep } from '@/types/transit';

export type SortMode = 'fastest' | 'cheapest' | 'fewest';

export interface PlannerSearchInput {
  from: string;
  to: string;
  sort: SortMode;
}

export interface TripDetailDto {
  id: string;
  minutes: number;
  price: number;
  transfers: number;
  walkMin: number;
  leaveIn: number;
  confidence: number;
  occupancy: number;
  steps: TripStep[];
}

export interface ActiveTripDto {
  tripId: string;
  currentStepIndex: number;
  steps: TripStep[];
  etaMinutes: number;
  started: number;
}

export interface PlannerProvider {
  searchTrips(input: PlannerSearchInput): Promise<TripOption[]>;
  getTripDetail(tripId: string): Promise<TripDetailDto | null>;
  startTrip(tripId: string): Promise<ActiveTripDto>;
  advanceStep(tripId: string, currentIndex: number): Promise<ActiveTripDto>;
}
