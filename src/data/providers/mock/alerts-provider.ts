import { ALERTS } from '@/data/transit';
import type { AlertsProvider } from '@/data/contracts/alerts';
import type { Alert } from '@/types/transit';

export const mockAlertsProvider: AlertsProvider = {
  async getAlerts(): Promise<Alert[]> {
    return ALERTS;
  },

  async getAlertsForRoutes(routes: string[]): Promise<Alert[]> {
    const routeSet = new Set(routes);
    return ALERTS.filter((a) => a.routes.some((r) => routeSet.has(r)));
  },
};
