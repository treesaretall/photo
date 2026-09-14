# Photography Portfolio

A personal photography portfolio site: public pages for browsing photos by series, plus an admin dashboard for uploading, editing, deleting, and reordering photos.

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
2. Run the SQL in `supabase/migrations/0001_init.sql` against your Supabase project (creates the `series`/`photos` tables, RLS policies, and the `photos` storage bucket).
3. Create one admin user under Authentication → Users in the Supabase dashboard — that's the only account that can write data.

```sh
npm install
npm run dev
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck and build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest test suite |
| `npm run storybook` | Start Storybook locally |
| `npm run build-storybook` | Build the static Storybook site |
