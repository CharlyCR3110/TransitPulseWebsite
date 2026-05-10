'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { MiniMap } from '@/components/transit/mini-map';
import { ConfidenceRing } from '@/components/transit/confidence-ring';
import { RouteBadge } from '@/components/transit/route-badge';
import { OccBars } from '@/components/transit/occ-bars';
import { StatusChip } from '@/components/transit/status-chip';
import { useLang } from '@/components/providers/lang-provider';
import { useTripDetail } from './use-trip-detail';
import { formatEmittedAt } from '@/features/alerts/format-emitted-at';
import type { I18nKey } from '@/data/transit';
import type { BusLegStop, BusStep, TripStep } from '@/types/transit';

type FlatItem =
  | { kind: 'plain'; step: TripStep }
  | { kind: 'leg-stop'; step: BusStep; leg: BusLegStop };

function flattenSteps(steps: TripStep[]): FlatItem[] {
  const out: FlatItem[] = [];
  for (const step of steps) {
    if (step.kind === 'bus' && step.legStops && step.legStops.length > 0) {
      for (const leg of step.legStops) {
        out.push({ kind: 'leg-stop', step, leg });
      }
    } else {
      out.push({ kind: 'plain', step });
    }
  }
  return out;
}

interface TripDetailScreenProps {
  tripId: string;
}

export function TripDetailScreen({ tripId }: TripDetailScreenProps) {
  const { t, lang } = useLang();
  const router = useRouter();
  const { trip, relatedAlerts: related, loading, error } = useTripDetail(tripId);

  if (loading) {
    return (
      <div className="screen screen-fade">
        <AppBar title="…" showBack />
        <div className="empty">{t('searching')}</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="screen screen-fade">
        <AppBar title={t('plan_trip')} showBack />
        <div className="empty" style={{ color: 'var(--bad)' }}>{t('trip_not_found')}</div>
      </div>
    );
  }

  const confLabel: I18nKey = trip.confidence >= 0.9 ? 'reliable' : trip.confidence >= 0.8 ? 'moderate' : 'low';
  const arrivalTime = trip.steps[trip.steps.length - 1].time;
  const departTime = trip.steps[0].time;
  const flat = useMemo(() => flattenSteps(trip.steps), [trip.steps]);

  return (
    <div className="screen screen-fade">
      <AppBar
        title={`${t('duration')} · ${trip.minutes} ${t('min')}`}
        showBack
        trailing={
          <>
            <button className="appbar-action"><Icon name="refresh" size={18} /></button>
            <button className="appbar-action"><Icon name="star" size={18} /></button>
          </>
        }
      />

      <div className="trip-head">
        <div className="trip-route-line">
          <span className="dot-from" />
          <span style={{ flexShrink: 0 }}>San Pedro</span>
          <span className="line" />
          <span style={{ flexShrink: 0 }}>Escazú</span>
          <span className="dot-to" />
        </div>
        <div className="trip-stats">
          <div className="trip-stat">
            <div className="trip-stat-label">{t('leaves')}</div>
            <div className="trip-stat-val">{departTime}</div>
          </div>
          <div className="trip-stat">
            <div className="trip-stat-label">{t('arrive')}</div>
            <div className="trip-stat-val">{arrivalTime}</div>
          </div>
          <div className="trip-stat">
            <div className="trip-stat-label">{t('cost')}</div>
            <div className="trip-stat-val">₡{trip.price}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <MiniMap t={t} variant="trip" fallbackCenter={{ lat: 9.9343, lng: -84.0508 }} />
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <div className="confidence">
          <ConfidenceRing value={trip.confidence} />
          <div>
            <div className="confidence-body-label">{t('confidence')}</div>
            <div className="confidence-body-value">{t(confLabel)}</div>
            <div className="confidence-body-note">{t('usually_on_time')}</div>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 6 }}>
        <div className="section-head">
          <span className="section-title">{t('steps')}</span>
        </div>
        <div className="timeline">
          {flat.map((item, idx) => {
            const isLast = idx === flat.length - 1;

            if (item.kind === 'plain') {
              const step = item.step;
              const isWalk = step.kind === 'walk';
              const isTransfer = step.kind === 'transfer';
              const nodeCls = isLast ? 'tl-node--end' : isWalk ? 'tl-node--walk' : isTransfer ? 'tl-node--transfer' : '';
              const title = isWalk
                ? `${t('walk_to')} ${lang === 'es' ? (step as { toEs: string }).toEs : (step as { toEn: string }).toEn} · ${step.minutes} ${t('min')}`
                : isTransfer
                  ? `${t('transfer')} · ${step.minutes} ${t('min')}`
                  : `${lang === 'es' ? (step as BusStep).fromEs : (step as BusStep).fromEn} → ${lang === 'es' ? (step as BusStep).toEs : (step as BusStep).toEn}`;
              return (
                <div key={`p-${idx}`} className="tl-step">
                  <div className="tl-rail">
                    <span className={`tl-node ${nodeCls}`} />
                    {!isLast && <span className={`tl-connector ${isWalk || isTransfer ? 'tl-connector--walk' : ''}`} />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-time">{step.time}</div>
                    <div className="tl-title">{title}</div>
                  </div>
                </div>
              );
            }

            // leg-stop
            const { step, leg } = item;
            const stopName = lang === 'es' ? leg.nameEs : leg.nameEn;
            const isBoard = leg.isBoarding;
            const isAlight = leg.isAlighting;
            const offsetLabel = isBoard
              ? (lang === 'es' ? 'Abordas aquí' : 'Board here')
              : isAlight
                ? (lang === 'es' ? 'Bajas aquí' : 'Alight here')
                : `+${leg.offsetFromBoardingMin} ${t('min')}`;
            const nodeStyle: React.CSSProperties = isBoard || isAlight
              ? { background: 'var(--primary)', width: 14, height: 14 }
              : { background: 'var(--text-3)', width: 8, height: 8 };
            return (
              <div key={`bs-${idx}`} className="tl-step">
                <div className="tl-rail">
                  <span className="tl-node" style={nodeStyle} />
                  {!isLast && <span className="tl-connector" />}
                </div>
                <div className="tl-body" style={{
                  background: isBoard || isAlight ? 'var(--primary-weak)' : 'transparent',
                  borderRadius: 'var(--r-sm)',
                  padding: isBoard || isAlight ? '8px 10px' : '4px 0 4px 2px',
                }}>
                  <div className="tl-time" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{offsetLabel}</span>
                    {isBoard && <RouteBadge route={step.route} kind="bus" />}
                  </div>
                  <div className="tl-title" style={{
                    fontWeight: isBoard || isAlight ? 600 : 500,
                    color: isBoard || isAlight ? 'var(--text)' : 'var(--text-2)',
                  }}>{stopName}</div>
                  {isBoard && (
                    <div className="tl-detail-extra" style={{ marginTop: 6 }}>
                      <OccBars level={step.occ} t={t} />
                      <StatusChip status="ok" label={t('onTime')} />
                      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                        {step.minutes} {t('min')} · {(step.legStops?.length ?? 1) - 1} {lang === 'es' ? 'paradas' : 'stops'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {related.length > 0 && (
        <div className="section">
          <div className="section-head">
            <span className="section-title">{t('related_alerts')}</span>
            <button className="section-link" onClick={() => router.push('/alerts')}>{t('view_all')}</button>
          </div>
          <div className="stack">
            {related.map((al) => (
              <div key={al.id} className="alert">
                <div className={`alert-icon alert-icon--${al.severity}`}>
                  <Icon name={al.severity === 'bad' ? 'alert' : al.severity === 'warn' ? 'info' : 'check'} size={18} />
                </div>
                <div>
                  <div className="alert-head">
                    <div className="alert-title">{t(al.titleKey as I18nKey)}</div>
                    <div className="alert-time">{formatEmittedAt(al.emittedAt, lang)}</div>
                  </div>
                  <div className="alert-body">{t(al.bodyKey as I18nKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '8px 20px 20px' }}>
        <button
          onClick={() => router.push(`/trip/active?tripId=${tripId}`)}
          style={{ width: '100%', padding: '14px 20px', background: 'var(--primary)', color: 'var(--primary-contrast)', borderRadius: 'var(--r-md)', fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em', boxShadow: 'var(--shadow-sm)' }}
        >
          {t('start_trip')}
        </button>
      </div>
    </div>
  );
}
