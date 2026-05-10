import type { Arrival } from '@/types/transit';
import type { I18nKey } from '@/data/transit';
import { RouteBadge } from './route-badge';
import { EtaBadge } from './eta-badge';

interface ArrivalRowProps {
  a: Arrival;
  t: (key: I18nKey) => string;
  lang: 'es' | 'en';
  onClick?: () => void;
}

export function ArrivalRow({ a, t, lang, onClick }: ArrivalRowProps) {
  const dest = lang === 'es' ? a.destEs : a.destEn;
  const note = lang === 'es' ? a.note_es : a.note_en;
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
      <EtaBadge etaSec={a.etaSec} prediction={a.prediction} status={a.status} t={t} lang={lang} />
    </div>
  );
}
