import type { Trip } from '@/types/transit';
import { stops } from './stops';
import { routes } from './routes';

const now = new Date();
const mins = (n: number) => new Date(now.getTime() + n * 60_000);

const sjc = stops.find((s) => s.id === 'stop-sjc')!;
const cartago = stops.find((s) => s.id === 'stop-cartago')!;
const curridabat = stops.find((s) => s.id === 'stop-curridabat')!;
const hatillo = stops.find((s) => s.id === 'stop-hatillo')!;
const heredia = stops.find((s) => s.id === 'stop-heredia')!;
const alajuela = stops.find((s) => s.id === 'stop-alajuela')!;
const sabana = stops.find((s) => s.id === 'stop-sabana')!;
const tibas = stops.find((s) => s.id === 'stop-tibas')!;

const trainCa = routes.find((r) => r.id === 'route-train-ca')!;
const trainPa = routes.find((r) => r.id === 'route-train-pa')!;
const bus106 = routes.find((r) => r.id === 'route-106')!;
const bus200 = routes.find((r) => r.id === 'route-200')!;
const bus410 = routes.find((r) => r.id === 'route-410')!;

export const trips: Trip[] = [
  {
    id: 'trip-1',
    legs: [
      {
        id: 'leg-1a',
        from: sjc,
        to: cartago,
        route: trainCa,
        departAt: mins(7),
        arriveAt: mins(47),
        mode: 'train',
        stops: [sjc, curridabat, cartago],
      },
    ],
    totalDurationMinutes: 40,
    totalFare: 1260,
    transfers: 0,
    reliability: 'high',
    worstOccupancy: 'low',
    updatedAt: new Date(now.getTime() - 8_000),
  },
  {
    id: 'trip-2',
    legs: [
      {
        id: 'leg-2a',
        from: sjc,
        to: curridabat,
        route: bus410,
        departAt: mins(5),
        arriveAt: mins(35),
        mode: 'bus',
        stops: [sjc, curridabat],
      },
      {
        id: 'leg-2b',
        from: curridabat,
        to: cartago,
        route: null,
        departAt: mins(35),
        arriveAt: mins(40),
        mode: 'walk',
        stops: [],
        walkMinutes: 5,
      },
      {
        id: 'leg-2c',
        from: curridabat,
        to: cartago,
        route: trainCa,
        departAt: mins(42),
        arriveAt: mins(55),
        mode: 'train',
        stops: [curridabat, cartago],
      },
    ],
    totalDurationMinutes: 50,
    totalFare: 620 + 560,
    transfers: 1,
    reliability: 'medium',
    worstOccupancy: 'medium',
    updatedAt: new Date(now.getTime() - 15_000),
  },
  {
    id: 'trip-3',
    legs: [
      {
        id: 'leg-3a',
        from: sjc,
        to: hatillo,
        route: bus106,
        departAt: mins(4),
        arriveAt: mins(30),
        mode: 'bus',
        stops: [sjc, sabana, hatillo],
      },
    ],
    totalDurationMinutes: 26,
    totalFare: 490,
    transfers: 0,
    reliability: 'medium',
    worstOccupancy: 'high',
    updatedAt: new Date(now.getTime() - 30_000),
  },
  {
    id: 'trip-4',
    legs: [
      {
        id: 'leg-4a',
        from: sjc,
        to: heredia,
        route: bus200,
        departAt: mins(12),
        arriveAt: mins(40),
        mode: 'bus',
        stops: [sjc, tibas, heredia],
      },
    ],
    totalDurationMinutes: 28,
    totalFare: 610,
    transfers: 0,
    reliability: 'medium',
    worstOccupancy: 'high',
    updatedAt: new Date(now.getTime() - 30_000),
  },
  {
    id: 'trip-5',
    legs: [
      {
        id: 'leg-5a',
        from: sjc,
        to: heredia,
        route: trainPa,
        departAt: mins(15),
        arriveAt: mins(35),
        mode: 'train',
        stops: [sjc, heredia],
      },
      {
        id: 'leg-5b',
        from: heredia,
        to: alajuela,
        route: trainPa,
        departAt: mins(37),
        arriveAt: mins(57),
        mode: 'train',
        stops: [heredia, alajuela],
      },
    ],
    totalDurationMinutes: 42,
    totalFare: 1050,
    transfers: 0,
    reliability: 'high',
    worstOccupancy: 'medium',
    updatedAt: new Date(now.getTime() - 5_000),
  },
];

export function getTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}
