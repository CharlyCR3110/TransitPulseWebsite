'use client';
import { useState, useEffect } from 'react';
import { alertsProvider } from '@/data/providers';
import type { Alert } from '@/types/transit';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertsProvider.getAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  return {
    alerts,
    loading,
    alertsCount: alerts.filter((a) => a.severity !== 'ok').length,
  };
}
