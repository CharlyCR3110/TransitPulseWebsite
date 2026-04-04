import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OccupancyLevel } from '@/types/transit';

interface OccupancyBadgeProps {
  level: OccupancyLevel;
  showLabel?: boolean;
  className?: string;
}

const config: Record<
  OccupancyLevel,
  { label: string; classes: string; dotClass: string }
> = {
  low: {
    label: 'Poca gente',
    classes: 'text-occ-low',
    dotClass: 'bg-occ-low',
  },
  medium: {
    label: 'Moderado',
    classes: 'text-occ-medium',
    dotClass: 'bg-occ-medium',
  },
  high: {
    label: 'Lleno',
    classes: 'text-occ-high',
    dotClass: 'bg-occ-high',
  },
  packed: {
    label: 'Abarrotado',
    classes: 'text-occ-packed',
    dotClass: 'bg-occ-packed',
  },
};

export function OccupancyBadge({
  level,
  showLabel = true,
  className,
}: OccupancyBadgeProps) {
  const { label, classes, dotClass } = config[level];
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs', classes, className)}
      title={label}
    >
      <span className={cn('h-2 w-2 rounded-full', dotClass)} aria-hidden />
      <Users className="h-3 w-3" aria-hidden />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
