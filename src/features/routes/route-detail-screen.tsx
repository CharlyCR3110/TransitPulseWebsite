'use client';
import { useMemo, useState } from 'react';
import { AppBar } from '@/components/layout/app-bar';
import { MiniMap } from '@/components/transit/mini-map';
import { useLang } from '@/components/providers/lang-provider';
import { useRoute } from '@/lib/hooks/use-routes';
import type { RouteScheduleDto } from '@/data/contracts/routes';
import type { I18nKey } from '@/data/transit';

interface RouteDetailScreenProps {
  routeId: string;
}

function formatHeadway(s: RouteScheduleDto, t: (k: I18nKey) => string): string {
  if (s.mode === 'headway' && s.headwayMin) {
    return `${t('every')} ${s.headwayMin} ${t('min')} · ${s.startTime}–${s.endTime}`;
  }
  if (s.mode === 'explicit' && s.explicitTimes) {
    return `${s.explicitTimes.length} ${t('departures')} · ${s.startTime}–${s.endTime}`;
  }
  return `${s.startTime}–${s.endTime}`;
}

function serviceDayLabel(day: string, t: (k: I18nKey) => string): string {
  if (day === 'weekday') return t('service_weekday');
  if (day === 'saturday') return t('service_saturday');
  if (day === 'sunday_holiday') return t('service_sunday_holiday');
  return day;
}

export function RouteDetailScreen({ routeId }: RouteDetailScreenProps) {
  const { t, lang } = useLang();
  const { route, loading, error } = useRoute(routeId);
  const [direction, setDirection] = useState<string>('outbound');

  const directions = useMemo(() => Object.keys(route?.directions ?? {}), [route]);
  const activeDirection = directions.includes(direction)
    ? direction
    : directions[0] ?? 'outbound';
  const dir = route?.directions[activeDirection] ?? null;

  const path = useMemo(() => {
    if (!dir?.shape) return [];
    return dir.shape.coordinates.map(([lng, lat]) => ({ lat, lng }));
  }, [dir]);

  const pins = useMemo(() => {
    if (!dir) return [];
    return dir.stops.map((s, i) => ({
      id: s.stopId,
      lat: s.lat,
      lng: s.lng,
      variant: i === 0 ? ('highlight' as const) : ('default' as const),
    }));
  }, [dir]);

  if (loading) {
    return (
      <div className="screen screen-fade">
        <AppBar title={t('routes')} showBack />
        <div className="empty">{t('searching')}</div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="screen screen-fade">
        <AppBar title={t('routes')} showBack />
        <div className="empty" style={{ color: 'var(--bad)' }}>{t('route_not_found')}</div>
      </div>
    );
  }

  const longName = lang === 'es' ? route.nameEs : route.nameEn;
  const directionSchedules = route.schedules.filter((s) => s.direction === activeDirection);

  return (
    <div className="screen screen-fade">
      <AppBar title={route.code} showBack />

      <div className="stop-hero">
        <h2 className="stop-name">{route.code}</h2>
        <p className="stop-addr">{longName}</p>
        <div className="stop-meta-row">
          {route.operator && (
            <span className="chip chip--neutral">{route.operator}</span>
          )}
          <span className="chip chip--neutral">₡{route.fareCrc}</span>
          <span className="spacer" />
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <MiniMap t={t} variant="trip" pins={pins} path={path} />
      </div>

      {directions.length > 1 && (
        <div style={{ padding: '12px 20px 0', display: 'flex', gap: 6 }}>
          {directions.map((d) => (
            <button
              key={d}
              className={`chip ${d === activeDirection ? 'chip--primary' : 'chip--neutral'}`}
              onClick={() => setDirection(d)}
            >
              {d === 'outbound' ? t('outbound') : d === 'inbound' ? t('inbound') : d}
            </button>
          ))}
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('stops_label')}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            {dir ? dir.stops.length : 0}
          </span>
        </div>
        <div className="card--flat">
          {dir?.stops.map((s, i) => (
            <div
              key={s.stopId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderBottom: i < (dir.stops.length - 1) ? '1px solid var(--line)' : 'none',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--primary)' : 'var(--bg-2)',
                  color: i === 0 ? '#fff' : 'var(--text-2)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
                aria-hidden
              >
                {s.sequence}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {lang === 'es' ? s.nameEs : s.nameEn}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
                +{s.scheduledOffsetMin} {t('min')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('schedules_label')}</span>
        </div>
        <div className="card--flat">
          {directionSchedules.length === 0 && (
            <div className="empty">{t('no_results')}</div>
          )}
          {directionSchedules.map((s, i) => (
            <div
              key={`${s.direction}-${s.serviceDay}-${i}`}
              style={{
                padding: '10px 14px',
                borderBottom: i < directionSchedules.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{serviceDayLabel(s.serviceDay, t)}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
                  {formatHeadway(s, t)}
                </span>
              </div>
              {s.notes && (
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{s.notes}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
