import * as Sentry from '@sentry/nextjs';

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const observabilityEnabled = Boolean(DSN);

let initialized = false;

export function initObservability(): void {
  if (!observabilityEnabled || initialized) return;
  Sentry.init({
    dsn: DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'development',
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0),
    sendDefaultPii: false,
  });
  initialized = true;
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!observabilityEnabled) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}
