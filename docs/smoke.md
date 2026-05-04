# TransitPulse — Manual Integration Smoke Test

The MLP gate. Walk every row in order against the deployed pair before declaring a release shippable. ~15 minutes from a clean browser.

**Deployed URLs**

- Frontend: `https://transitpulse-website.vercel.app`
- Backend: `https://transitpulse-backend.fly.dev/api/v1`

---

## Pre-checklist

Run these once at the start. Don't proceed if any fail.

| Check | Command / where | Expected |
|---|---|---|
| Fly machine healthy | `flyctl status --app transitpulse-backend` | One machine, state `started`, all checks passing. |
| Vercel deployment ready | `vercel ls` from `TransitPulseWebsite/` | Latest deployment for production scope is "Ready". |
| Sentry inboxes empty (if configured) | sentry.io dashboard for both projects | Zero unresolved issues so a new event during smoke is unmistakable. |
| API base reachable | `curl -sS https://transitpulse-backend.fly.dev/api/v1/health` | `{"status":"ok"}` |
| CORS allows Vercel origin | `curl -sS -i -X OPTIONS https://transitpulse-backend.fly.dev/api/v1/stops -H "Origin: https://transitpulse-website.vercel.app" -H "Access-Control-Request-Method: GET"` | `200` with `access-control-allow-origin: https://transitpulse-website.vercel.app` |

---

## Smoke checklist (17 rows)

Every row runs against the deployed frontend at `https://transitpulse-website.vercel.app`. Use a fresh incognito window per pass — localStorage state from prior runs causes false negatives on auth rows.

| # | Action | Expected |
|---|---|---|
| 1 | Open `/home` (anonymous). | Real arrivals from Postgres render; nearby stops list renders with pins on the map. |
| 2 | Open `/alerts`. | Real alerts render; relative timestamps look sane (`X min` / `X h`). |
| 3 | Open `/stops/{any-stop-id-from-step-1}`. | Detail page loads with arrivals; tap "Report" → form opens. |
| 4 | Open `/stops/does-not-exist`. | Renders the "Stop not found" branch (no crash, no infinite spinner). |
| 5 | Submit an anonymous report from step 3. | Sheet closes; row in `reports` table has `user_id = NULL`. |
| 6 | Open `/planner`, search a real `from` → `to`. | Returns at least one trip option. |
| 7 | Tap an option → trip detail. | Route badges + related alerts render. |
| 8 | Tap "Start trip" → `/trip/active`. | `currentStepIndex = 0`; "Next step" advances to 1. After refresh, "Next step" still advances (uses persisted `activeTripId`). |
| 9 | Open `/register`, create an account. | Auto-redirects to `/home`; `/profile` shows the new display name. |
| 10 | Submit a report while logged in. | `reports` row has the correct `user_id`. |
| 11 | Tap "Sign out" on `/profile`. | Bounces to `/login`; `/profile` reverts to "Guest" + Sign in CTA. |
| 12 | Hand-edit `localStorage['transitpulse.auth.token']` to garbage and reload an authed page. | Backend returns 401 on `me()`; frontend clears token and routes to `/login?reason=session-expired`. |
| 13 | After registering (row 9), open `/profile`. | Trips card shows `0`. Plan + start a trip (rows 6–8), return to `/profile` — trips count reflects activity. |
| 14 | From `/stops/{id}`, submit a report (anonymous or authed). | Green sonner toast appears top-center, sheet closes, alerts feed invalidation reflected. |
| 15 | Open `/home` and any stop detail page. | Real MapLibre tiles render (Carto/OpenFreeMap positron style); stop pins visible; trip detail polyline along route. |
| 16 | Force a 500 (e.g., temp endpoint that raises) on the deployed backend. | Sentry event in the backend project's inbox within 60s. (Skip row if Sentry is not yet configured — note in run log.) |
| 17 | While signed in, hand-edit `localStorage['transitpulse.auth.token']` to garbage and reload an authed page. | Bounces to `/login?reason=session-expired`; red sonner toast appears once and the query param is stripped. |

If any row fails, file an issue with the row number and the request/response from devtools, fix at the root, redeploy, restart from row 1.

---

## Mock-mode sanity (optional, local only)

This stays a localhost run; mock mode is dev-time only:

```sh
NEXT_PUBLIC_USE_MOCKS=true npm run dev
```

Walk rows 1, 2, 3, 6, 9 against `http://localhost:3000`. All pass against the in-memory mock providers. This proves the build-time switch is honored.

---

## See also

- Backend deploy runbook: `TransitPulseBackend/docs/deploy.md`
- Status tracker: `.sop/planning/transitpulse-mlp/status.md`
- Design notes: `.sop/planning/transitpulse-mlp/design/detailed-design.md` § 7.2
