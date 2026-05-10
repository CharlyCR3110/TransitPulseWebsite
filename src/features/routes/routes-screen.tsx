'use client';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { useLang } from '@/components/providers/lang-provider';
import { useRoutes } from '@/lib/hooks/use-routes';

export function RoutesScreen() {
  const { t, lang } = useLang();
  const router = useRouter();
  const { routes, loading, error } = useRoutes();

  return (
    <div className="screen screen-fade">
      <AppBar title={t('routes')} />

      <div className="hero">
        <h2 className="hero-greeting">{t('routes')}</h2>
        <p className="hero-sub">{t('routes_sub')}</p>
      </div>

      {loading && <div className="empty">{t('searching')}</div>}
      {error && (
        <div className="empty" style={{ color: 'var(--bad)' }}>{t('no_results')}</div>
      )}

      {!loading && !error && (
        <div className="section">
          <div className="stack">
            {routes.map((r) => {
              const name = lang === 'es' ? r.nameEs : r.nameEn;
              return (
                <button
                  key={r.id}
                  className="card--flat"
                  onClick={() => router.push(`/routes/${encodeURIComponent(r.id)}`)}
                  style={{ padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--r-sm)',
                      background: r.color || 'var(--primary-weak)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '0.02em',
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    {r.id}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.code}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{name}</div>
                    {r.operator && (
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {r.operator}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
                      ₡{r.fareCrc}
                    </div>
                    <Icon name="chevron" size={14} />
                  </div>
                </button>
              );
            })}
            {routes.length === 0 && (
              <div className="empty">{t('no_results')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
