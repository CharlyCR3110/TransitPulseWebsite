import { Icon } from '@/components/ui/icons';

interface AppBarProps {
  title: string;
  onBack?: () => void;
  trailing?: React.ReactNode;
}

export function AppBar({ title, onBack, trailing }: AppBarProps) {
  return (
    <header className="appbar">
      {onBack && (
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon name="back" size={20} />
        </button>
      )}
      <h1>{title}</h1>
      {trailing && <div className="trailing">{trailing}</div>}
    </header>
  );
}
