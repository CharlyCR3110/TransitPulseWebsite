interface LegacyArrival {
  id: string;
  routeId: string;
  stopId: string;
  destination: string;
  predictedAt: Date;
  scheduledAt: Date;
  status: 'on-time' | 'delayed' | 'disrupted' | 'unknown';
  occupancy: 'low' | 'medium' | 'high' | 'packed';
  confidence: 'high' | 'medium' | 'low';
  updatedAt: Date;
}

const now = new Date();
const mins = (n: number) => new Date(now.getTime() + n * 60_000);

export const arrivals: LegacyArrival[] = [
  {
    id: 'arr-1',
    routeId: 'route-106',
    stopId: 'stop-sjc',
    destination: 'Hatillo Centro',
    predictedAt: mins(4),
    scheduledAt: mins(5),
    status: 'on-time',
    occupancy: 'medium',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 12_000),
  },
  {
    id: 'arr-2',
    routeId: 'route-train-ca',
    stopId: 'stop-sjc',
    destination: 'Cartago Terminal',
    predictedAt: mins(7),
    scheduledAt: mins(7),
    status: 'on-time',
    occupancy: 'low',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 8_000),
  },
  {
    id: 'arr-3',
    routeId: 'route-200',
    stopId: 'stop-sjc',
    destination: 'Heredia Terminal',
    predictedAt: mins(12),
    scheduledAt: mins(10),
    status: 'delayed',
    occupancy: 'high',
    confidence: 'medium',
    updatedAt: new Date(now.getTime() - 30_000),
  },
  {
    id: 'arr-4',
    routeId: 'route-train-pa',
    stopId: 'stop-sjc',
    destination: 'Alajuela Central',
    predictedAt: mins(15),
    scheduledAt: mins(15),
    status: 'on-time',
    occupancy: 'medium',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 5_000),
  },
  {
    id: 'arr-5',
    routeId: 'route-310',
    stopId: 'stop-hatillo',
    destination: 'Aserrí',
    predictedAt: mins(3),
    scheduledAt: mins(3),
    status: 'on-time',
    occupancy: 'low',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 10_000),
  },
  {
    id: 'arr-6',
    routeId: 'route-106',
    stopId: 'stop-hatillo',
    destination: 'San José Central',
    predictedAt: mins(8),
    scheduledAt: mins(6),
    status: 'delayed',
    occupancy: 'packed',
    confidence: 'medium',
    updatedAt: new Date(now.getTime() - 45_000),
  },
  {
    id: 'arr-7',
    routeId: 'route-train-ca',
    stopId: 'stop-cartago',
    destination: 'San José Central',
    predictedAt: mins(2),
    scheduledAt: mins(2),
    status: 'on-time',
    occupancy: 'low',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 7_000),
  },
  {
    id: 'arr-8',
    routeId: 'route-410',
    stopId: 'stop-cartago',
    destination: 'Curridabat',
    predictedAt: mins(18),
    scheduledAt: mins(20),
    status: 'on-time',
    occupancy: 'medium',
    confidence: 'medium',
    updatedAt: new Date(now.getTime() - 60_000),
  },
  {
    id: 'arr-9',
    routeId: 'route-train-pa',
    stopId: 'stop-alajuela',
    destination: 'San José Central',
    predictedAt: mins(5),
    scheduledAt: mins(5),
    status: 'on-time',
    occupancy: 'medium',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 9_000),
  },
  {
    id: 'arr-10',
    routeId: 'route-501',
    stopId: 'stop-pavas',
    destination: 'Sabana Norte',
    predictedAt: mins(6),
    scheduledAt: mins(5),
    status: 'delayed',
    occupancy: 'high',
    confidence: 'medium',
    updatedAt: new Date(now.getTime() - 25_000),
  },
  {
    id: 'arr-11',
    routeId: 'route-602',
    stopId: 'stop-tibas',
    destination: 'San José Central',
    predictedAt: mins(0),
    scheduledAt: mins(0),
    status: 'disrupted',
    occupancy: 'low',
    confidence: 'low',
    updatedAt: new Date(now.getTime() - 120_000),
  },
  {
    id: 'arr-12',
    routeId: 'route-200',
    stopId: 'stop-heredia',
    destination: 'San José Central',
    predictedAt: mins(9),
    scheduledAt: mins(9),
    status: 'on-time',
    occupancy: 'low',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 11_000),
  },
  {
    id: 'arr-13',
    routeId: 'route-106',
    stopId: 'stop-sabana',
    destination: 'Desamparados',
    predictedAt: mins(14),
    scheduledAt: mins(15),
    status: 'on-time',
    occupancy: 'medium',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 18_000),
  },
  {
    id: 'arr-14',
    routeId: 'route-train-pa',
    stopId: 'stop-heredia',
    destination: 'Alajuela Central',
    predictedAt: mins(11),
    scheduledAt: mins(10),
    status: 'delayed',
    occupancy: 'high',
    confidence: 'medium',
    updatedAt: new Date(now.getTime() - 35_000),
  },
  {
    id: 'arr-15',
    routeId: 'route-410',
    stopId: 'stop-curridabat',
    destination: 'San José Central',
    predictedAt: mins(4),
    scheduledAt: mins(4),
    status: 'on-time',
    occupancy: 'low',
    confidence: 'high',
    updatedAt: new Date(now.getTime() - 6_000),
  },
];

export function getArrivalsByStop(stopId: string): LegacyArrival[] {
  return arrivals
    .filter((a) => a.stopId === stopId)
    .sort((a, b) => a.predictedAt.getTime() - b.predictedAt.getTime());
}

export function getArrivalsByRoute(routeId: string): LegacyArrival[] {
  return arrivals.filter((a) => a.routeId === routeId);
}
