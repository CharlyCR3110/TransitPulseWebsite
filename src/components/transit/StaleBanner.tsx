import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/lib/format';

interface StaleBannerProps {
  updatedAt: Date;
  staleAfterSeconds?: number;
  className?: string;
}

export function StaleBanner({
  updatedAt,
  staleAfterSeconds = 120,
  className,
}: StaleBannerProps) {
  const ageSeconds = (Date.now() - updatedAt.getTime()) / 1_000;
  const isStale = ageSeconds > staleAfterSeconds;

  if (!isStale) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-delayed/30 bg-delayed/10 px-3 py-2 text-xs text-delayed',
        className,
      )}
      role="status"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>Datos posiblemente desactualizados — {formatRelative(updatedAt)}</span>
    </div>
  );
}
