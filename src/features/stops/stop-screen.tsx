'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { LiveDot } from '@/components/transit/live-dot';
import { MiniMap } from '@/components/transit/mini-map';
import { ArrivalRow } from '@/components/transit/arrival-row';
import { useLang } from '@/components/providers/lang-provider';
import { useStopDetail } from './use-stop-detail';
import type { I18nKey } from '@/data/transit';

interface StopScreenProps {
  stopId: string;
}

export function StopScreen({ stopId }: StopScreenProps) {
  const { t, lang } = useLang();
  const { detail, loading } = useStopDetail(stopId);
  const router = useRouter();
  const [updatedSec, setUpdatedSec] = useState(3);

  useEffect(() => {
    const iv = setInterval(() => setUpdatedSec((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  if (loading || !detail) {
    return (
      <div className="screen screen-fade">
        <AppBar title={t('stop_code')} showBack />
        <div className="empty">{t('searching')}</div>
      </div>
    );
  }

  const { stop, arrivals } = detail;

  return (
    <div className="screen screen-fade">
      <AppBar title={t('stop_code')} showBack trailing={
        <>
          <button className="appbar-action"><Icon name="star" size={18} /></button>
          <button className="appbar-action"><Icon name="map" size={18} /></button>
        </>
      } />

      <div className="stop-hero">
        <h2 className="stop-name">{t(stop.nameKey as I18nKey)}</h2>
        <p className="stop-addr">{t(stop.addrKey as I18nKey)}</p>
        <div className="stop-meta-row">
          {stop.live && <LiveDot>{t('live')}</LiveDot>}
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {t('last_update')} {updatedSec}{t('seconds_ago')}
          </span>
          <span className="spacer" />
          <span className="chip chip--neutral"><span className="chip-dot" />{stop.dist} m</span>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <MiniMap t={t} variant="home" />
      </div>

      <div className="section">
        <div className="section-head">
          <span className="section-title">{t('next_departures')}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            {arrivals.length} {lang === 'es' ? 'rutas' : 'routes'}
          </span>
        </div>
        <div className="card--flat">
          {arrivals.map((a) => (
            <ArrivalRow key={a.id} a={a} t={t} lang={lang} onClick={() => router.push('/planner/r1')} />
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', fontSize: 11, color: 'var(--text-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
        {t('data_updated').toUpperCase()}
      </div>
    </div>
  );
}
