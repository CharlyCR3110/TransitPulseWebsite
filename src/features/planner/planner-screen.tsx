'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { OccBars } from '@/components/transit/occ-bars';
import { StatusChip } from '@/components/transit/status-chip';
import { useLang } from '@/components/providers/lang-provider';
import { useTripOptions } from '@/lib/hooks/use-trip-options';
import type { I18nKey } from '@/data/transit';

export function PlannerScreen() {
  const { t } = useLang();
  const tripOptions = useTripOptions();
  const router = useRouter();
  const [sort, setSort] = useState<'fastest' | 'cheapest' | 'fewest'>('fastest');
  const [from, setFrom] = useState('San Pedro · UCR');
  const [to, setTo] = useState('Multiplaza Escazú');
  const [searching, setSearching] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...tripOptions];
    if (sort === 'fastest') arr.sort((a, b) => a.minutes - b.minutes);
    if (sort === 'cheapest') arr.sort((a, b) => a.price - b.price);
    if (sort === 'fewest') arr.sort((a, b) => a.transfers - b.transfers || a.minutes - b.minutes);
    return arr;
  }, [tripOptions, sort]);

  const swap = () => { setFrom(to); setTo(from); };
  const runSearch = () => { setSearching(true); setTimeout(() => setSearching(false), 700); };

  const sortTabs: { id: 'fastest' | 'cheapest' | 'fewest'; labelKey: I18nKey }[] = [
    { id: 'fastest', labelKey: 'fastest' },
    { id: 'cheapest', labelKey: 'cheapest' },
    { id: 'fewest', labelKey: 'fewest' },
  ];

  return (
    <div className="screen screen-fade">
      <AppBar title={t('plan_trip')} showBack />

      <div style={{ padding: '0 20px 12px', position: 'relative' }}>
        <div className="planner-fields">
          <div className="planner-field">
            <span className="planner-dot planner-dot--from" />
            <input className="planner-input" value={from} onChange={(e) => setFrom(e.target.value)} placeholder={t('current_location')} />
            <span className="planner-line" />
          </div>
          <div className="planner-field">
            <span className="planner-dot planner-dot--to" />
            <input className="planner-input" value={to} onChange={(e) => setTo(e.target.value)} placeholder={t('destination')} />
          </div>
          <button className="planner-swap" onClick={swap} aria-label="Swap"><Icon name="swap" size={16} /></button>
        </div>
      </div>

      <div style={{ padding: '8px 20px 14px' }}>
        <div className="sort-tabs">
          {sortTabs.map((st) => (
            <button key={st.id} className={`sort-tab ${sort === st.id ? 'active' : ''}`}
              onClick={() => { setSort(st.id); runSearch(); }}>
              {t(st.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }} className="stack">
        {searching ? (
          <div className="empty">{t('searching')}</div>
        ) : sorted.map((opt, i) => {
          const isBest = i === 0;
          const flagKey: I18nKey = sort === 'fastest' ? 'fastest' : sort === 'cheapest' ? 'cheapest' : 'fewest';
          return (
            <div key={opt.id} className={`route-opt ${isBest ? 'best' : ''}`} onClick={() => router.push(`/planner/${opt.id}`)}>
              {isBest && <span className="route-opt-flag">{t(flagKey)}</span>}
              <div className="route-opt-head">
                <div>
                  <span className="route-opt-time">{opt.minutes}<small>{t('min')}</small></span>
                  <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-3)' }}>
                    {t('leaves')} <span style={{ color: 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{opt.leaveIn} {t('min')}</span>
                  </span>
                </div>
                <div className="route-opt-price">₡{opt.price}</div>
              </div>
              <div className="route-opt-chain">
                {opt.steps.map((step, idx) => (
                  <span key={idx} style={{ display: 'contents' }}>
                    {step.kind === 'walk' && (
                      <span className="chain-node chain-node--walk">
                        <Icon name="walk" size={11} stroke={2} /> {step.minutes}
                      </span>
                    )}
                    {step.kind === 'bus' && (
                      <span className={`chain-node ${isBest && idx === 1 ? 'chain-node--primary' : ''}`}>{step.route}</span>
                    )}
                    {step.kind === 'transfer' && (
                      <span className="chain-node chain-node--walk">
                        <Icon name="swap" size={11} stroke={2} />
                      </span>
                    )}
                    {idx < opt.steps.length - 1 && <span className="chain-arrow">›</span>}
                  </span>
                ))}
              </div>
              <div className="route-opt-foot">
                <div className="route-opt-foot-left">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="walk" size={12} stroke={2} /> {opt.walkMin} {t('min')}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="swap" size={12} stroke={2} /> {opt.transfers} {opt.transfers === 1 ? t('transfer') : t('transfers')}
                  </span>
                  <OccBars level={opt.occupancy} t={t} />
                </div>
                <StatusChip status={opt.confidence >= 0.9 ? 'ok' : opt.confidence >= 0.8 ? 'warn' : 'bad'} label={`${Math.round(opt.confidence * 100)}%`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
