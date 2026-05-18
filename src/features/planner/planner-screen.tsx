'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { Icon } from '@/components/ui/icons';
import { OccBars } from '@/components/transit/occ-bars';
import { StatusChip } from '@/components/transit/status-chip';
import { useLang } from '@/components/providers/lang-provider';
import { usePlannerSearch } from './use-planner-search';
import type { I18nKey } from '@/data/transit';

interface PlannerScreenProps {
  initialFrom?: string;
  initialTo?: string;
}

const SUGGESTED_DESTINATIONS = [
  'San José Centro',
  'Heredia',
  'UNA',
  'Multiplaza',
];

export function PlannerScreen({ initialFrom, initialTo }: PlannerScreenProps) {
  const { t } = useLang();
  const router = useRouter();
  const [sort, setSort] = useState<'fastest' | 'cheapest' | 'fewest'>('fastest');
  const [from, setFrom] = useState(initialFrom ?? '');
  const [to, setTo] = useState(initialTo ?? '');
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState<I18nKey | null>(null);

  const { results: sorted, loading: searching, refresh } = usePlannerSearch(from, to, sort);

  const swap = () => { setFrom(to); setTo(from); };
  const runSearch = () => { refresh(); };
  const pickSuggestion = (suggestion: string) => { setTo(suggestion); };
  const hasSearched = from.trim().length > 0 && to.trim().length > 0;
  const showSuggestions = !to.trim();

  const useMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('gps_unavailable');
      return;
    }
    setLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFrom(`${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGpsError(err.code === err.PERMISSION_DENIED ? 'gps_denied' : 'gps_unavailable');
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 },
    );
  };

  const sortTabs: { id: 'fastest' | 'cheapest' | 'fewest'; labelKey: I18nKey }[] = [
    { id: 'fastest', labelKey: 'fastest' },
    { id: 'cheapest', labelKey: 'cheapest' },
    { id: 'fewest', labelKey: 'fewest' },
  ];

  return (
    <div className="screen screen-fade">
      <AppBar title={t('plan_trip')} showBack />

      <p className="planner-subtitle">{t('planner_subtitle')}</p>

      <div style={{ padding: '0 20px 12px', position: 'relative' }}>
        <div className="planner-fields">
          <div className="planner-field">
            <span className="planner-dot planner-dot--from" />
            <input className="planner-input" value={locating ? t('locating') : from} onChange={(e) => setFrom(e.target.value)} placeholder={t('from_placeholder')} disabled={locating} />
            <button
              type="button"
              className="planner-gps"
              onClick={useMyLocation}
              disabled={locating}
              aria-label={t('use_my_location')}
              title={t('use_my_location')}
            >
              <Icon name="pin" size={16} />
            </button>
            <span className="planner-line" />
          </div>
          <div className="planner-field">
            <span className="planner-dot planner-dot--to" />
            <input className="planner-input" value={to} onChange={(e) => setTo(e.target.value)} placeholder={t('to_placeholder')} />
          </div>
          <button className="planner-swap" onClick={swap} aria-label="Swap"><Icon name="swap" size={16} /></button>
        </div>
        {gpsError && (
          <div className="planner-gps-error" role="status">{t(gpsError)}</div>
        )}
      </div>

      {showSuggestions && (
        <div className="planner-suggestions">
          <span className="planner-suggestions-label">{t('try_these')}</span>
          {SUGGESTED_DESTINATIONS.map((dest) => (
            <button
              key={dest}
              type="button"
              className="planner-suggestion-chip"
              onClick={() => pickSuggestion(dest)}
            >
              {dest}
            </button>
          ))}
        </div>
      )}

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
        ) : hasSearched && sorted.length === 0 ? (
          <div className="planner-empty-results">
            <div className="planner-empty-results-title">{t('empty_results_title')}</div>
            <div className="planner-empty-results-hint">{t('empty_results_hint')}</div>
          </div>
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
