'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authProvider, usersProvider } from '@/data/providers';
import { TOKEN_STORAGE_KEY } from '@/data/api/client';
import { isApiError } from '@/data/api/errors';
import { AUTH_EXPIRED_EVENT } from './query-provider';
import type { LoginInput, RegisterInput } from '@/data/contracts/auth';
import type { UserProfileDto } from '@/data/contracts/users';

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

interface AuthState {
  status: AuthStatus;
  user: UserProfileDto | null;
}

interface AuthContextValue extends AuthState {
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token === null) window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    else window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore quota/private-mode errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  const logout = useCallback(() => {
    writeToken(null);
    queryClient.clear();
    setState({ status: 'unauthenticated', user: null });
    router.replace('/login');
  }, [router, queryClient]);

  useEffect(() => {
    let cancelled = false;
    const token = readToken();
    if (!token) {
      setState({ status: 'unauthenticated', user: null });
      return;
    }
    void usersProvider
      .me()
      .then((user) => {
        if (cancelled) return;
        setState({ status: 'authenticated', user });
      })
      .catch((err) => {
        if (cancelled) return;
        if (isApiError(err) && (err.code === 'auth_required' || err.status === 401)) {
          writeToken(null);
          setState({ status: 'unauthenticated', user: null });
        } else {
          setState({ status: 'unauthenticated', user: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => logout();
    window.addEventListener(AUTH_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  }, [logout]);

  const login = useCallback(async (input: LoginInput) => {
    const token = await authProvider.login(input);
    writeToken(token.accessToken);
    const user = await usersProvider.me();
    setState({ status: 'authenticated', user });
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      await authProvider.register(input);
      await login({ email: input.email, password: input.password });
    },
    [login],
  );

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
