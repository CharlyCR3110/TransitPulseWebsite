import type {
  RouteDetailDto,
  RouteSummaryDto,
  RoutesProvider,
} from '@/data/contracts/routes';

const SUMMARIES: RouteSummaryDto[] = [
  {
    id: '400p',
    code: '400 Pista',
    nameEs: 'Heredia → San José por Pista',
    nameEn: 'Heredia → San José via Highway',
    operator: 'Transportes Unidos La 400',
    color: '#0a84ff',
    fareCrc: 750,
  },
  {
    id: '400sd',
    code: '400 Sto. Domingo',
    nameEs: 'Heredia → San José por Santo Domingo',
    nameEn: 'Heredia → San José via Santo Domingo',
    operator: 'MRH',
    color: '#34c759',
    fareCrc: 720,
  },
];

const DETAIL_400P: RouteDetailDto = {
  ...SUMMARIES[0],
  directions: {
    outbound: {
      stops: [
        { stopId: 'her_term_mc', sequence: 1, scheduledOffsetMin: 0, nameEs: 'Terminal Mercado Central · Heredia', nameEn: 'Mercado Central Terminal · Heredia', lat: 9.998, lng: -84.117 },
        { stopId: 'her_estadio', sequence: 2, scheduledOffsetMin: 3, nameEs: 'Estadio Rosabal Cordero', nameEn: 'Rosabal Cordero Stadium', lat: 9.997, lng: -84.111 },
        { stopId: 'her_pricesmart', sequence: 3, scheduledOffsetMin: 8, nameEs: 'PriceSmart Heredia', nameEn: 'PriceSmart Heredia', lat: 9.987, lng: -84.105 },
      ],
      shape: {
        type: 'LineString',
        coordinates: [[-84.117, 9.998], [-84.111, 9.997], [-84.105, 9.987]],
      },
    },
  },
  schedules: [
    {
      direction: 'outbound',
      serviceDay: 'weekday',
      mode: 'headway',
      headwayMin: 12,
      startTime: '05:00',
      endTime: '22:00',
      explicitTimes: null,
      notes: 'Mock data',
    },
  ],
};

const DETAIL_400SD: RouteDetailDto = {
  ...SUMMARIES[1],
  directions: {
    outbound: {
      stops: [
        { stopId: 'sj_term_rh', sequence: 1, scheduledOffsetMin: 0, nameEs: 'Terminal Río Hondo', nameEn: 'Río Hondo Terminal', lat: 9.937, lng: -84.077 },
        { stopId: 'sj_tibas_cinco', sequence: 2, scheduledOffsetMin: 5, nameEs: 'Tibás · Cinco Esquinas', nameEn: 'Tibás · Cinco Esquinas', lat: 9.961, lng: -84.082 },
      ],
      shape: {
        type: 'LineString',
        coordinates: [[-84.077, 9.937], [-84.082, 9.961]],
      },
    },
  },
  schedules: [
    {
      direction: 'outbound',
      serviceDay: 'weekday',
      mode: 'headway',
      headwayMin: 10,
      startTime: '00:00',
      endTime: '23:59',
      explicitTimes: null,
      notes: 'Mock data',
    },
  ],
};

const DETAILS: Record<string, RouteDetailDto> = {
  '400p': DETAIL_400P,
  '400sd': DETAIL_400SD,
};

export const mockRoutesProvider: RoutesProvider = {
  async listRoutes() {
    return SUMMARIES;
  },
  async getRoute(routeId) {
    return DETAILS[routeId] ?? null;
  },
};
