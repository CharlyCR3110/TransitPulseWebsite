export interface RouteSummaryDto {
  id: string;
  /** Operator-facing short name, e.g. "400 Pista". */
  code: string;
  nameEs: string;
  nameEn: string;
  operator: string | null;
  color: string;
  /** Minimum fare in CRC. */
  fareCrc: number;
}

export interface RouteStopDto {
  stopId: string;
  sequence: number;
  /** Cumulative scheduled minutes from origin departure. */
  scheduledOffsetMin: number;
  nameEs: string;
  nameEn: string;
  lat: number;
  lng: number;
}

export interface RouteShapeDto {
  type: 'LineString';
  /** [lng, lat] pairs. */
  coordinates: [number, number][];
}

export interface RouteDirectionDto {
  stops: RouteStopDto[];
  shape: RouteShapeDto | null;
}

export interface RouteScheduleDto {
  direction: string;
  serviceDay: 'weekday' | 'saturday' | 'sunday_holiday';
  mode: 'headway' | 'explicit';
  headwayMin: number | null;
  startTime: string;
  endTime: string;
  explicitTimes: string[] | null;
  notes: string | null;
}

export interface RouteDetailDto extends RouteSummaryDto {
  directions: Record<string, RouteDirectionDto>;
  schedules: RouteScheduleDto[];
}

export interface RoutesProvider {
  listRoutes(): Promise<RouteSummaryDto[]>;
  getRoute(routeId: string): Promise<RouteDetailDto | null>;
}
