export function ConfidenceRing({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value);
  const color = value >= 0.9 ? 'var(--ok)' : value >= 0.8 ? 'var(--warn)' : 'var(--bad)';
  return (
    <div className="confidence-ring">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="var(--border)" strokeWidth="5" fill="none" />
        <circle cx="32" cy="32" r={r} stroke={color} strokeWidth="5" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms var(--ease)' }} />
      </svg>
      <div className="confidence-ring-num">{pct}</div>
    </div>
  );
}
