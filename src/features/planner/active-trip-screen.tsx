'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { RouteBadge } from '@/components/transit/route-badge';
import { StatusChip } from '@/components/transit/status-chip';
import { useLang } from '@/components/providers/lang-provider';
import { useActiveTrip } from './use-active-trip';
import { ReportButton } from '@/components/reports/report-button';
import type {
  BusLegStop,
  BusStep,
  TransferStep,
  TripStep,
  WalkStep,
} from '@/types/transit';
import type { I18nKey } from '@/data/transit';

type FlatItem =
  | {
      kind: 'plain';
      step: TripStep;
      stepIndex: number;
      startMin: number;
      endMin: number;
    }
  | {
      kind: 'leg-stop';
      step: BusStep;
      stepIndex: number;
      leg: BusLegStop;
      startMin: number; // wall-clock minute when bus arrives at this stop
    };

function flattenForActive(steps: TripStep[]): FlatItem[] {
  const out: FlatItem[] = [];
  let cumMin = 0;
  steps.forEach((step, stepIndex) => {
    if (step.kind === 'bus' && step.legStops && step.legStops.length > 0) {
      for (const leg of step.legStops) {
        out.push({
          kind: 'leg-stop',
          step: step as BusStep,
          stepIndex,
          leg,
          startMin: cumMin + leg.offsetFromBoardingMin,
        });
      }
      cumMin += step.minutes;
    } else {
      out.push({
        kind: 'plain',
        step,
        stepIndex,
        startMin: cumMin,
        endMin: cumMin + step.minutes,
      });
      cumMin += step.minutes;
    }
  });
  return out;
}

function findCurrentIndex(items: FlatItem[], elapsedMin: number): number {
  let current = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].startMin <= elapsedMin) {
      current = i;
    } else {
      break;
    }
  }
  return current;
}

function itemTitle(item: FlatItem, lang: 'es' | 'en', t: (k: I18nKey) => string): string {
  if (item.kind === 'leg-stop') {
    return lang === 'es' ? item.leg.nameEs : item.leg.nameEn;
  }
  const step = item.step;
  if (step.kind === 'walk') {
    const s = step as WalkStep;
    return `${t('walk_to')} ${lang === 'es' ? s.toEs : s.toEn} · ${s.minutes} ${t('min')}`;
  }
  if (step.kind === 'transfer') {
    const s = step as TransferStep;
    return `${t('transfer')} · ${s.minutes} ${t('min')}`;
  }
  const s = step as BusStep;
  return `${lang === 'es' ? s.fromEs : s.fromEn} → ${lang === 'es' ? s.toEs : s.toEn}`;
}

function itemSubtitle(item: FlatItem, lang: 'es' | 'en', t: (k: I18nKey) => string): string {
  if (item.kind !== 'leg-stop') return '';
  const { leg, step } = item;
  if (leg.isBoarding) {
    return lang === 'es' ? `Aborda · ${step.route}` : `Board · ${step.route}`;
  }
  if (leg.isAlighting) {
    return lang === 'es' ? `Baja aquí · ${step.route}` : `Alight here · ${step.route}`;
  }
  return `+${leg.offsetFromBoardingMin} ${t('min')}`;
}

export function ActiveTripScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const tripId = params.get('tripId') ?? '';

  const { activeTrip, loading, error, advance } = useActiveTrip(tripId);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!activeTrip) return;
    const iv = setInterval(
      () => setElapsedSec(Math.floor((Date.now() - activeTrip.started) / 1000)),
      1000,
    );
    return () => clearInterval(iv);
  }, [activeTrip]);

  const flat = useMemo(
    () => (activeTrip ? flattenForActive(activeTrip.steps) : []),
    [activeTrip],
  );

  if (loading) {
    return (
      <div className="screen screen-fade">
        <AppBar title={t('start_trip')} showBack />
        <div className="empty">{t('searching')}</div>
      </div>
    );
  }

  if (error || !activeTrip) {
    return (
      <div className="screen screen-fade">
        <AppBar title={t('start_trip')} showBack />
        <div className="empty" style={{ color: 'var(--bad)' }}>
          {error === 'not-found' || !tripId ? t('trip_not_found') : t('trip_load_failed')}
        </div>
      </div>
    );
  }

  const elapsedMin = Math.floor(elapsedSec / 60);
  const { etaMinutes, steps } = activeTrip;
  const currentIdx = findCurrentIndex(flat, elapsedMin);
  const currentItem = flat[currentIdx];
  const nextItem = flat[currentIdx + 1] ?? null;
  const isLast = currentIdx >= flat.length - 1;
  const progress = Math.min((currentIdx / Math.max(flat.length - 1, 1)) * 100, 100);

  const currentBusStep =
    currentItem?.kind === 'leg-stop'
      ? currentItem.step
      : currentItem?.kind === 'plain' && currentItem.step.kind === 'bus'
        ? (currentItem.step as BusStep)
        : null;

  return (
    <div className="screen screen-fade">
      <AppBar
        title={t('start_trip')}
        trailing={
          <button className="appbar-action" onClick={() => router.push('/home')} aria-label="End trip">
            <Icon name="close" size={18} />
          </button>
        }
      />

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--surface-2)', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', inset: 0, width: `${progress}%`,
            background: 'var(--primary)', transition: 'width 0.6s var(--ease)',
          }}
        />
      </div>

      {/* ETA card */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          background: 'var(--primary)', borderRadius: 'var(--r-lg)', padding: '20px 24px',
          color: 'var(--primary-contrast)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.8, marginBottom: 4 }}>{t('arrive')}</div>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
              {etaMinutes} <span style={{ fontSize: 16, fontWeight: 500 }}>{t('min')}</span>
            </div>
            {elapsedMin > 0 && (
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{elapsedMin} {t('min')} {t('elapsed')}</div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
              {currentItem?.kind === 'leg-stop' ? (lang === 'es' ? 'Parada' : 'Stop') : t('step')}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {currentIdx + 1}/{flat.length}
            </div>
            <StatusChip status="ok" label={t('onTime')} />
          </div>
        </div>
      </div>

      {/* Current item */}
      {currentItem && (
        <div className="section" style={{ marginTop: 16 }}>
          <div className="section-head">
            <span className="section-title">{t('now_label')}</span>
          </div>
          <div style={{
            background: 'var(--surface)', border: '2px solid var(--primary)', borderRadius: 'var(--r-md)',
            padding: '16px', display: 'flex', gap: 12, alignItems: 'flex-start',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-weak)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {currentItem.kind === 'leg-stop'
                ? <Icon name="bus" size={18} />
                : currentItem.step.kind === 'walk' || currentItem.step.kind === 'transfer'
                  ? <Icon name="walk" size={18} />
                  : <Icon name="bus" size={18} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
                {itemTitle(currentItem, lang, t)}
              </div>
              {currentItem.kind === 'leg-stop' && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                  <RouteBadge route={currentItem.step.route} kind="bus" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{itemSubtitle(currentItem, lang, t)}</span>
                </div>
              )}
              {currentItem.kind === 'plain' && currentItem.step.kind === 'bus' && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                  <RouteBadge route={(currentItem.step as BusStep).route} kind="bus" />
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {(currentItem.step as BusStep).stops} {lang === 'es' ? 'paradas' : 'stops'} · {currentItem.step.minutes} {t('min')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next item */}
      {nextItem && (
        <div className="section" style={{ marginTop: 8 }}>
          <div className="section-head">
            <span className="section-title">{t('up_next')}</span>
          </div>
          <div style={{
            background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: '14px 16px',
            display: 'flex', gap: 12, alignItems: 'flex-start', opacity: 0.85,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sunk)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {nextItem.kind === 'leg-stop'
                ? <Icon name="pin" size={16} />
                : nextItem.step.kind === 'walk' || nextItem.step.kind === 'transfer'
                  ? <Icon name="walk" size={16} />
                  : <Icon name="bus" size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-2)' }}>{itemTitle(nextItem, lang, t)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {nextItem.kind === 'leg-stop' ? itemSubtitle(nextItem, lang, t) : nextItem.step.time}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full timeline */}
      <div className="section" style={{ marginTop: 8 }}>
        <div className="section-head">
          <span className="section-title">{t('steps')}</span>
        </div>
        <div className="timeline">
          {flat.map((item, idx) => {
            const isActive = idx === currentIdx;
            const isDone = idx < currentIdx;
            const isEnd = idx === flat.length - 1;
            const isLeg = item.kind === 'leg-stop';
            const isAlight = isLeg && (item as Extract<FlatItem, { kind: 'leg-stop' }>).leg.isAlighting;
            const isBoard = isLeg && (item as Extract<FlatItem, { kind: 'leg-stop' }>).leg.isBoarding;
            const nodeStyle: React.CSSProperties = isActive
              ? { background: 'var(--primary)', boxShadow: '0 0 0 3px var(--primary-weak)', width: 14, height: 14 }
              : isDone
                ? { background: 'var(--ok)' }
                : isLeg && !isBoard && !isAlight
                  ? { background: 'var(--text-3)', width: 8, height: 8 }
                  : {};
            return (
              <div key={idx} className="tl-step" style={{ opacity: isDone ? 0.5 : 1 }}>
                <div className="tl-rail">
                  <span className={`tl-node ${isEnd ? 'tl-node--end' : ''}`} style={nodeStyle} />
                  {!isEnd && (
                    <span
                      className="tl-connector"
                      style={isDone ? { borderColor: 'var(--ok)' } : {}}
                    />
                  )}
                </div>
                <div className="tl-body">
                  <div className="tl-time">
                    {item.kind === 'leg-stop'
                      ? itemSubtitle(item, lang, t)
                      : item.step.time}
                  </div>
                  <div className="tl-title" style={isActive ? { color: 'var(--primary)', fontWeight: 600 } : {}}>
                    {itemTitle(item, lang, t)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report */}
      {currentBusStep && (
        <div style={{ padding: '8px 20px 0', display: 'flex', justifyContent: 'center' }}>
          <ReportButton routeId={currentBusStep.route} />
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '8px 20px 24px', display: 'flex', gap: 10 }}>
        {!isLast && currentItem?.kind === 'plain' && (
          <button
            onClick={advance}
            style={{
              flex: 1, padding: '13px 16px', background: 'var(--primary-weak)', color: 'var(--primary)',
              borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
            }}
          >
            {t('next_step')} →
          </button>
        )}
        <button
          onClick={() => router.push('/home')}
          style={{
            flex: isLast || currentItem?.kind === 'leg-stop' ? 1 : undefined,
            padding: '13px 16px',
            background: isLast ? 'var(--primary)' : 'var(--surface-2)',
            color: isLast ? 'var(--primary-contrast)' : 'var(--text-3)',
            borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
          }}
        >
          {isLast || currentIdx >= steps.length - 1 ? t('end_trip') : t('cancel')}
        </button>
      </div>
    </div>
  );
}
