export type ApiErrorCode =
  | 'not_found'
  | 'validation_error'
  | 'auth_required'
  | 'forbidden'
  | 'conflict'
  | 'internal_error'
  | 'network_error'
  | 'http_error';

export interface ApiErrorInit {
  status: number;
  code: ApiErrorCode | string;
  message: string;
  details?: Record<string, unknown> | null;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode | string;
  readonly details: Record<string, unknown> | null;

  constructor({ status, code, message, details = null }: ApiErrorInit) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isAuthRequired(error: unknown): boolean {
  return isApiError(error) && error.code === 'auth_required';
}

export function isNotFound(error: unknown): boolean {
  return isApiError(error) && error.code === 'not_found';
}

const FALLBACK_MESSAGE: Record<'es' | 'en', string> = {
  es: 'Algo salió mal. Intenta de nuevo.',
  en: 'Something went wrong. Please try again.',
};

const CODE_MESSAGES: Record<string, Record<'es' | 'en', string>> = {
  network_error: {
    es: 'No se pudo conectar al servidor.',
    en: 'Could not reach the server.',
  },
  auth_required: {
    es: 'Inicia sesión para continuar.',
    en: 'Please sign in to continue.',
  },
  not_found: {
    es: 'No se encontró lo que buscabas.',
    en: 'We could not find what you were looking for.',
  },
  forbidden: {
    es: 'No tienes permiso para esta acción.',
    en: 'You do not have permission for this action.',
  },
  validation_error: {
    es: 'Revisa los datos ingresados.',
    en: 'Please check the values you entered.',
  },
};

export function getErrorMessage(error: unknown, lang: 'es' | 'en'): string {
  if (isApiError(error)) {
    const localized = CODE_MESSAGES[error.code]?.[lang];
    if (localized) return localized;
    if (error.message) return error.message;
  }
  return FALLBACK_MESSAGE[lang];
}
