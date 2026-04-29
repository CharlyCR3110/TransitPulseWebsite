import { ThemeProvider } from './theme-provider';
import { LangProvider } from './lang-provider';
import { QueryProvider } from './query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LangProvider>{children}</LangProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
