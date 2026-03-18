-- ✅ Enable UUID
create extension if not exists "pgcrypto";

-- ✅ Users
create table public.users (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  password    text,
  name        text,
  avatar      text,
  role        text not null default 'viewer'
                check (role in ('founder','ceo','cto','coo','lead-engineer',
                                'senior-engineer','engineer','lead-designer',
                                'designer','product-manager','devops',
                                'ai-engineer','sales','marketing','advisor','viewer')),
  provider    text not null default 'email'
                check (provider in ('email','google','github')),
  provider_id text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ✅ Sessions (refresh tokens)
create table public.sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  refresh_token text unique not null,
  user_agent    text,
  ip            text,
  expires_at    timestamptz not null,
  created_at    timestamptz not null default now()
);

-- ✅ Indexes
create index on public.sessions(user_id);
create index on public.sessions(refresh_token);
create index on public.users(email);
create index on public.users(provider, provider_id);

-- ✅ Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

-- ✅ RLS
alter table public.users   enable row level security;
alter table public.sessions enable row level security;

-- users: service role only
create policy "service role only" on public.users
  using (auth.role() = 'service_role');

create policy "service role only" on public.sessions
  using (auth.role() = 'service_role');