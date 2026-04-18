import type { I18nKey } from '@/data/transit';

export function OccBars({ level, t }: { level: number; t: (key: I18nKey) => string }) {
  const labels: I18nKey[] = ['low_occ', 'low_occ', 'med_occ', 'high_occ', 'full_occ'];
  const lbl = t(labels[level] ?? 'med_occ');
  return (
    <span className="occ">
      <span className={`occ-bars lvl-${Math.max(1, level)}`}>
        <span /><span /><span /><span />
      </span>
      <span>{lbl}</span>
    </span>
  );
}
