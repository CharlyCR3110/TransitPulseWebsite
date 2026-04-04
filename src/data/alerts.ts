import type { Alert } from '@/types/alerts';

const now = new Date();
const hoursAgo = (n: number) => new Date(now.getTime() - n * 3_600_000);
const hoursLater = (n: number) => new Date(now.getTime() + n * 3_600_000);

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Desvío en Av. Central por obras',
    body: 'Las rutas 106 y 200 operan con desvío por Av. 4 debido a trabajos de mantenimiento en Av. Central. Se esperan demoras de 8–15 minutos.',
    severity: 'warning',
    affectedRouteIds: ['route-106', 'route-200'],
    affectedStopIds: ['stop-sjc', 'stop-sabana'],
    startAt: hoursAgo(2),
    endAt: hoursLater(4),
    isActive: true,
  },
  {
    id: 'alert-2',
    title: 'Suspensión parcial del tren a Cartago',
    body: 'El servicio INCOFER Cartago opera solo hasta Curridabat hasta nuevo aviso por revisión técnica en la línea. Use la ruta 410 como alternativa.',
    severity: 'critical',
    affectedRouteIds: ['route-train-ca'],
    affectedStopIds: ['stop-cartago', 'stop-curridabat'],
    startAt: hoursAgo(1),
    endAt: null,
    isActive: true,
  },
  {
    id: 'alert-3',
    title: 'Ocupación alta prevista esta tarde',
    body: 'Se espera alta demanda en las rutas de Heredia entre 4 pm y 7 pm por cierre de escuelas. Se recomienda salir antes de las 3:30 pm.',
    severity: 'info',
    affectedRouteIds: ['route-200', 'route-train-pa'],
    affectedStopIds: ['stop-heredia', 'stop-tibas'],
    startAt: hoursLater(1),
    endAt: hoursLater(5),
    isActive: false,
  },
  {
    id: 'alert-4',
    title: 'Manifestación en Paso Ancho afecta ruta 310',
    body: 'La ruta 310 opera con desvío desde las 10 am por manifestación en Paso Ancho. Tiempo adicional estimado: 20 minutos.',
    severity: 'warning',
    affectedRouteIds: ['route-310'],
    affectedStopIds: ['stop-hatillo', 'stop-desamparados'],
    startAt: hoursAgo(3),
    endAt: hoursLater(2),
    isActive: true,
  },
  {
    id: 'alert-5',
    title: 'Mantenimiento programado línea Alajuela – domingo',
    body: 'El domingo de 6 am a 2 pm no habrá servicio INCOFER entre Heredia y Alajuela por mantenimiento de vía. Se habilita autobús sustituto.',
    severity: 'info',
    affectedRouteIds: ['route-train-pa'],
    affectedStopIds: ['stop-alajuela', 'stop-heredia'],
    startAt: hoursLater(48),
    endAt: hoursLater(56),
    isActive: false,
  },
];

export function getActiveAlerts(): Alert[] {
  return alerts.filter((a) => a.isActive);
}

export function getAlertsByRoute(routeId: string): Alert[] {
  return alerts.filter((a) => a.affectedRouteIds.includes(routeId));
}

export function getAlert(id: string): Alert | undefined {
  return alerts.find((a) => a.id === id);
}
