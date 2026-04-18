import type { Arrival, Stop, Alert, TripOption } from '@/types/transit';

export type I18nKey = keyof typeof I18N.es;

export const I18N = {
  es: {
    home: 'Inicio', plan: 'Planear', alerts: 'Alertas', profile: 'Perfil',
    greeting_morning: 'Buenos días, Ana', greeting_afternoon: 'Buenas tardes, Ana', greeting_evening: 'Buenas noches, Ana',
    sub_home: 'Aquí está tu GAM ahora mismo',
    nearby: 'Paradas cercanas', next_departures: 'Próximas salidas', view_all: 'Ver todas',
    active_alerts: 'Alertas activas', no_alerts: 'Sin alertas · todo normal',
    plan_trip: '¿A dónde vas?', search_placeholder: 'Buscar parada o destino',
    from: 'Desde', to: 'Hasta', current_location: 'Ubicación actual', destination: 'Destino',
    fastest: 'Más rápido', cheapest: 'Más barato', fewest: 'Menos transbordos', best: 'Mejor',
    now: 'ahora', min: 'min', mins_short: 'min', transfers: 'transbordos', transfer: 'transbordo',
    walk: 'camina', leaves: 'Sale', arrive: 'Llegada',
    confidence: 'Confianza', reliable: 'Confiable', moderate: 'Moderada', low: 'Baja',
    occupancy: 'Ocupación', low_occ: 'Pocas personas', med_occ: 'Medio', high_occ: 'Lleno', full_occ: 'Muy lleno',
    onTime: 'A tiempo', delayed: 'Demorado', disrupted: 'Interrumpido', live: 'En vivo',
    board: 'Abordar', get_off: 'Bajar', steps: 'Pasos del viaje', related_alerts: 'Alertas relacionadas', start_trip: 'Iniciar viaje',
    nearby_stops: 'Paradas cercanas', at_stop: 'En parada',
    filter_all: 'Todas', filter_critical: 'Críticas', filter_warn: 'Advertencias', filter_info: 'Información',
    alerts_sub: 'Interrupciones activas en la GAM',
    stop_code: 'Parada', last_update: 'Actualizado', seconds_ago: 's', map_label: 'Mapa · GAM',
    cost: 'Costo', duration: 'Duración',
    stop_1: 'Parada Fuente de la Hispanidad', stop_1_addr: 'Avenida Central, San Pedro',
    stop_2: 'Estación Atlántico', stop_2_addr: 'Barrio Tournón · Incofer',
    stop_3: 'Parada Multiplaza', stop_3_addr: 'Escazú · Autopista Próspero Fernández',
    searching: 'Buscando rutas…', no_results: 'Sin resultados',
    dark: 'Oscuro', light: 'Claro', language: 'Idioma', theme: 'Tema', tweaks: 'Ajustes',
    alert_1_title: 'Cierre parcial en Paseo Colón',
    alert_1_body: 'Manifestación afecta rutas hacia el centro. Se recomienda usar la línea del tren.',
    alert_2_title: 'Tren con demoras de 8 min',
    alert_2_body: 'Mantenimiento programado entre Heredia y San José.',
    alert_3_title: 'Desvío: Ruta 302',
    alert_3_body: 'Por obras viales, la ruta 302 circula por Avenida 10 hasta el viernes.',
    alert_4_title: 'Servicio restablecido: Línea Cartago',
    alert_4_body: 'El servicio opera con normalidad tras la incidencia de la mañana.',
    usually_on_time: 'Usualmente puntual a esta hora',
    data_updated: 'basado en datos en vivo y 30 días de historial',
    walk_to: 'Camina a', platform: 'Andén', paradas: 'paradas',
    refresh: 'Actualizar', star: 'Favorito',
    favorites: 'Favoritos', this_month: 'Este mes',
    trips: 'Viajes', on_transit: 'En transporte', spent: 'Gastado', on_time_pct: 'A tiempo',
    commuter: 'Commuter · San Pedro',
  },
  en: {
    home: 'Home', plan: 'Plan', alerts: 'Alerts', profile: 'Profile',
    greeting_morning: 'Good morning, Ana', greeting_afternoon: 'Good afternoon, Ana', greeting_evening: 'Good evening, Ana',
    sub_home: "Here's your GAM right now",
    nearby: 'Nearby stops', next_departures: 'Next departures', view_all: 'View all',
    active_alerts: 'Active alerts', no_alerts: 'No alerts · all normal',
    plan_trip: 'Where to?', search_placeholder: 'Search stop or destination',
    from: 'From', to: 'To', current_location: 'Current location', destination: 'Destination',
    fastest: 'Fastest', cheapest: 'Cheapest', fewest: 'Fewest transfers', best: 'Best',
    now: 'now', min: 'min', mins_short: 'min', transfers: 'transfers', transfer: 'transfer',
    walk: 'walk', leaves: 'Leaves', arrive: 'Arrives',
    confidence: 'Confidence', reliable: 'Reliable', moderate: 'Moderate', low: 'Low',
    occupancy: 'Occupancy', low_occ: 'Few people', med_occ: 'Medium', high_occ: 'Crowded', full_occ: 'Packed',
    onTime: 'On time', delayed: 'Delayed', disrupted: 'Disrupted', live: 'Live',
    board: 'Board', get_off: 'Get off', steps: 'Trip steps', related_alerts: 'Related alerts', start_trip: 'Start trip',
    nearby_stops: 'Nearby stops', at_stop: 'At stop',
    filter_all: 'All', filter_critical: 'Critical', filter_warn: 'Warnings', filter_info: 'Info',
    alerts_sub: 'Active disruptions in the GAM',
    stop_code: 'Stop', last_update: 'Updated', seconds_ago: 's', map_label: 'Map · GAM',
    cost: 'Cost', duration: 'Duration',
    stop_1: 'Fuente de la Hispanidad Stop', stop_1_addr: 'Avenida Central, San Pedro',
    stop_2: 'Atlántico Station', stop_2_addr: 'Tournón · Incofer',
    stop_3: 'Multiplaza Stop', stop_3_addr: 'Escazú · Próspero Fernández Hwy',
    searching: 'Finding routes…', no_results: 'No results',
    dark: 'Dark', light: 'Light', language: 'Language', theme: 'Theme', tweaks: 'Tweaks',
    alert_1_title: 'Partial closure on Paseo Colón',
    alert_1_body: 'Protest affecting downtown routes. Consider using the train line.',
    alert_2_title: 'Train delayed 8 min',
    alert_2_body: 'Scheduled maintenance between Heredia and San José.',
    alert_3_title: 'Detour: Route 302',
    alert_3_body: 'Due to road works, route 302 runs via Avenida 10 until Friday.',
    alert_4_title: 'Service restored: Cartago Line',
    alert_4_body: "Service operating normally after this morning's incident.",
    usually_on_time: 'Usually on time at this hour',
    data_updated: 'based on live data + 30 days of history',
    walk_to: 'Walk to', platform: 'Platform', paradas: 'stops',
    refresh: 'Refresh', star: 'Favorite',
    favorites: 'Favorites', this_month: 'This month',
    trips: 'Trips', on_transit: 'On transit', spent: 'Spent', on_time_pct: 'On time',
    commuter: 'Commuter · San Pedro',
  },
} as const;

export function useT(lang: 'es' | 'en') {
  return (key: I18nKey): string => {
    return (I18N[lang] as Record<string, string>)[key] ?? (I18N.en as Record<string, string>)[key] ?? key;
  };
}

export const INITIAL_ARRIVALS: Arrival[] = [
  { id: 'a1', route: '100', kind: 'bus', destEs: 'San José (Merced)', destEn: 'San José (Merced)', etaSec: 180, status: 'ok', occupancy: 2 },
  { id: 'a2', route: '302', kind: 'bus', destEs: 'San Pedro · UCR', destEn: 'San Pedro · UCR', etaSec: 420, status: 'warn', occupancy: 3, note_es: 'Desvío activo', note_en: 'Detour active' },
  { id: 'a3', route: 'T1', kind: 'train', destEs: 'Heredia', destEn: 'Heredia', etaSec: 660, status: 'warn', occupancy: 2, note_es: '+8 min demora', note_en: '+8 min delay' },
  { id: 'a4', route: '44', kind: 'bus', destEs: 'Curridabat', destEn: 'Curridabat', etaSec: 900, status: 'ok', occupancy: 1 },
  { id: 'a5', route: '55', kind: 'bus', destEs: 'Tres Ríos', destEn: 'Tres Ríos', etaSec: 1320, status: 'ok', occupancy: 1 },
  { id: 'a6', route: 'T2', kind: 'train', destEs: 'Cartago', destEn: 'Cartago', etaSec: 1680, status: 'ok', occupancy: 0 },
];

export const NEARBY_STOPS: Stop[] = [
  { id: 's1', nameKey: 'stop_1', addrKey: 'stop_1_addr', dist: 120, live: true, routes: ['100', '302', '44', 'T1'] },
  { id: 's2', nameKey: 'stop_2', addrKey: 'stop_2_addr', dist: 480, live: true, routes: ['T1', 'T2'] },
  { id: 's3', nameKey: 'stop_3', addrKey: 'stop_3_addr', dist: 1200, live: false, routes: ['201', '205', '207'] },
];

export const ALERTS: Alert[] = [
  { id: 'al1', severity: 'bad', titleKey: 'alert_1_title', bodyKey: 'alert_1_body', time: '12 min', routes: ['100', '55', '44'] },
  { id: 'al2', severity: 'warn', titleKey: 'alert_2_title', bodyKey: 'alert_2_body', time: '38 min', routes: ['T1'] },
  { id: 'al3', severity: 'warn', titleKey: 'alert_3_title', bodyKey: 'alert_3_body', time: '2 h', routes: ['302'] },
  { id: 'al4', severity: 'ok', titleKey: 'alert_4_title', bodyKey: 'alert_4_body', time: '4 h', routes: ['T2'] },
];

export const TRIP_OPTIONS: TripOption[] = [
  {
    id: 'r1', tag: 'fastest', minutes: 38, price: 920, transfers: 1, walkMin: 6, leaveIn: 4, confidence: 0.92, occupancy: 2,
    steps: [
      { kind: 'walk', minutes: 3, toEs: 'Parada Fuente de la Hispanidad', toEn: 'Fuente de la Hispanidad Stop', time: '08:42' },
      { kind: 'bus', route: '100', minutes: 14, fromEs: 'Fuente de la Hispanidad', fromEn: 'Fuente de la Hispanidad', toEs: 'San José · Av. 2', toEn: 'San José · Av. 2', time: '08:45', occ: 2, stops: 6 },
      { kind: 'transfer', minutes: 4, toEs: 'Parada Av. 2 (cuadra 8)', toEn: 'Av. 2 Stop (block 8)', time: '08:59' },
      { kind: 'bus', route: '201', minutes: 16, fromEs: 'Av. 2 (cuadra 8)', fromEn: 'Av. 2 (block 8)', toEs: 'Multiplaza Escazú', toEn: 'Multiplaza Escazú', time: '09:03', occ: 3, stops: 9 },
      { kind: 'walk', minutes: 3, toEs: 'Multiplaza · entrada norte', toEn: 'Multiplaza · North entrance', time: '09:19' },
    ],
  },
  {
    id: 'r2', tag: 'cheapest', minutes: 52, price: 620, transfers: 0, walkMin: 14, leaveIn: 9, confidence: 0.81, occupancy: 2,
    steps: [
      { kind: 'walk', minutes: 8, toEs: 'Parada San Pedro · Mall', toEn: 'San Pedro · Mall Stop', time: '08:47' },
      { kind: 'bus', route: '205', minutes: 38, fromEs: 'San Pedro · Mall', fromEn: 'San Pedro · Mall', toEs: 'Multiplaza Escazú', toEn: 'Multiplaza Escazú', time: '08:55', occ: 2, stops: 18 },
      { kind: 'walk', minutes: 6, toEs: 'Multiplaza · entrada norte', toEn: 'Multiplaza · North entrance', time: '09:33' },
    ],
  },
  {
    id: 'r3', tag: 'fewest', minutes: 45, price: 780, transfers: 0, walkMin: 9, leaveIn: 12, confidence: 0.86, occupancy: 3,
    steps: [
      { kind: 'walk', minutes: 5, toEs: 'Parada Fuente', toEn: 'Fuente Stop', time: '08:50' },
      { kind: 'bus', route: '207', minutes: 36, fromEs: 'Fuente', fromEn: 'Fuente', toEs: 'Multiplaza', toEn: 'Multiplaza', time: '08:55', occ: 3, stops: 15 },
      { kind: 'walk', minutes: 4, toEs: 'Multiplaza · entrada sur', toEn: 'Multiplaza · South entrance', time: '09:31' },
    ],
  },
];
