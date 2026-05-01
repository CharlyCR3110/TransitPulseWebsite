'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AppBar } from '@/components/layout/app-bar';
import { useAuth } from '@/components/providers/auth-provider';
import { useLang } from '@/components/providers/lang-provider';
import { getErrorMessage } from '@/data/api/errors';

export function LoginForm() {
  const { login } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/home';
  const reason = params.get('reason');

  useEffect(() => {
    if (reason === 'session-expired') {
      toast.info(
        lang === 'es' ? 'Tu sesión expiró. Por favor inicia sesión de nuevo.' : 'Your session expired. Please sign in again.',
      );
    }
  }, [reason, lang]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      router.replace(next);
    } catch (err) {
      setError(getErrorMessage(err, lang));
      setSubmitting(false);
    }
  }

  return (
    <div className="screen screen-fade">
      <AppBar title={t('Iniciar sesión', 'Sign in')} showBack />
      <form onSubmit={onSubmit} style={{ padding: '0 20px', display: 'grid', gap: 14 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{t('Correo', 'Email')}</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-1)' }}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{t('Contraseña', 'Password')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-1)' }}
          />
        </label>
        {error && <div style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={submitting} className="btn--primary" style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)' }}>
          {submitting ? t('Entrando…', 'Signing in…') : t('Entrar', 'Sign in')}
        </button>
        <div style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>
          {t('¿Sin cuenta?', 'No account?')} <Link href="/register">{t('Crea una', 'Register')}</Link>
        </div>
      </form>
    </div>
  );
}
