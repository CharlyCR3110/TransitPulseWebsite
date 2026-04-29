import { describe, expect, it } from 'vitest';
import {
  ApiError,
  getErrorMessage,
  isApiError,
  isAuthRequired,
  isNotFound,
} from './errors';

describe('ApiError', () => {
  it('captures status, code, message, and details', () => {
    const err = new ApiError({
      status: 404,
      code: 'not_found',
      message: 'Stop missing',
      details: { stopId: 's42' },
    });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ApiError');
    expect(err.status).toBe(404);
    expect(err.code).toBe('not_found');
    expect(err.message).toBe('Stop missing');
    expect(err.details).toEqual({ stopId: 's42' });
  });

  it('defaults details to null when omitted', () => {
    const err = new ApiError({ status: 500, code: 'internal_error', message: 'oops' });
    expect(err.details).toBeNull();
  });
});

describe('isApiError / isAuthRequired / isNotFound', () => {
  it('isApiError narrows correctly', () => {
    expect(isApiError(new ApiError({ status: 401, code: 'auth_required', message: '' }))).toBe(true);
    expect(isApiError(new Error('plain'))).toBe(false);
    expect(isApiError(null)).toBe(false);
  });

  it('isAuthRequired only matches auth_required ApiError', () => {
    expect(isAuthRequired(new ApiError({ status: 401, code: 'auth_required', message: '' }))).toBe(true);
    expect(isAuthRequired(new ApiError({ status: 404, code: 'not_found', message: '' }))).toBe(false);
    expect(isAuthRequired(new Error('boom'))).toBe(false);
  });

  it('isNotFound only matches not_found ApiError', () => {
    expect(isNotFound(new ApiError({ status: 404, code: 'not_found', message: '' }))).toBe(true);
    expect(isNotFound(new ApiError({ status: 500, code: 'internal_error', message: '' }))).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('returns localized message for known codes', () => {
    const err = new ApiError({ status: 0, code: 'network_error', message: 'fetch failed' });
    expect(getErrorMessage(err, 'en')).toBe('Could not reach the server.');
    expect(getErrorMessage(err, 'es')).toBe('No se pudo conectar al servidor.');
  });

  it('falls back to ApiError.message when code has no localized text', () => {
    const err = new ApiError({ status: 500, code: 'internal_error', message: 'Custom backend message' });
    expect(getErrorMessage(err, 'en')).toBe('Custom backend message');
  });

  it('returns generic fallback for non-ApiError values', () => {
    expect(getErrorMessage(new Error('boom'), 'en')).toBe('Something went wrong. Please try again.');
    expect(getErrorMessage(undefined, 'es')).toBe('Algo salió mal. Intenta de nuevo.');
  });
});
