'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';

interface AppBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  trailing?: React.ReactNode;
}

export function AppBar({ title, showBack = false, onBack, trailing }: AppBarProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <header className="appbar">
      {showBack && (
        <button className="back" onClick={handleBack} aria-label="Back">
          <Icon name="back" size={20} />
        </button>
      )}
      <h1>{title}</h1>
      {trailing && <div className="trailing">{trailing}</div>}
    </header>
  );
}
