import { apiClient } from '@/data/api/client';
import type { AlertsProvider } from '@/data/contracts/alerts';
import type { Alert } from '@/types/transit';

export const alertsProvider: AlertsProvider = {
  getAlerts: () => apiClient.request<Alert[]>('GET', '/alerts'),
  getAlertsForRoutes: (routes) =>
    apiClient.request<Alert[]>('GET', '/alerts', {
      query: { routeIds: routes.join(',') },
    }),
};
