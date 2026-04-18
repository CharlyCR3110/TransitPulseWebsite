import type { Arrival } from '@/types/transit';
import type { I18nKey } from '@/data/transit';
import { RouteBadge } from './route-badge';

interface ArrivalRowProps {
  a: Arrival;
  t: (key: I18nKey) => string;
  lang: 'es' | 'en';
  onClick?: () => void;
}

function formatEta(sec: number, t: (key: I18nKey) => string) {
  if (sec <= 45) return { num: t('now'), unit: '', cls: '' };
  const min = Math.round(sec / 60);
  return { num: String(min), unit: t('min'), cls: '' };
}

export function ArrivalRow({ a, t, lang, onClick }: ArrivalRowProps) {
  const { num, unit } = formatEta(a.etaSec, t);
  const dest = lang === 'es' ? a.destEs : a.destEn;
  const note = lang === 'es' ? a.note_es : a.note_en;
  const statusCls = a.status === 'bad' ? 'arrival-eta--bad' : a.status === 'warn' ? 'arrival-eta--warn' : '';
  return (
    <div className="arrival" onClick={onClick}>
      <RouteBadge route={a.route} kind={a.kind} />
      <div className="arrival-body">
        <div className="arrival-dest">{dest}</div>
        <div className="arrival-meta">
          <span>{a.kind === 'train' ? t('platform') + ' 2' : t('at_stop')}</span>
          {note && <><span className="sep">·</span><span style={{ color: 'var(--warn-ink)' }}>{note}</span></>}
        </div>
      </div>
      <div className={`arrival-eta ${statusCls}`}>
        <div className="arrival-eta-num">{num}</div>
        {unit && <div className="arrival-eta-unit">{unit}</div>}
      </div>
    </div>
  );
}
