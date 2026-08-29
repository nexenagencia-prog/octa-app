create extension if not exists pgcrypto;

create type public.room_status as enum ('scheduled','live','ended');
create type public.room_role as enum ('host','cohost','participant');
create type public.recording_status as enum ('pending','ready','failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '', username text unique, avatar_url text, headline text, company text, status text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.rooms (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade, livekit_room_name text unique not null,
  status public.room_status not null default 'scheduled', scheduled_at timestamptz, started_at timestamptz, ended_at timestamptz,
  chat_enabled boolean not null default true, created_at timestamptz not null default now()
);
create table public.room_members (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, role public.room_role not null default 'participant',
  can_speak boolean not null default true, is_pinned boolean not null default false, joined_at timestamptz, left_at timestamptz,
  unique(room_id,user_id)
);
create table public.room_messages (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, body text not null check(char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.meeting_notes (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, content text not null default '', updated_at timestamptz not null default now(),
  unique(room_id,user_id)
);
create table public.whiteboard_documents (
  id uuid primary key default gen_random_uuid(), room_id uuid not null unique references public.rooms(id) on delete cascade,
  snapshot jsonb not null default '[]'::jsonb, updated_at timestamptz not null default now()
);
create table public.recordings (
  id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade,
  title text not null, thumbnail_url text, video_url text, duration_seconds integer, status public.recording_status not null default 'pending', created_at timestamptz not null default now()
);
create table public.meeting_tags (id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade, label text not null);
create table public.user_entitlements (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade, plan_code text not null default 'free', capabilities jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.room_messages enable row level security;
alter table public.meeting_notes enable row level security;
alter table public.whiteboard_documents enable row level security;
alter table public.recordings enable row level security;
alter table public.meeting_tags enable row level security;
alter table public.user_entitlements enable row level security;

create policy "profiles public read" on public.profiles for select to authenticated using (true);
create policy "profile owner update" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy "profile owner insert" on public.profiles for insert to authenticated with check (id=auth.uid());

create or replace function public.is_room_member(target_room uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.room_members rm where rm.room_id=target_room and rm.user_id=auth.uid()) or exists(select 1 from public.rooms r where r.id=target_room and r.owner_id=auth.uid()) $$;
create or replace function public.can_moderate_room(target_room uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.rooms r where r.id=target_room and r.owner_id=auth.uid()) or exists(select 1 from public.room_members rm where rm.room_id=target_room and rm.user_id=auth.uid() and rm.role in ('host','cohost')) $$;

create policy "rooms member read" on public.rooms for select to authenticated using (owner_id=auth.uid() or public.is_room_member(id));
create policy "rooms owner insert" on public.rooms for insert to authenticated with check (owner_id=auth.uid());
create policy "rooms moderator update" on public.rooms for update to authenticated using (public.can_moderate_room(id));
create policy "members room read" on public.room_members for select to authenticated using (public.is_room_member(room_id));
create policy "members moderator manage" on public.room_members for all to authenticated using (public.can_moderate_room(room_id)) with check (public.can_moderate_room(room_id));
create policy "messages room read" on public.room_messages for select to authenticated using (public.is_room_member(room_id));
create policy "messages self insert" on public.room_messages for insert to authenticated with check (user_id=auth.uid() and public.is_room_member(room_id));
create policy "notes own" on public.meeting_notes for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid() and public.is_room_member(room_id));
create policy "board room read" on public.whiteboard_documents for select to authenticated using (public.is_room_member(room_id));
create policy "board room write" on public.whiteboard_documents for all to authenticated using (public.is_room_member(room_id)) with check (public.is_room_member(room_id));
create policy "recording room read" on public.recordings for select to authenticated using (public.is_room_member(room_id));
create policy "tags room read" on public.meeting_tags for select to authenticated using (public.is_room_member(room_id));
create policy "entitlements own" on public.user_entitlements for select to authenticated using (user_id=auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,display_name,avatar_url) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)),new.raw_user_meta_data->>'avatar_url') on conflict(id) do nothing; insert into public.user_entitlements(user_id) values(new.id) on conflict(user_id) do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
