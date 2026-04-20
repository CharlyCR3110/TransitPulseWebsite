'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { RouteBadge } from '@/components/transit/route-badge';
import { StatusChip } from '@/components/transit/status-chip';
import { useLang } from '@/components/providers/lang-provider';
import { useActiveTrip } from './use-active-trip';
import type { BusStep, WalkStep, TransferStep } from '@/types/transit';

export function ActiveTripScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const tripId = params.get('tripId') ?? '';

  const { activeTrip, loading, error, advance } = useActiveTrip(tripId);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeTrip) return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - activeTrip.started) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [activeTrip]);

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
        <div className="empty" style={{ color: 'var(--bad)' }}>Error loading trip</div>
      </div>
    );
  }

  const { steps, currentStepIndex, etaMinutes } = activeTrip;
  const currentStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1] ?? null;
  const isLast = currentStepIndex >= steps.length - 1;
  const elapsedMin = Math.floor(elapsed / 60);

  function stepLabel(step: typeof steps[number]) {
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

  const progress = Math.min((currentStepIndex / Math.max(steps.length - 1, 1)) * 100, 100);

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
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{elapsedMin} {t('min')} elapsed</div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Step</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {currentStepIndex + 1}/{steps.length}
            </div>
            <StatusChip status="ok" label={t('onTime')} />
          </div>
        </div>
      </div>

      {/* Current step */}
      <div className="section" style={{ marginTop: 16 }}>
        <div className="section-head">
          <span className="section-title">Now</span>
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
            {currentStep.kind === 'walk' || currentStep.kind === 'transfer'
              ? <Icon name="walk" size={18} />
              : <Icon name="bus" size={18} />
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
              {stepLabel(currentStep)}
            </div>
            {currentStep.kind === 'bus' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <RouteBadge route={(currentStep as BusStep).route} kind="bus" />
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {(currentStep as BusStep).stops} stops · {currentStep.minutes} {t('min')}
                </span>
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
              {currentStep.time}
            </div>
          </div>
        </div>
      </div>

      {/* Next step */}
      {nextStep && (
        <div className="section" style={{ marginTop: 8 }}>
          <div className="section-head">
            <span className="section-title">Up next</span>
          </div>
          <div style={{
            background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: '14px 16px',
            display: 'flex', gap: 12, alignItems: 'flex-start', opacity: 0.8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sunk)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {nextStep.kind === 'walk' || nextStep.kind === 'transfer'
                ? <Icon name="walk" size={16} />
                : <Icon name="bus" size={16} />
              }
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-2)' }}>{stepLabel(nextStep)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{nextStep.time}</div>
            </div>
          </div>
        </div>
      )}

      {/* All steps summary */}
      <div className="section" style={{ marginTop: 8 }}>
        <div className="section-head">
          <span className="section-title">{t('steps')}</span>
        </div>
        <div className="timeline">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isDone = idx < currentStepIndex;
            const isEnd = idx === steps.length - 1;
            return (
              <div key={idx} className="tl-step" style={{ opacity: isDone ? 0.45 : 1 }}>
                <div className="tl-rail">
                  <span className={`tl-node ${isEnd ? 'tl-node--end' : ''} ${isActive ? 'tl-node--active' : ''}`}
                    style={isActive ? { background: 'var(--primary)', boxShadow: '0 0 0 3px var(--primary-weak)' } : isDone ? { background: 'var(--ok)' } : {}}
                  />
                  {!isEnd && <span className={`tl-connector ${isDone ? 'tl-connector--done' : ''}`}
                    style={isDone ? { borderColor: 'var(--ok)' } : {}}
                  />}
                </div>
                <div className="tl-body">
                  <div className="tl-time">{step.time}</div>
                  <div className="tl-title" style={isActive ? { color: 'var(--primary)', fontWeight: 600 } : {}}>
                    {stepLabel(step)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '8px 20px 24px', display: 'flex', gap: 10 }}>
        {!isLast && (
          <button
            onClick={advance}
            style={{
              flex: 1, padding: '13px 16px', background: 'var(--primary-weak)', color: 'var(--primary)',
              borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
            }}
          >
            Next step →
          </button>
        )}
        <button
          onClick={() => router.push('/home')}
          style={{
            flex: isLast ? 1 : undefined, padding: '13px 16px',
            background: isLast ? 'var(--primary)' : 'var(--surface-2)',
            color: isLast ? 'var(--primary-contrast)' : 'var(--text-3)',
            borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 600,
          }}
        >
          {isLast ? 'End trip' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
