'use client';
import Link from 'next/link';
import { Icon } from '@/components/ui/icons';
import { useStops } from '@/lib/hooks/use-stops';
import { useLang } from '@/components/providers/lang-provider';
import { useAuth } from '@/components/providers/auth-provider';
import type { I18nKey } from '@/data/transit';
import { useUserStats } from './use-user-stats';

export function ProfileScreen() {
  const { t, lang } = useLang();
  const { status, user, logout } = useAuth();
  const { stops } = useStops();
  const { stats, loading: statsLoading } = useUserStats();

  const greeting =
    status === 'authenticated' && user
      ? user.displayName
      : status === 'loading'
        ? lang === 'es' ? 'Cargando…' : 'Loading…'
        : lang === 'es' ? 'Invitado' : 'Guest';

  const subline =
    status === 'authenticated' && user
      ? user.email
      : lang === 'es' ? 'Inicia sesión para guardar viajes y reportar' : 'Sign in to save trips and report';

  const tripsLabel = lang === 'es' ? 'Viajes' : 'Trips';
  const tripsValue =
    status !== 'authenticated' ? '—' : statsLoading || stats === undefined ? '…' : String(stats.trips);

  return (
    <div className="screen screen-fade">
      <div className="hero">
        <div className="hero-brand">
          <div className="wordmark">Transit<em>Pulse</em></div>
        </div>
        <h2 className="hero-greeting">{greeting}</h2>
        <p className="hero-sub">{subline}</p>
        {status === 'unauthenticated' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Link href="/login" className="btn--primary" style={{ padding: '10px 14px', borderRadius: 'var(--r-sm)' }}>
              {lang === 'es' ? 'Iniciar sesión' : 'Sign in'}
            </Link>
            <Link href="/register" style={{ padding: '10px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)' }}>
              {lang === 'es' ? 'Crear cuenta' : 'Register'}
            </Link>
          </div>
        )}
        {status === 'authenticated' && (
          <button
            onClick={logout}
            style={{ marginTop: 12, padding: '8px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'transparent', color: 'var(--text-2)', fontSize: 13 }}
          >
            {lang === 'es' ? 'Cerrar sesión' : 'Sign out'}
          </button>
        )}
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('favorites')}</span>
        </div>
        <div className="stack">
          {stops.slice(0, 2).map((s) => (
            <div key={s.id} className="card--flat" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--warn-weak)', color: 'var(--warn-ink)', display: 'grid', placeItems: 'center' }}>
                <Icon name="star" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{(lang === 'es' ? s.labelEs : s.labelEn) ?? t(s.nameKey as I18nKey)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{(lang === 'es' ? s.addrEs : s.addrEn) ?? t(s.addrKey as I18nKey)}</div>
              </div>
              <Icon name="chevron" size={16} />
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('this_month')}</span>
        </div>
        <div className="card--flat" style={{ padding: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{tripsValue}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{tripsLabel}</div>
        </div>
      </div>
    </div>
  );
}
