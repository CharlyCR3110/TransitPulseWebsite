import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Route } from '@/types/transit';

interface RouteChipProps {
  route: Route;
  size?: 'sm' | 'md';
  className?: string;
  asLink?: boolean;
}

export function RouteChip({
  route,
  size = 'md',
  className,
  asLink = false,
}: RouteChipProps) {
  const modeColor =
    route.mode === 'train' ? 'bg-train text-train-fg' : 'bg-bus text-bus-fg';

  const inner = (
    <span
      className={cn(
        'inline-flex items-center rounded font-semibold',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm',
        modeColor,
        className,
      )}
    >
      {route.shortName}
    </span>
  );

  if (asLink) {
    return (
      <Link href={`/routes/${route.id}`} className="hover:opacity-80">
        {inner}
      </Link>
    );
  }

  return inner;
}
