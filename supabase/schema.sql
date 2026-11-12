-- Apply to the new, dedicated SeniorCare Supabase project after it is created.
-- Public educational content only. Do not store patient or medical records here.
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 180),
  excerpt text check (excerpt is null or char_length(excerpt) <= 500),
  body text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;
revoke all on table public.articles from anon, authenticated;
grant select (slug, title, excerpt, published, created_at) on public.articles to anon, authenticated;

drop policy if exists "Published articles can be viewed publicly" on public.articles;
create policy "Published articles can be viewed publicly" on public.articles
for select to anon, authenticated
using (published = true);

-- Edit content using the Supabase dashboard; do not grant public writes.
