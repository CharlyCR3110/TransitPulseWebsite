'use client';
import { useState, useMemo } from 'react';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { useLang } from '@/components/providers/lang-provider';
import { useAlerts } from './use-alerts';
import type { I18nKey } from '@/data/transit';

type FilterId = 'all' | 'critical' | 'warn' | 'info';

export function AlertsScreen() {
  const { t } = useLang();
  const { alerts } = useAlerts();
  const [filter, setFilter] = useState<FilterId>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((a) => {
      if (filter === 'critical') return a.severity === 'bad';
      if (filter === 'warn') return a.severity === 'warn';
      if (filter === 'info') return a.severity === 'ok';
      return true;
    });
  }, [alerts, filter]);

  const count = (sev: string) => alerts.filter((a) => a.severity === sev).length;

  const filters: { id: FilterId; labelKey: I18nKey }[] = [
    { id: 'all', labelKey: 'filter_all' },
    { id: 'critical', labelKey: 'filter_critical' },
    { id: 'warn', labelKey: 'filter_warn' },
    { id: 'info', labelKey: 'filter_info' },
  ];

  return (
    <div className="screen screen-fade">
      <AppBar title={t('alerts')} showBack trailing={
        <button className="appbar-action"><Icon name="filter" size={18} /></button>
      } />

      <div style={{ padding: '0 20px 12px' }}>
        <p style={{ margin: '0 0 12px', color: 'var(--text-2)', fontSize: 13 }}>{t('alerts_sub')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {([{ sev: 'bad', labelKey: 'filter_critical' }, { sev: 'warn', labelKey: 'filter_warn' }, { sev: 'ok', labelKey: 'filter_info' }] as { sev: string; labelKey: I18nKey }[]).map((x) => (
            <div key={x.sev} style={{
              padding: '10px 12px', borderRadius: 'var(--r-sm)',
              background: x.sev === 'bad' ? 'var(--bad-weak)' : x.sev === 'warn' ? 'var(--warn-weak)' : 'var(--ok-weak)',
              color: x.sev === 'bad' ? 'var(--bad-ink)' : x.sev === 'warn' ? 'var(--warn-ink)' : 'var(--ok-ink)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{count(x.sev)}</div>
              <div style={{ fontSize: 11, fontWeight: 500, marginTop: 4, opacity: 0.85 }}>{t(x.labelKey)}</div>
            </div>
          ))}
        </div>

        <div className="sort-tabs" style={{ padding: 0, marginBottom: 14 }}>
          {filters.map((f) => (
            <button key={f.id} className={`sort-tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="stack">
          {filtered.length === 0 && <div className="empty">{t('no_alerts')}</div>}
          {filtered.map((al) => (
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
                <div className="alert-routes">
                  {al.routes.map((r) => (
                    <span key={r} className="alert-route-pill">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
