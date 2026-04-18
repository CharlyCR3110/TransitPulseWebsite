type Status = 'ok' | 'warn' | 'bad' | 'neutral' | 'primary';

export function StatusChip({ status, label }: { status: Status; label: string }) {
  const cls: Record<Status, string> = {
    ok: 'chip--ok', warn: 'chip--warn', bad: 'chip--bad',
    neutral: 'chip--neutral', primary: 'chip--primary',
  };
  return (
    <span className={`chip ${cls[status]}`}>
      <span className="chip-dot" />
      {label}
    </span>
  );
}
