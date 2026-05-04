'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { useLang } from '@/components/providers/lang-provider';
import { Icon } from '@/components/ui/icons';
import { getErrorMessage } from '@/data/api/errors';

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-2)',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 'var(--r-sm)',
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 'var(--r-sm)',
  background: 'var(--primary)',
  color: 'var(--primary-contrast)',
  border: 0,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
};

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
    <>
      <Link
        href="/profile"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 18,
          color: 'var(--text-2)',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <Icon name="back" size={16} />
        {t('Volver sin iniciar sesión', 'Back without signing in')}
      </Link>
      <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 18, color: 'var(--text)' }}>
        {t('Iniciar sesión', 'Sign in')}
      </h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{t('Correo', 'Email')}</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{t('Contraseña', 'Password')}</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        {error && <div style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{ ...buttonStyle, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? t('Entrando…', 'Signing in…') : t('Entrar', 'Sign in')}
        </button>
        <div style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>
          {t('¿Sin cuenta?', 'No account?')}{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            {t('Crea una', 'Register')}
          </Link>
        </div>
      </form>
    </>
  );
}
