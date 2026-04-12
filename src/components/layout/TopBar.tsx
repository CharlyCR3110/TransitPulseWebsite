'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const titleMap: Record<string, string> = {
  '/': 'TransitPulse',
  '/plan': 'Planificar viaje',
  '/alerts': 'Alertas',
  '/routes': 'Rutas',
  '/report': 'Reportar incidente',
};

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const pathname = usePathname();

  const isNested =
    pathname.startsWith('/plan/results/') ||
    pathname.startsWith('/alerts/') ||
    pathname.startsWith('/routes/') ||
    pathname.startsWith('/stops/');

  const title = titleMap[pathname] ?? 'TransitPulse';

  // Derive back href for nested routes
  const backHref = pathname.startsWith('/plan/results/')
    ? '/plan'
    : pathname.startsWith('/alerts/')
      ? '/alerts'
      : pathname.startsWith('/routes/')
        ? '/routes'
        : pathname.startsWith('/stops/')
          ? '/'
          : undefined;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      {isNested && backHref && (
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Volver"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      )}

      {!isNested && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-xs font-bold text-primary-foreground">TP</span>
        </div>
      )}

      <h1 className="flex-1 text-base font-semibold">{title}</h1>

      <Link
        href="/alerts"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label="Alertas"
      >
        <Bell className="h-5 w-5" />
      </Link>
    </header>
  );
}
