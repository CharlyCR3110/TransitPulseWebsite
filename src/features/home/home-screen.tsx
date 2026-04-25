'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import { LiveDot } from '@/components/transit/live-dot';
import { ArrivalRow } from '@/components/transit/arrival-row';
import { MiniMap } from '@/components/transit/mini-map';
import { useLang } from '@/components/providers/lang-provider';
import { useStops } from '@/lib/hooks/use-stops';
import { useArrivals } from '@/lib/hooks/use-arrivals';
import { useAlerts } from '@/features/alerts/use-alerts';
import type { I18nKey } from '@/data/transit';

export function HomeScreen() {
  const { t, lang } = useLang();
  const { arrivals } = useArrivals();
  const { alerts, alertsCount } = useAlerts();
  const { stops: nearbyStops } = useStops();
  const router = useRouter();

  const hour = new Date().getHours();
  const gKey: I18nKey = hour < 12 ? 'greeting_morning' : hour < 19 ? 'greeting_afternoon' : 'greeting_evening';
  const topAlert = alerts.find((alert) => alert.severity !== 'ok') ?? alerts[0];
  const firstStopId = nearbyStops[0]?.id;

  function openStopForRoute(route: string) {
    const stop = nearbyStops.find((candidate) => candidate.routes.includes(route));
    if (stop) router.push(`/stops/${stop.id}`);
  }

  return (
    <div className="screen screen-fade">
      <div className="hero">
        <div className="hero-brand">
          <div className="wordmark">Transit<em>Pulse</em></div>
          <LiveDot>{t('live')}</LiveDot>
        </div>
        <h2 className="hero-greeting">{t(gKey)}</h2>
        <p className="hero-sub">{t('sub_home')}</p>
      </div>

      <div style={{ padding: '16px 0 4px' }}>
        <button className="search-box" onClick={() => router.push('/planner')}>
          <Icon name="search" size={18} />
          <span style={{ flex: 1 }}>{t('plan_trip')}</span>
          <span className="chip chip--primary" style={{ fontSize: 10 }}>{t('plan')}</span>
        </button>
      </div>

      {alertsCount > 0 && (
        <div style={{ padding: '12px 0 4px' }}>
          <button
            onClick={() => router.push('/alerts')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              background: 'var(--bad-weak)',
              border: '1px solid color-mix(in oklab, var(--bad) 30%, transparent)',
              borderRadius: 'var(--r-md)', textAlign: 'left', color: 'var(--bad-ink)',
            }}
          >
            <Icon name="alert" size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{alertsCount} {t('active_alerts').toLowerCase()}</div>
              {topAlert && <div style={{ fontSize: 12, opacity: 0.85 }}>{t(topAlert.titleKey as I18nKey)}</div>}
            </div>
            <Icon name="chevron" size={18} />
          </button>
        </div>
      )}

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('nearby')}</span>
        </div>
        <MiniMap t={t} variant="home" />
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('next_departures')}</span>
          <button className="section-link" onClick={() => firstStopId && router.push(`/stops/${firstStopId}`)}>{t('view_all')}</button>
        </div>
        <div className="card--flat">
          {arrivals.slice(0, 4).map((a) => (
            <ArrivalRow key={a.id} a={a} t={t} lang={lang} onClick={() => openStopForRoute(a.route)} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
          <span>{nearbyStops[0] ? t(nearbyStops[0].nameKey as I18nKey).toUpperCase() : '...'}</span>
          <span>{nearbyStops[0] ? `${nearbyStops[0].dist} m` : '...'}</span>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('nearby_stops')}</span>
        </div>
        <div className="stack">
          {nearbyStops.map((s) => (
            <button key={s.id} className="card--flat" onClick={() => router.push(`/stops/${s.id}`)} style={{ padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'var(--primary-weak)', color: 'var(--primary-strong)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="pin" size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}>{t(s.nameKey as I18nKey)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{t(s.addrKey as I18nKey)}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                  {s.routes.slice(0, 4).map((r) => (
                    <span key={r} className="alert-route-pill">{r}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {s.dist < 1000 ? `${s.dist} m` : `${(s.dist / 1000).toFixed(1)} km`}
                </div>
                {s.live && <LiveDot>{t('live')}</LiveDot>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
