import { cn } from '@/lib/utils';
import type { ArrivalStatus } from '@/types/transit';

interface StatusBadgeProps {
  status: ArrivalStatus;
  className?: string;
}

const config: Record<
  ArrivalStatus,
  { label: string; classes: string }
> = {
  'on-time': {
    label: 'A tiempo',
    classes: 'bg-on-time/15 text-on-time border-on-time/30',
  },
  delayed: {
    label: 'Con demora',
    classes: 'bg-delayed/15 text-delayed border-delayed/30',
  },
  disrupted: {
    label: 'Interrumpido',
    classes: 'bg-disrupted/15 text-disrupted border-disrupted/30',
  },
  unknown: {
    label: 'Sin datos',
    classes: 'bg-unknown/15 text-unknown border-unknown/30',
  },
  ok: {
    label: 'A tiempo',
    classes: 'bg-on-time/15 text-on-time border-on-time/30',
  },
  warn: {
    label: 'Con demora',
    classes: 'bg-delayed/15 text-delayed border-delayed/30',
  },
  bad: {
    label: 'Interrumpido',
    classes: 'bg-disrupted/15 text-disrupted border-disrupted/30',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, classes } = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        classes,
        className,
      )}
    >
      {label}
    </span>
  );
}
