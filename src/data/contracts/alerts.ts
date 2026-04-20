import type { Alert } from '@/types/transit';

export interface AlertsProvider {
  getAlerts(): Promise<Alert[]>;
  getAlertsForRoutes(routes: string[]): Promise<Alert[]>;
}
