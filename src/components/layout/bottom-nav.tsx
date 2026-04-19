'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import { useLang } from '@/components/providers/lang-provider';
import type { I18nKey } from '@/data/transit';

type TabId = 'home' | 'plan' | 'alerts' | 'profile';

const items: { id: TabId; icon: string; labelKey: I18nKey; path: string }[] = [
  { id: 'home', icon: 'home', labelKey: 'home', path: '/home' },
  { id: 'plan', icon: 'route', labelKey: 'plan', path: '/planner' },
  { id: 'alerts', icon: 'bell', labelKey: 'alerts', path: '/alerts' },
  { id: 'profile', icon: 'user', labelKey: 'profile', path: '/profile' },
];

function pathToTab(pathname: string): TabId {
  if (pathname.startsWith('/planner')) return 'plan';
  if (pathname.startsWith('/alerts')) return 'alerts';
  if (pathname.startsWith('/profile')) return 'profile';
  return 'home';
}

export function BottomNav() {
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const tab = pathToTab(pathname);

  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={`bnav-item ${tab === it.id ? 'active' : ''}`}
          onClick={() => router.push(it.path)}
        >
          <Icon name={it.icon} size={22} stroke={tab === it.id ? 2 : 1.75} />
          <span>{t(it.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
