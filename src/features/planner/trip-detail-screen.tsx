'use client';
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
import type { I18nKey } from '@/data/transit';
import type { BusStep } from '@/types/transit';

interface TripDetailScreenProps {
  tripId: string;
}

export function TripDetailScreen({ tripId }: TripDetailScreenProps) {
  const { t, lang } = useLang();
  const router = useRouter();
  const { trip, relatedAlerts: related, loading } = useTripDetail(tripId);

  if (loading || !trip) {
    return (
      <div className="screen screen-fade">
        <AppBar title="…" showBack />
        <div className="empty">{t('searching')}</div>
      </div>
    );
  }

  const confLabel: I18nKey = trip.confidence >= 0.9 ? 'reliable' : trip.confidence >= 0.8 ? 'moderate' : 'low';
  const arrivalTime = trip.steps[trip.steps.length - 1].time;
  const departTime = trip.steps[0].time;

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
        <MiniMap t={t} variant="trip" />
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
          {trip.steps.map((step, idx) => {
            const isLast = idx === trip.steps.length - 1;
            const isWalk = step.kind === 'walk';
            const isTransfer = step.kind === 'transfer';
            const nodeCls = isLast ? 'tl-node--end' : isWalk ? 'tl-node--walk' : isTransfer ? 'tl-node--transfer' : '';
            return (
              <div key={idx} className="tl-step">
                <div className="tl-rail">
                  <span className={`tl-node ${nodeCls}`} />
                  {!isLast && <span className={`tl-connector ${isWalk || isTransfer ? 'tl-connector--walk' : ''}`} />}
                </div>
                <div className="tl-body">
                  <div className="tl-time">{step.time}</div>
                  <div className="tl-title">
                    {isWalk && `${t('walk_to')} ${lang === 'es' ? (step as { toEs: string }).toEs : (step as { toEn: string }).toEn} · ${step.minutes} ${t('min')}`}
                    {isTransfer && `${t('transfer')} · ${step.minutes} ${t('min')}`}
                    {step.kind === 'bus' && `${lang === 'es' ? step.fromEs : step.fromEn} → ${lang === 'es' ? step.toEs : step.toEn}`}
                  </div>
                  {step.kind === 'bus' && (
                    <div className="tl-detail">
                      <RouteBadge route={step.route} kind="bus" />
                      <div className="tl-detail-text">
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                          {step.minutes} {t('min')} · {step.stops} {lang === 'es' ? 'paradas' : 'stops'}
                        </div>
                        <div className="tl-detail-extra">
                          <OccBars level={step.occ} t={t} />
                          <StatusChip status="ok" label={t('onTime')} />
                        </div>
                      </div>
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
                    <div className="alert-time">{al.time}</div>
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
