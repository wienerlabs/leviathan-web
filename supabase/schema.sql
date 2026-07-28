-- Leviathan waitlist storage.
-- Run this once in the Supabase SQL editor:
--   Dashboard > SQL editor > New query > paste > Run.

create table if not exists public.waitlist (
  id                 uuid primary key default gen_random_uuid(),
  twitter_id         text not null unique,            -- X user id; the dedupe key
  twitter_username   text not null,                   -- handle, without the @
  twitter_name       text,                            -- display name
  twitter_avatar_url text,
  twitter_verified   boolean not null default false,  -- X "verified" flag at signup
  followers_count    integer not null default 0,
  email              text,                            -- optional, user-provided
  role               text,                            -- optional track: gpu/verifier/…
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Handy for ordering the list by signup time.
create index if not exists waitlist_created_at_idx on public.waitlist (created_at);

-- Turn RLS ON and define NO policies. This makes the table unreadable and
-- unwritable via the public anon key. All access flows through the service-role
-- key used by the /api/waitlist serverless functions, which bypasses RLS.
alter table public.waitlist enable row level security;
