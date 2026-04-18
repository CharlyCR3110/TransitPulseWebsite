'use client';
import { Icon } from '@/components/ui/icons';
import { NEARBY_STOPS } from '@/data/transit';
import type { I18nKey } from '@/data/transit';

interface ProfileScreenProps {
  t: (key: I18nKey) => string;
  lang: 'es' | 'en';
}

export function ProfileScreen({ t, lang }: ProfileScreenProps) {
  const stats = [
    { v: '42', lEs: 'Viajes', lEn: 'Trips' },
    { v: '18h', lEs: 'En transporte', lEn: 'On transit' },
    { v: '₡24k', lEs: 'Gastado', lEn: 'Spent' },
    { v: '94%', lEs: 'A tiempo', lEn: 'On time' },
  ];

  return (
    <div className="screen screen-fade">
      <div className="hero">
        <div className="hero-brand">
          <div className="wordmark">Transit<em>Pulse</em></div>
        </div>
        <h2 className="hero-greeting">Ana Castro</h2>
        <p className="hero-sub">{lang === 'es' ? 'Commuter · San Pedro' : 'Commuter · San Pedro'}</p>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{lang === 'es' ? 'Favoritos' : 'Favorites'}</span>
        </div>
        <div className="stack">
          {NEARBY_STOPS.slice(0, 2).map((s) => (
            <div key={s.id} className="card--flat" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--warn-weak)', color: 'var(--warn-ink)', display: 'grid', placeItems: 'center' }}>
                <Icon name="star" size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t(s.nameKey as I18nKey)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t(s.addrKey as I18nKey)}</div>
              </div>
              <Icon name="chevron" size={16} />
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{lang === 'es' ? 'Este mes' : 'This month'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map((x) => (
            <div key={x.lEn} className="card--flat" style={{ padding: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{x.v}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{lang === 'es' ? x.lEs : x.lEn}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
