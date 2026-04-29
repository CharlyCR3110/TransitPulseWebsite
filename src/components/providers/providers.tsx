import { ThemeProvider } from './theme-provider';
import { LangProvider } from './lang-provider';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
