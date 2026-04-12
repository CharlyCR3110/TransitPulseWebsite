'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Navigation, Bell, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/plan', label: 'Planear', icon: Navigation },
  { href: '/routes', label: 'Rutas', icon: Map },
  { href: '/alerts', label: 'Alertas', icon: Bell },
  { href: '/report', label: 'Reportar', icon: Flag },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-stretch">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={cn('h-5 w-5', active && 'stroke-[2.5]')}
                aria-hidden
              />
              <span className={cn('leading-none', active && 'font-medium')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
