export type Lang = 'es' | 'en';
export type Theme = 'light' | 'dark';
export type ArrivalStatus = 'on-time' | 'delayed' | 'disrupted' | 'unknown' | 'ok' | 'warn' | 'bad';
export type AlertSeverity = 'bad' | 'warn' | 'ok';

export interface Arrival {
  id: string;
  route: string;
  kind: 'bus' | 'train';
  destEs: string;
  destEn: string;
  etaSec: number;
  status: ArrivalStatus;
  occupancy: number;
  note_es?: string;
  note_en?: string;
}

export interface Stop {
  id: string;
  nameKey: string;
  addrKey: string;
  dist: number;
  live: boolean;
  routes: string[];
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  titleKey: string;
  bodyKey: string;
  time: string;
  routes: string[];
}

export type StepKind = 'walk' | 'bus' | 'transfer';

export interface WalkStep {
  kind: 'walk';
  minutes: number;
  toEs: string;
  toEn: string;
  time: string;
}

export interface BusStep {
  kind: 'bus';
  route: string;
  minutes: number;
  fromEs: string;
  fromEn: string;
  toEs: string;
  toEn: string;
  time: string;
  occ: number;
  stops: number;
}

export interface TransferStep {
  kind: 'transfer';
  minutes: number;
  toEs: string;
  toEn: string;
  time: string;
}

export type TripStep = WalkStep | BusStep | TransferStep;

export interface TripOption {
  id: string;
  tag: string;
  minutes: number;
  price: number;
  transfers: number;
  walkMin: number;
  leaveIn: number;
  confidence: number;
  occupancy: number;
  steps: TripStep[];
}

export type Screen =
  | { screen: 'home' }
  | { screen: 'planner' }
  | { screen: 'tripDetail'; tripId: string }
  | { screen: 'alerts' }
  | { screen: 'stop'; stopId: string }
  | { screen: 'profile' };

// ─── Legacy types used by old route-based pages ───────────────────────────────

export type TransportMode = 'bus' | 'train' | 'walk';
export type OccupancyLevel = 'low' | 'medium' | 'high' | 'packed';
// LegacyArrivalStatus is merged into ArrivalStatus above
export type Reliability = 'high' | 'medium' | 'low';

export interface LegacyStop {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
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

export interface Leg {
  id: string;
  from: LegacyStop;
  to: LegacyStop;
  route: Route | null;
  departAt: Date;
  arriveAt: Date;
  mode: TransportMode;
  stops: LegacyStop[];
  walkMinutes?: number;
  occupancy?: OccupancyLevel;
}

export interface Trip {
  id: string;
  legs: Leg[];
  totalDurationMinutes: number;
  totalFare: number;
  transfers: number;
  reliability: Reliability;
  worstOccupancy: OccupancyLevel;
  updatedAt: Date;
}
