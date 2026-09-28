-- Adds an accurate "last updated" timestamp to blog_posts.
--
-- Why: Article JSON-LD (app/blog/[slug]/page.jsx) and the sitemap
-- (app/sitemap.js) already read `post.updated_at` when it exists and fall
-- back to created_at. Without this column, dateModified always equals the
-- publish date, even after a post has been rewritten.
--
-- Safe to run: it only ADDS a column and a trigger. No rows are deleted and
-- no existing column is changed. Run it once in the Supabase SQL editor.

-- 1. Add the column. Existing rows get created_at as their starting value.
alter table public.blog_posts
  add column if not exists updated_at timestamptz;

update public.blog_posts
  set updated_at = coalesce(updated_at, created_at);

alter table public.blog_posts
  alter column updated_at set default now(),
  alter column updated_at set not null;

-- 2. Keep it current: every UPDATE on a row sets updated_at = now().
create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();

-- 3. OPTIONAL, run only if you agree: these six posts had their content
--    rewritten on 28 Sep 2026 (see "Claude outputs/blog-backup-2026-09-28.md").
--    Setting updated_at to that date makes dateModified accurate for them.
-- update public.blog_posts set updated_at = '2026-09-28T12:00:00Z'
--   where id in (
--     'f1179d69-0dc7-40c6-aa4a-7461208feb59', -- goethe-vs-telc-vs-testdaf-vs-osd
--     'aea2892e-b6f3-416a-b443-af7791ff82ae', -- telc-b2-medizin
--     '5d89585e-2464-4469-8b1e-e270b4a85d14', -- goethe-vs-telc (Pakistan)
--     '43ded783-a5c2-4eab-b6ad-697fc1c67c5b', -- work-visa level
--     '8d3c0212-fd6d-4d64-b821-11e512c1cfe6', -- A1-B2 timeline
--     '94b607b9-8a47-45a4-8c61-9a0a576dedb0'  -- visa documents checklist
--   );
-- Note: step 2's trigger fires on this UPDATE too and would overwrite the
-- value with now(). To keep 28 Sep, run this block BEFORE creating the
-- trigger, or temporarily disable it:
--   alter table public.blog_posts disable trigger blog_posts_set_updated_at;
--   <update above>
--   alter table public.blog_posts enable trigger blog_posts_set_updated_at;
