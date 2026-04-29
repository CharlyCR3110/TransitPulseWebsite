'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/layout/app-bar';
import { useAuth } from '@/components/providers/auth-provider';
import { useLang } from '@/components/providers/lang-provider';
import { getErrorMessage } from '@/data/api/errors';

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
    <div className="screen screen-fade">
      <AppBar title={t('Crear cuenta', 'Register')} showBack />
      <form onSubmit={onSubmit} style={{ padding: '0 20px', display: 'grid', gap: 14 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{t('Nombre', 'Display name')}</span>
          <input
            type="text"
            required
            minLength={1}
            maxLength={64}
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-1)' }}
          />
        </label>
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
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'var(--bg-2)', color: 'var(--text-1)' }}
          />
        </label>
        {error && <div style={{ color: 'var(--bad)', fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={submitting} className="btn--primary" style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)' }}>
          {submitting ? t('Creando…', 'Creating…') : t('Crear cuenta', 'Register')}
        </button>
        <div style={{ fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>
          {t('¿Ya tienes cuenta?', 'Already have an account?')} <Link href="/login">{t('Entra', 'Sign in')}</Link>
        </div>
      </form>
    </div>
  );
}
