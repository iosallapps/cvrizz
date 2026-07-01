-- Row Level Security (RLS) policies for cvrizz (Supabase / PostgreSQL)
--
-- WHY THIS FILE EXISTS
-- Prisma manages the table schema but NOT row-level security. Supabase auto-
-- exposes every table in the `public` schema through its PostgREST API, reachable
-- with the PUBLIC anon key (shipped to the browser via NEXT_PUBLIC_SUPABASE_ANON_KEY).
-- Without RLS, anyone can read/write every users / resumes / cv_purchases row
-- (emails, Stripe customer ids, private resumes, purchases) via a plain REST call.
--
-- HOW TO APPLY
-- Run this once in the Supabase SQL editor (or psql) after `prisma db push`.
-- Re-running is safe (idempotent).
--
-- WHY THE APP STILL WORKS AFTER ENABLING RLS
-- The app reads/writes through Prisma over a direct connection whose role owns
-- these tables, so it BYPASSES RLS. RLS only constrains the public PostgREST API
-- (anon / authenticated keys). If your DATABASE_URL role does NOT own the tables,
-- grant it BYPASSRLS or use the Supabase `postgres` role.
--
-- Note: `id` / `userId` are TEXT columns (Prisma String), so auth.uid() (uuid) is
-- cast to text for comparison.

-- ============================================================
-- users
-- ============================================================
alter table public.users enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
  on public.users for select
  to authenticated
  using ((select auth.uid())::text = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  to authenticated
  using ((select auth.uid())::text = id)
  with check ((select auth.uid())::text = id);

-- ============================================================
-- resumes
-- The app serves public resumes (/r/[slug]) through Prisma, so no anon read
-- policy is needed; only own-row access is exposed via PostgREST.
-- ============================================================
alter table public.resumes enable row level security;

drop policy if exists "resumes_all_own" on public.resumes;
create policy "resumes_all_own"
  on public.resumes for all
  to authenticated
  using ((select auth.uid())::text = "userId")
  with check ((select auth.uid())::text = "userId");

-- ============================================================
-- cv_purchases
-- ============================================================
alter table public.cv_purchases enable row level security;

drop policy if exists "cv_purchases_select_own" on public.cv_purchases;
create policy "cv_purchases_select_own"
  on public.cv_purchases for select
  to authenticated
  using ((select auth.uid())::text = "userId");
