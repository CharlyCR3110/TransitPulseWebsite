export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  title: string;
  body: string;
  severity: AlertSeverity;
  affectedRouteIds: string[];
  affectedStopIds: string[];
  startAt: Date;
  endAt: Date | null;
  isActive: boolean;
}
