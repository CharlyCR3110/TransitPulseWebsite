# TransitPulse — Manual Integration Smoke Test

Quick, repeatable check that the frontend talks to a live backend end-to-end. ~10 minutes from a clean checkout.

## Prerequisites

- Both repos cloned: `TransitPulseWebsite` (this repo) and `TransitPulseBackend`.
- Node 20+ and Docker available locally.

## 1. Bring up the backend

In `TransitPulseBackend/`:

```sh
docker compose up -d
# wait for Postgres healthcheck, then run migrations + seed (see backend's own scripts)
```

Confirm `GET http://localhost:8080/api/v1/alerts` returns JSON.

## 2. Bring up the frontend

In `TransitPulseWebsite/`:

```sh
cp .env.example .env.local   # leave NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
npm install
npm run dev
```

Open `http://localhost:3000`.

## 3. Smoke checklist

Walk through every numbered step in order. Each row is a pass/fail observation.

| # | Action | Expected |
|---|---|---|
| 1 | Open `/home`. | Real arrivals from Postgres render; nearby stops list renders. |
| 2 | Open `/alerts`. | Real alerts render; relative timestamps look sane (`X min` / `X h`). |
| 3 | Open `/stops/{any-stop-id-from-step-1}`. | Detail page loads with arrivals; tap "Report" → form opens. |
| 4 | Open `/stops/does-not-exist`. | Renders the "Stop not found" branch (no crash, no infinite spinner). |
| 5 | Submit an anonymous report from step 3. | Toast/sheet closes; row in `reports` table has `user_id = NULL`. |
| 6 | Open `/planner`, search a real `from` → `to`. | Returns at least one trip option. |
| 7 | Tap an option → trip detail. | Route badges + related alerts render. |
| 8 | Tap "Start trip" → `/trip/active`. | `currentStepIndex = 0`; "Next step" advances to 1. After refresh, "Next step" still advances (uses persisted `activeTripId`). |
| 9 | Open `/register`, create an account. | Auto-redirects to `/home`; `/profile` shows the new display name. |
| 10 | Submit a report while logged in. | `reports` row has the correct `user_id`. |
| 11 | Tap "Sign out" on `/profile`. | Bounces to `/login`; `/profile` reverts to "Guest" + Sign in CTA. |
| 12 | Hand-edit `localStorage['transitpulse.auth.token']` to garbage and reload. | Backend returns 401 on `me()`; frontend clears token and routes to `/login`. |

If any row fails, file an issue with the row number and the request/response captured from devtools.

## 4. Mock-mode sanity (offline)

```sh
NEXT_PUBLIC_USE_MOCKS=true npm run dev
```

Stop the backend container. Walk steps 1, 2, 3, 6, 9 again — all should still pass against the in-memory mock providers. This proves the build-time switch is honored.

## See also

- `README.md` § "Frontend ↔ Backend integration"
- `eslint.config.mjs` — the `no-restricted-imports` rule that prevents seed-data leaks back into app code
- Design notes: `.sop/planning/frontend-backend-integration/design/detailed-design.md` § 7
