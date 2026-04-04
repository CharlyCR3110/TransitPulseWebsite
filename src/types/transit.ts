export type TransportMode = 'bus' | 'train' | 'walk';

export type OccupancyLevel = 'low' | 'medium' | 'high' | 'packed';

export type ArrivalStatus = 'on-time' | 'delayed' | 'disrupted' | 'unknown';

export type ReliabilityLevel = 'high' | 'medium' | 'low';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Stop {
  id: string;
  name: string;
  coords: Coordinates;
  routeIds: string[];
}

export interface Route {
  id: string;
  shortName: string;
  longName: string;
  mode: TransportMode;
  color: string;
  fareMin: number;
  fareMax: number;
}

export interface Arrival {
  id: string;
  routeId: string;
  stopId: string;
  destination: string;
  predictedAt: Date;
  scheduledAt: Date;
  status: ArrivalStatus;
  occupancy: OccupancyLevel;
  confidence: ReliabilityLevel;
  updatedAt: Date;
}

export interface TripLeg {
  id: string;
  from: Stop;
  to: Stop;
  route: Route | null; // null for walk legs
  departAt: Date;
  arriveAt: Date;
  mode: TransportMode;
  stops: Stop[];
  walkMinutes?: number;
}

export interface Trip {
  id: string;
  legs: TripLeg[];
  totalDurationMinutes: number;
  totalFare: number;
  transfers: number;
  reliability: ReliabilityLevel;
  worstOccupancy: OccupancyLevel;
  updatedAt: Date;
}
