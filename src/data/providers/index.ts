/**
 * Build-time provider switch.
 *
 * Default is API mode. Set `NEXT_PUBLIC_USE_MOCKS=true` in `.env.local` to use
 * the in-memory mock providers (offline UI work without a running backend).
 *
 * All feature code MUST import providers from this module — never from
 * `./mock` or `./api` directly. That guarantees the switch is honored.
 */
import * as mock from './mock';
import * as api from './api';

const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
const impl = useMocks ? mock : api;

export const plannerProvider = impl.plannerProvider;
export const stopsProvider = impl.stopsProvider;
export const arrivalsProvider = impl.arrivalsProvider;
export const alertsProvider = impl.alertsProvider;
export const reportsProvider = impl.reportsProvider;
export const authProvider = impl.authProvider;
export const usersProvider = impl.usersProvider;

/** True iff the build was configured to use mock providers. Test-only escape hatch. */
export const __usingMocks = useMocks;
