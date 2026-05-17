import type { TripOption, TripStep } from '@/types/transit';

export type SortMode = 'fastest' | 'cheapest' | 'fewest';

export interface PlannerSearchInput {
  from: string;
  to: string;
  sort: SortMode;
  departureAt?: string;
}

export interface TripDetailDto {
  id: string;
  departureAt?: string | null;
  arrivalAt?: string | null;
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
  /** Backend-assigned id for this in-progress trip; required for advanceStep. */
  activeTripId: string;
  departureAt?: string | null;
  arrivalAt?: string | null;
  currentStepIndex: number;
  steps: TripStep[];
  etaMinutes: number;
  started: number;
}

export interface PlannerProvider {
  searchTrips(input: PlannerSearchInput): Promise<TripOption[]>;
  getTripDetail(tripId: string, departureAt?: string): Promise<TripDetailDto | null>;
  startTrip(tripId: string): Promise<ActiveTripDto | null>;
  advanceStep(tripId: string, activeTripId: string, currentIndex: number): Promise<ActiveTripDto | null>;
}
