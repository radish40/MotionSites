-- Run in the SQL editor of the Supabase project used by this application.
begin;
create table if not exists public.blog_posts (
  id text primary key,
  type text not null check (type in ('featured', 'standard')),
  badge text,
  title text not null,
  description text,
  author text,
  category text not null,
  category_color text not null,
  image_url text,
  video_url text not null,
  display_order integer not null unique
);
alter table public.blog_posts enable row level security;
grant select on public.blog_posts to anon, authenticated;
drop policy if exists "Public can read blog posts" on public.blog_posts;
create policy "Public can read blog posts" on public.blog_posts
  for select to anon, authenticated using (true);
insert into public.blog_posts
  (id, type, badge, title, description, author, category, category_color, image_url, video_url, display_order)
values
('featured', 'featured', 'Must Read', 'Full-Frame vs. Crop Sensor: Which for Photography?', 'An honest look at the real-world differences between these camera systems to help you choose what''s actually right for your photography needs.', 'By August Renner (c)', 'Gear', '#7d1a4a', null, 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_155500_808e6fdd-761f-4acd-b3be-cb7e6e700def.mp4', 0),
('lighting', 'standard', null, 'Finding Natural Light in Unexpected Places', null, null, 'Lighting', '#2c4c34', null, 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4', 1),
('editing', 'standard', null, 'My Approach to Editing: Creating a Consistent Photography Style', null, null, 'Editing', '#a63e2d', null, 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4', 2),
('business', 'standard', null, 'Pricing Your Photography: Strategies That Work', null, null, 'Business', '#1a2b8c', null, 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154232_f8809bd2-a6c3-4a38-908d-2005e5b3cb3e.mp4', 3)
on conflict (id) do update set type=excluded.type, badge=excluded.badge, title=excluded.title,
 description=excluded.description, author=excluded.author, category=excluded.category,
 category_color=excluded.category_color, image_url=excluded.image_url,
 video_url=excluded.video_url, display_order=excluded.display_order;
commit;
