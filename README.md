<<<<<<< HEAD
# JSS University, Noida — Companies Research & Placement Analytics Portal

Also known as the **JSS University, Noida Placement Intelligence Hub** (JSS NOIDA).

## Status

- **(a) Phase 1 was UI-only** with hardcoded seed data (`src/data/seedCompanies.ts`, one reference company, Accenture). Since Phase 2 the live app reads from Supabase (below); the seed files are kept as a documented fallback and as test fixtures.
- **(b) The portal is fully public.** There is no login, no auth context, no protected routes. Every route is reachable directly.
- **(c) College branding:** `COLLEGE_NAME = "JSS University, Noida"`, `COLLEGE_SHORT = "JSS NOIDA"` (in `src/components/CollegeLogo.tsx`). The JSS University, Noida emblem is `public/jss-university-logo.png`; it is shown in the listing hero, the sidebar and as the browser-tab icon. (Earlier versions had no college logo; that restriction was lifted by request.)
- **(d) Phase 2** swapped the data layer to Supabase without changing the normalizers in `src/lib/companyData.ts`, which take the raw JSON shapes (`short_json`, `full_json`, skill rows).

## Stack

React + Vite + TypeScript, Tailwind v3, React Router 6, React Query 5, framer-motion, lucide-react, recharts, Radix primitives (shadcn-style components in `src/components/ui`).

## Routes

| Path | Page |
| --- | --- |
| `/` | Company grid (search, category filters) |
| `/company` | Redirects to `/company/intelligence` |
| `/company/intelligence` | 22-section company intelligence |
| `/company/skills` | Skill intelligence with 10-level roadmaps |
| `*` | NotFound (invalid URLs only) |

The selected company is stored in `localStorage` under `selected-company` and restored on startup from `SEED_COMPANIES`, so both company pages survive a refresh. If nothing is selected, those pages send the visitor to `/`.

## Scripts

```bash
npm install
npm run dev     # http://localhost:8080
npm run build   # type-check + production build
npm test        # vitest smoke tests
```

## Env

See `.env.example`. `VITE_LOGO_DEV_PUBLISHABLE_KEY` is optional: without it, logos fall back to the company's `logo_url`, then to an initial-letter circle.

## Data rules

CTC, stipend and selection ratio are never displayed anywhere.

## Phase 2 — Supabase

Paste `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into `.env`, then `npm install && npm run dev`.

- **Read-only and public.** No auth, no inserts/updates/deletes, no migrations.
- **Company data** comes only from `public.company_json`: the card list selects `company_id, short_json`; a company page selects `company_id, short_json, full_json` filtered by `company_id`. No other company tables are queried.
- **Skill data** comes from four small tables: `company_skill_levels`, `skill_set_master`, `proficiency_levels`, `skill_set_topics`. They are assembled client-side into the same `DashboardSkill` shape and 10-level roadmaps as before.
- **Code:** `src/lib/supabaseClient.ts` (client; logs a clear console error if an env var is missing) and `src/lib/companyApi.ts` (`useCompanies`, `useCompanyProfile`, `useCompanySkills`).
- Pages show a skeleton while loading and an error message with a Retry button if a request fails.
- **Tests** run against an in-memory fake Supabase built from the seed (`src/test/fakeSupabase.ts`), including a check that only the five allowed tables are queried.
=======
# jss-placement-portal-bootcamp
>>>>>>> origin/main
