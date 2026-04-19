'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from './bottom-nav';
import { Icon } from '@/components/ui/icons';
import { useTheme } from '@/components/providers/theme-provider';
import { useLang } from '@/components/providers/lang-provider';

type TabId = 'home' | 'plan' | 'alerts' | 'profile';

const TAB_ROUTES: Record<TabId, string> = {
  home: '/home',
  plan: '/planner',
  alerts: '/alerts',
  profile: '/profile',
};

function pathToTab(pathname: string): TabId {
  if (pathname.startsWith('/planner')) return 'plan';
  if (pathname.startsWith('/alerts')) return 'alerts';
  if (pathname.startsWith('/profile')) return 'profile';
  return 'home';
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const tab = pathToTab(pathname);

  return (
    <>
      <header className="topbar">
        <div className="topbar-logo">
          Transit<em>Pulse</em>
        </div>
        <nav className="topbar-nav">
          {(Object.keys(TAB_ROUTES) as TabId[]).map((id) => {
            const labelKey = id === 'plan' ? 'plan' : id === 'alerts' ? 'alerts' : id === 'profile' ? 'profile' : 'home';
            return (
              <button
                key={id}
                className={`bnav-item ${tab === id ? 'active' : ''}`}
                onClick={() => router.push(TAB_ROUTES[id])}
                style={{ padding: '6px 12px', gap: 4, display: 'flex', flexDirection: 'column' }}
              >
                {t(labelKey)}
              </button>
            );
          })}
        </nav>
        <button className="topbar-action" onClick={() => setTweaksOpen((o) => !o)} aria-label="Settings">
          <Icon name="settings" size={18} />
        </button>
      </header>

      <main className="page-content">{children}</main>

      <BottomNav />

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
    </>
  );
}
