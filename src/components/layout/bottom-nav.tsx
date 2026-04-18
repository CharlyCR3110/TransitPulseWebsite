import { Icon } from '@/components/ui/icons';
import type { I18nKey } from '@/data/transit';

type TabId = 'home' | 'plan' | 'alerts' | 'profile';

interface BottomNavProps {
  tab: TabId;
  onTab: (id: TabId) => void;
  t: (key: I18nKey) => string;
}

export function BottomNav({ tab, onTab, t }: BottomNavProps) {
  const items: { id: TabId; icon: string; labelKey: I18nKey }[] = [
    { id: 'home', icon: 'home', labelKey: 'home' },
    { id: 'plan', icon: 'route', labelKey: 'plan' },
    { id: 'alerts', icon: 'bell', labelKey: 'alerts' },
    { id: 'profile', icon: 'user', labelKey: 'profile' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button key={it.id} className={`bnav-item ${tab === it.id ? 'active' : ''}`} onClick={() => onTab(it.id)}>
          <Icon name={it.icon} size={22} stroke={tab === it.id ? 2 : 1.75} />
          <span>{t(it.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
