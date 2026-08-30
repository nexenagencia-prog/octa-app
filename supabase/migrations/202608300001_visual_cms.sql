-- OCTA Visual CMS — administrator-only visual editing and published runtime
create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_revisions (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('draft','published','archived')),
  document jsonb not null default '{"version":1,"scopes":{}}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists cms_revisions_status_created_idx on public.cms_revisions(status, created_at desc);

create table if not exists public.cms_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  width integer,
  height integer,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.cms_admins enable row level security;
alter table public.cms_revisions enable row level security;
alter table public.cms_assets enable row level security;

create or replace function public.cms_is_admin() returns boolean
language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.cms_admins where user_id=auth.uid())
$$;

create policy "cms admins self read" on public.cms_admins for select to authenticated using (user_id=auth.uid());
create policy "cms published read" on public.cms_revisions for select to anon, authenticated using (status='published' or public.cms_is_admin());
create policy "cms admin revisions insert" on public.cms_revisions for insert to authenticated with check (public.cms_is_admin());
create policy "cms admin revisions update" on public.cms_revisions for update to authenticated using (public.cms_is_admin()) with check (public.cms_is_admin());
create policy "cms admin assets read" on public.cms_assets for select to authenticated using (public.cms_is_admin());
create policy "cms admin assets insert" on public.cms_assets for insert to authenticated with check (public.cms_is_admin());
create policy "cms admin assets delete" on public.cms_assets for delete to authenticated using (public.cms_is_admin());

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('cms-assets','cms-assets',true,26214400,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "cms asset objects admin insert" on storage.objects for insert to authenticated
with check (bucket_id='cms-assets' and public.cms_is_admin());
create policy "cms asset objects admin update" on storage.objects for update to authenticated
using (bucket_id='cms-assets' and public.cms_is_admin()) with check (bucket_id='cms-assets' and public.cms_is_admin());
create policy "cms asset objects admin delete" on storage.objects for delete to authenticated
using (bucket_id='cms-assets' and public.cms_is_admin());
create policy "cms asset objects public read" on storage.objects for select to anon, authenticated
using (bucket_id='cms-assets');

-- OCTA AI Coach memory (safe to re-run)
create table if not exists public.octa_ai_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'coach_exchange',
  summary text not null check (char_length(summary) <= 4000),
  created_at timestamptz not null default now()
);
alter table public.octa_ai_memories enable row level security;
drop policy if exists "octa ai own memory" on public.octa_ai_memories;
create policy "octa ai own memory" on public.octa_ai_memories for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create index if not exists octa_ai_memories_user_created_idx on public.octa_ai_memories(user_id,created_at desc);
