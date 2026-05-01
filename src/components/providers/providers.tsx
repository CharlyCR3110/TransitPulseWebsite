'use client';
import { Toaster } from 'sonner';
import { ThemeProvider } from './theme-provider';
import { LangProvider } from './lang-provider';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { initObservability } from '@/lib/observability';

initObservability();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <LangProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </LangProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
