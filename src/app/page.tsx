'use client';
import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { HomeScreen } from '@/features/home/home-screen';
import { PlannerScreen } from '@/features/planner/planner-screen';
import { TripDetailScreen } from '@/features/planner/trip-detail-screen';
import { AlertsScreen } from '@/features/alerts/alerts-screen';
import { StopScreen } from '@/features/stops/stop-screen';
import { ProfileScreen } from '@/features/profile/profile-screen';
import { INITIAL_ARRIVALS, ALERTS, useT } from '@/data/transit';
import type { Arrival } from '@/types/transit';
import type { Lang, Theme, Screen } from '@/types/transit';

type TabId = 'home' | 'plan' | 'alerts' | 'profile';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Lang>('es');
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tab, setTab] = useState<TabId>('home');
  const [stack, setStack] = useState<Screen[]>([{ screen: 'home' }]);
  const [arrivals, setArrivals] = useState<Arrival[]>(INITIAL_ARRIVALS);

  const t = useT(lang);
  const top = stack[stack.length - 1];

  useEffect(() => {
    const iv = setInterval(() => {
      setArrivals((prev) =>
        prev.map((a) => ({ ...a, etaSec: a.etaSec > 0 ? Math.max(0, a.etaSec - 1) : 1800 }))
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navigate = (screen: Screen) => setStack((s) => [...s, screen]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  const selectTab = (id: TabId) => {
    setTab(id);
    const screens: Record<TabId, Screen> = {
      home: { screen: 'home' },
      plan: { screen: 'planner' },
      alerts: { screen: 'alerts' },
      profile: { screen: 'profile' },
    };
    setStack([screens[id]]);
  };

  const alertsCount = ALERTS.filter((a) => a.severity !== 'ok').length;

  let screenEl: React.ReactNode;
  switch (top.screen) {
    case 'home':
      screenEl = (
        <HomeScreen t={t} lang={lang} arrivals={arrivals} alertsCount={alertsCount}
          onOpenStop={(id) => navigate({ screen: 'stop', stopId: id })}
          onOpenAlerts={() => selectTab('alerts')}
          onOpenPlanner={() => selectTab('plan')} />
      );
      break;
    case 'planner':
      screenEl = (
        <PlannerScreen t={t} lang={lang}
          onOpenDetail={(id) => navigate({ screen: 'tripDetail', tripId: id })}
          onBack={stack.length > 1 ? back : undefined} />
      );
      break;
    case 'tripDetail':
      screenEl = (
        <TripDetailScreen t={t} lang={lang} tripId={top.tripId}
          onBack={back} onOpenAlerts={() => selectTab('alerts')} />
      );
      break;
    case 'alerts':
      screenEl = (
        <AlertsScreen t={t} lang={lang} onBack={stack.length > 1 ? back : undefined} />
      );
      break;
    case 'stop':
      screenEl = (
        <StopScreen t={t} lang={lang} stopId={top.stopId} arrivals={arrivals}
          onBack={back} onOpenDetail={(id) => navigate({ screen: 'tripDetail', tripId: id })} />
      );
      break;
    case 'profile':
      screenEl = <ProfileScreen t={t} lang={lang} />;
      break;
    default:
      screenEl = <div className="empty">404</div>;
  }

  const screenKey = top.screen + ('tripId' in top ? top.tripId : '') + ('stopId' in top ? top.stopId : '');

  return (
    <>
      <div className="viewport-wrap">
        <div className="viewport" key={screenKey}>
          {screenEl}
          <BottomNav tab={tab} onTab={selectTab} t={t} />
        </div>
      </div>

      {tweaksOpen && (
        <div className="tweaks">
          <p className="tweaks-title">{t('tweaks')}</p>
          <div className="tweak-row">
            <span>{t('theme')}</span>
            <div className="seg">
              <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>{t('light')}</button>
              <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>{t('dark')}</button>
            </div>
          </div>
          <div className="tweak-row">
            <span>{t('language')}</span>
            <div className="seg">
              <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setTweaksOpen((o) => !o)}
        style={{
          position: 'fixed', bottom: 20, left: 20,
          width: 40, height: 40,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-pill)', display: 'grid', placeItems: 'center',
          boxShadow: 'var(--shadow-md)', color: 'var(--text-2)', zIndex: 200,
        }}
        aria-label="Settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      </button>
    </>
  );
}
