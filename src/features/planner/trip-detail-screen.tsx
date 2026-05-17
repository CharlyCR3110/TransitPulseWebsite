'use client';

import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { MiniMap } from '@/components/transit/mini-map';
import { RouteBadge } from '@/components/transit/route-badge';
import { OccBars } from '@/components/transit/occ-bars';
import { StatusChip } from '@/components/transit/status-chip';
import { useLang } from '@/components/providers/lang-provider';
import { useTripDetail } from './use-trip-detail';
import { formatEmittedAt } from '@/features/alerts/format-emitted-at';
import type { I18nKey } from '@/data/transit';
import type { BusStep, TripStep, WalkStep } from '@/types/transit';

interface TripDetailScreenProps {
  tripId: string;
  departureAt?: string;
}

function clock(value?: string | null, locale = 'es-CR') {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

function meters(value?: number) {
  if (!value || value <= 0) return '0 m';
  if (value < 1000) return `${Math.round(value)} m`;
  return `${(value / 1000).toFixed(1)} km`;
}

function stepName(step: Pick<WalkStep, 'toEs' | 'toEn'>, lang: 'es' | 'en') {
  return lang === 'es' ? step.toEs : step.toEn;
}

function busName(step: BusStep, lang: 'es' | 'en') {
  return lang === 'es'
    ? step.routeLongNameEs || step.fromEs
    : step.routeLongNameEn || step.fromEn;
}

function firstBus(steps: TripStep[]) {
  return steps.find((s): s is BusStep => s.kind === 'bus') ?? null;
}

function lastWalk(steps: TripStep[]) {
  const walkSteps = steps.filter((s): s is WalkStep => s.kind === 'walk');
  return walkSteps[walkSteps.length - 1] ?? null;
}

function shiftIso(anchor: string | undefined | null, minutes: number) {
  const base = anchor ? new Date(anchor) : new Date();
  if (Number.isNaN(base.getTime())) return new Date(Date.now() + minutes * 60_000).toISOString();
  return new Date(base.getTime() + minutes * 60_000).toISOString();
}

export function TripDetailScreen({ tripId, departureAt }: TripDetailScreenProps) {
  const { t, lang } = useLang();
  const router = useRouter();
  const { trip, relatedAlerts: related, loading, error } = useTripDetail(tripId, departureAt);
  const locale = lang === 'es' ? 'es-CR' : 'en-US';

  if (loading) {
    return (
      <div className="screen screen-fade">
        <AppBar title="..." showBack />
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

  const bus = firstBus(trip.steps);
  const finalWalk = lastWalk(trip.steps);
  const departureTime = clock(trip.departureAt ?? trip.steps[0]?.startsAt, locale) ?? trip.steps[0]?.time;
  const arrivalTime = clock(trip.arrivalAt ?? trip.steps[trip.steps.length - 1]?.endsAt, locale) ?? trip.steps[trip.steps.length - 1]?.time;
  const startLabel = trip.steps[0]?.kind === 'walk'
    ? (lang === 'es' ? trip.steps[0].fromEs || trip.steps[0].toEs : trip.steps[0].fromEn || trip.steps[0].toEn)
    : bus ? (lang === 'es' ? bus.fromEs : bus.fromEn) : t('from');
  const destinationLabel = finalWalk ? stepName(finalWalk, lang) : bus ? (lang === 'es' ? bus.toEs : bus.toEn) : t('destination');
  const pagerAnchor = departureAt ?? trip.departureAt ?? trip.steps[0]?.startsAt ?? new Date().toISOString();
  const goToShift = (minutes: number) => {
    const next = shiftIso(pagerAnchor, minutes);
    router.push(`/planner/${encodeURIComponent(tripId)}?departureAt=${encodeURIComponent(next)}`);
  };

  return (
    <div className="screen screen-fade itinerary-screen">
      <AppBar
        title={lang === 'es' ? 'Itinerario' : 'Itinerary'}
        showBack
        trailing={
          <>
            <button className="appbar-action" aria-label={t('refresh')}><Icon name="refresh" size={18} /></button>
            <button className="appbar-action" aria-label={t('star')}><Icon name="star" size={18} /></button>
          </>
        }
      />

      <section className="itinerary-hero">
        <div>
          <div className="itinerary-kicker">{lang === 'es' ? 'Itinerario' : 'Itinerary'}</div>
          <div className="itinerary-duration">{trip.minutes} {t('min')}</div>
          <div className="itinerary-window">{departureTime} - {arrivalTime}</div>
        </div>
        <div className="itinerary-cost">₡{trip.price}</div>
      </section>

      <div className="itinerary-pager">
        <button type="button" onClick={() => goToShift(-30)}><Icon name="back" size={16} />{lang === 'es' ? 'Antes' : 'Earlier'}</button>
        <button type="button" onClick={() => goToShift(30)}>{lang === 'es' ? 'Después' : 'Later'}<Icon name="chevron" size={16} /></button>
      </div>

      <div className="itinerary-map">
        <MiniMap t={t} variant="trip" fallbackCenter={{ lat: 9.9343, lng: -84.0508 }} />
      </div>

      <div className="itinerary-list">
        <AnchorSection
          icon="pin"
          title={lang === 'es' ? 'Salir desde' : 'Start from'}
          label={startLabel}
          meta={`${t('leaves')} ${departureTime}`}
        />

        {trip.steps.map((step, idx) => {
          if (step.kind === 'walk') {
            return (
              <WalkSection
                key={`walk-${idx}`}
                step={step}
                lang={lang}
                locale={locale}
              />
            );
          }
          if (step.kind === 'transfer') {
            return (
              <SimpleSection
                key={`transfer-${idx}`}
                icon="route"
                title={t('transfer')}
                label={stepName(step, lang)}
                meta={`${step.minutes} ${t('min')} · ${clock(step.startsAt, locale) ?? step.time}`}
              />
            );
          }
          return <BusSection key={`bus-${idx}`} step={step} lang={lang} locale={locale} t={t} />;
        })}

        <AnchorSection
          icon="pin"
          title={t('destination')}
          label={destinationLabel}
          meta={`${t('arrive')} ${arrivalTime}`}
        />
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

      <div className="itinerary-actions">
        <button onClick={() => router.push(`/trip/active?tripId=${tripId}`)}>
          {t('start_trip')}
        </button>
      </div>
    </div>
  );
}

function AnchorSection({ icon, title, label, meta }: { icon: string; title: string; label: string; meta: string }) {
  return (
    <section className="itinerary-section itinerary-section--anchor">
      <div className="itinerary-section-icon"><Icon name={icon} size={18} /></div>
      <div className="itinerary-section-body">
        <div className="itinerary-section-title">{title}</div>
        <div className="itinerary-section-label">{label}</div>
        <div className="itinerary-section-meta">{meta}</div>
      </div>
    </section>
  );
}

function SimpleSection({ icon, title, label, meta }: { icon: string; title: string; label: string; meta: string }) {
  return (
    <section className="itinerary-section">
      <div className="itinerary-section-icon"><Icon name={icon} size={18} /></div>
      <div className="itinerary-section-body">
        <div className="itinerary-section-title">{title}</div>
        <div className="itinerary-section-label">{label}</div>
        <div className="itinerary-section-meta">{meta}</div>
      </div>
    </section>
  );
}

function WalkSection({ step, lang, locale }: { step: WalkStep; lang: 'es' | 'en'; locale: string }) {
  const title = lang === 'es' ? 'Caminar a' : 'Walk to';
  const time = clock(step.startsAt, locale) ?? step.time;
  return (
    <section className="itinerary-section itinerary-section--walk">
      <div className="itinerary-section-icon"><Icon name="walk" size={18} /></div>
      <div className="itinerary-section-body">
        <div className="itinerary-section-title">{title}</div>
        <div className="itinerary-section-label">{stepName(step, lang)}</div>
        <div className="itinerary-section-meta">
          {meters(step.distanceMeters)} · {step.minutes} min · {time}
        </div>
      </div>
    </section>
  );
}

function BusSection({ step, lang, locale, t }: { step: BusStep; lang: 'es' | 'en'; locale: string; t: (key: I18nKey) => string }) {
  const boardName = lang === 'es' ? step.fromEs : step.fromEn;
  const alightName = lang === 'es' ? step.toEs : step.toEn;
  const departures = (step.nextDepartures ?? []).slice(0, 5);
  return (
    <>
      <section className="itinerary-section itinerary-section--wait">
        <div className="itinerary-section-icon"><Icon name="clock" size={18} /></div>
        <div className="itinerary-section-body">
          <div className="itinerary-section-title">{lang === 'es' ? 'Esperar' : 'Wait for'}</div>
          <div className="itinerary-route-head">
            <RouteBadge route={step.route} kind="bus" />
            <span>{busName(step, lang)}</span>
          </div>
          <div className="itinerary-section-label">{boardName}</div>
          {departures.length > 0 && (
            <div className="itinerary-departures">
              {departures.map((d) => (
                <span key={d.predictedDeparture}>{clock(d.predictedDeparture, locale)}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="itinerary-section itinerary-section--ride">
        <div className="itinerary-section-icon"><Icon name="bus" size={18} /></div>
        <div className="itinerary-section-body">
          <div className="itinerary-section-title">{lang === 'es' ? 'Viajar' : 'Ride'}</div>
          <div className="itinerary-section-label">
            {step.route} · {step.stops} {lang === 'es' ? 'paradas' : 'stops'} · {step.minutes} min
          </div>
          <div className="itinerary-ride-extra">
            <OccBars level={step.occ} t={t} />
            <StatusChip status="ok" label={lang === 'es' ? 'A tiempo' : 'On time'} />
          </div>
          <div className="itinerary-stops">
            {(step.legStops ?? []).map((stop) => {
              const name = lang === 'es' ? stop.nameEs : stop.nameEn;
              const stopTime = step.startsAt
                ? clock(new Date(new Date(step.startsAt).getTime() + stop.offsetFromBoardingMin * 60_000).toISOString(), locale)
                : stop.isBoarding
                  ? clock(step.startsAt, locale)
                  : `+${stop.offsetFromBoardingMin} min`;
              return (
                <div key={`${step.route}-${stop.stopId}-${stop.sequence}`} className={`itinerary-stop ${stop.isBoarding || stop.isAlighting ? 'itinerary-stop--major' : ''}`}>
                  <span className="itinerary-stop-dot" />
                  <span className="itinerary-stop-name">{name}</span>
                  <span className="itinerary-stop-time">
                    {stop.isBoarding ? (lang === 'es' ? 'Abordar' : 'Board') : stop.isAlighting ? (lang === 'es' ? 'Bajar' : 'Alight') : stopTime}
                  </span>
                </div>
              );
            })}
            {(step.legStops ?? []).length === 0 && (
              <div className="itinerary-stop itinerary-stop--major">
                <span className="itinerary-stop-dot" />
                <span className="itinerary-stop-name">{boardName} - {alightName}</span>
                <span className="itinerary-stop-time">{step.minutes} min</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
