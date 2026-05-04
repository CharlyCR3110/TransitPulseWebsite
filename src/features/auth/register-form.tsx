'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useLang } from '@/components/providers/lang-provider';
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

export function RegisterForm() {
  const { register } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (password.length < 8) {
      setError(t('Contraseña: mínimo 8 caracteres.', 'Password must be at least 8 characters.'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await register({ email, password, displayName });
      router.replace('/home');
    } catch (err) {
      setError(getErrorMessage(err, lang));
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 18, color: 'var(--text)' }}>
        {t('Crear cuenta', 'Register')}
      </h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={labelStyle}>{t('Nombre', 'Display name')}</span>
          <input
            type="text"
            required
            minLength={1}
            maxLength={64}
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={inputStyle}
          />
        </label>
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
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        {error && <div style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{ ...buttonStyle, opacity: submitting ? 0.7 : 1 }}>
          {submitting ? t('Creando…', 'Creating…') : t('Crear cuenta', 'Register')}
        </button>
        <div style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>
          {t('¿Ya tienes cuenta?', 'Already have an account?')}{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            {t('Entra', 'Sign in')}
          </Link>
        </div>
      </form>
    </>
  );
}
