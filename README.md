# Photography Portfolio

A personal photography portfolio site: public pages for browsing photos by series, an Info page with an editable profile picture, a Contacts page, plus an admin dashboard for managing series (create/edit/delete), uploading and captioning photos, reordering them by drag-and-drop, and updating the profile picture.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — scattered photo mosaic grouped by series |
| `/info` | Bio + profile picture |
| `/contacts` | Contact link |
| `/admin/login` | Admin sign-in |
| `/admin` | Admin dashboard (protected) |

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router (`HashRouter`)
- Zustand (UI + auth state)
- TanStack Query (server state, caching, optimistic updates)
- Supabase (Postgres, Auth, Storage)
- Vitest + React Testing Library
- Storybook

## Getting started

1. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon key.
2. Run the SQL migrations in `supabase/migrations/` against your Supabase project, in order:
   - `0001_init.sql` — `series`/`photos` tables, RLS policies, and the `photos` storage bucket.
   - `0002_profile.sql` — singleton `profile` table backing the Info page's profile picture.
3. Create one admin user under Authentication → Users in the Supabase dashboard — that's the only account that can write data.

```sh
npm install
npm run dev
```

## Testing

Tests live in `tests/`, mirroring `src/`'s structure (`tests/components`, `tests/hooks`, `tests/lib`, `tests/routes`, `tests/stores`) rather than being colocated with source files.

## Deployment

Deployed via [Vercel](https://vercel.com), which auto-detects the Vite framework preset (`npm run build`, output `dist/`). Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.

The project isn't currently connected to auto-deploy on push — deploys are triggered manually with `vercel --prod`. Connecting the GitHub repo in the Vercel dashboard (Project Settings → Git) would enable automatic deploys on push to `main` and preview deploys on other branches.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck and build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest test suite |
| `npm run storybook` | Start Storybook locally |
| `npm run build-storybook` | Build the static Storybook site |
