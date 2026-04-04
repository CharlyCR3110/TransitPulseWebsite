import { Bus, TrainFront, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransportMode } from '@/types/transit';

interface ModePillProps {
  mode: TransportMode;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const config: Record<
  TransportMode,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultLabel: string;
    classes: string;
  }
> = {
  bus: {
    icon: Bus,
    defaultLabel: 'Bus',
    classes: 'bg-bus/15 text-bus border-bus/30',
  },
  train: {
    icon: TrainFront,
    defaultLabel: 'Tren',
    classes: 'bg-train/15 text-train border-train/30',
  },
  walk: {
    icon: Footprints,
    defaultLabel: 'Caminar',
    classes: 'bg-walk/15 text-walk border-walk/30',
  },
};

export function ModePill({
  mode,
  label,
  size = 'md',
  className,
}: ModePillProps) {
  const { icon: Icon, defaultLabel, classes } = config[mode];
  const text = label ?? defaultLabel;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        classes,
        className,
      )}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden />
      {text}
    </span>
  );
}
