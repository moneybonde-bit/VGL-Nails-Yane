-- =============================================================================
-- VGL Nails — initial schema, RLS, seed data, and storage setup
-- Run this in the Supabase SQL Editor (or `supabase db push`) on a fresh project.
-- Safe to re-run: it drops and recreates objects it owns.
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- =============================================================================
-- TABLES
-- =============================================================================

-- Gallery ---------------------------------------------------------------------
create table if not exists public.gallery_items (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  category        text not null,
  image_url       text not null,
  alt_text        text,
  duration_minutes integer,
  starting_price  integer,           -- full Rupiah, e.g. 150000
  tags            text[] default '{}',
  status          text not null default 'draft' check (status in ('published', 'draft')),
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

-- Services --------------------------------------------------------------------
create table if not exists public.services (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  duration_minutes integer,
  price           integer,
  icon            text,              -- lucide icon name, e.g. 'Sparkles'
  sort_order      integer not null default 0,
  is_active       boolean not null default true
);

-- Pricing tiers ---------------------------------------------------------------
create table if not exists public.pricing_tiers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,     -- Basic / Premium / Luxury
  price           integer not null,
  highlight       boolean not null default false,
  features        text[] not null default '{}',
  sort_order      integer not null default 0
);

-- Pricing add-ons -------------------------------------------------------------
create table if not exists public.pricing_addons (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  price_from      integer not null,
  sort_order      integer not null default 0
);

-- Testimonials ----------------------------------------------------------------
create table if not exists public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text not null,
  avatar_url      text,
  rating          integer not null default 5 check (rating between 1 and 5),
  comment         text not null,
  is_published    boolean not null default true,
  sort_order      integer not null default 0
);

-- FAQ -------------------------------------------------------------------------
create table if not exists public.faq_items (
  id              uuid primary key default gen_random_uuid(),
  question        text not null,
  answer          text not null,
  sort_order      integer not null default 0,
  is_published    boolean not null default true
);

-- Bookings --------------------------------------------------------------------
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  whatsapp        text not null,
  preferred_date  date not null,
  preferred_time  text,
  service         text,
  notes           text,
  reference_url   text,
  status          text not null default 'new' check (status in ('new', 'confirmed', 'done', 'cancelled')),
  created_at      timestamptz not null default now()
);

-- Helpful indexes -------------------------------------------------------------
create index if not exists gallery_items_status_sort_idx on public.gallery_items (status, sort_order);
create index if not exists services_active_sort_idx     on public.services (is_active, sort_order);
create index if not exists testimonials_pub_sort_idx    on public.testimonials (is_published, sort_order);
create index if not exists faq_pub_sort_idx             on public.faq_items (is_published, sort_order);
create index if not exists bookings_created_idx         on public.bookings (created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Model:
--   * Public (anon) can READ only published / active content rows.
--   * Public (anon) can INSERT a booking, but can NEVER read bookings.
--   * Authenticated users (your admin login) can do everything.
-- =============================================================================

alter table public.gallery_items  enable row level security;
alter table public.services       enable row level security;
alter table public.pricing_tiers  enable row level security;
alter table public.pricing_addons enable row level security;
alter table public.testimonials   enable row level security;
alter table public.faq_items      enable row level security;
alter table public.bookings       enable row level security;

-- Drop existing policies (idempotent re-run) ----------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in (
        'gallery_items','services','pricing_tiers','pricing_addons',
        'testimonials','faq_items','bookings'
      )
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Public read (published / active only) ---------------------------------------
create policy "public read published gallery"
  on public.gallery_items for select
  to anon, authenticated
  using (status = 'published');

create policy "public read active services"
  on public.services for select
  to anon, authenticated
  using (is_active = true);

create policy "public read pricing tiers"
  on public.pricing_tiers for select
  to anon, authenticated
  using (true);

create policy "public read pricing addons"
  on public.pricing_addons for select
  to anon, authenticated
  using (true);

create policy "public read published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published = true);

create policy "public read published faq"
  on public.faq_items for select
  to anon, authenticated
  using (is_published = true);

-- Bookings: anyone may create, only admins may read/update/delete -------------
create policy "anyone can create booking"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

create policy "admins read bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "admins update bookings"
  on public.bookings for update
  to authenticated
  using (true) with check (true);

create policy "admins delete bookings"
  on public.bookings for delete
  to authenticated
  using (true);

-- Authenticated (admin) full write access on content tables -------------------
do $$
declare t text;
begin
  foreach t in array array[
    'gallery_items','services','pricing_tiers','pricing_addons','testimonials','faq_items'
  ]
  loop
    execute format($f$
      create policy "admins read all %1$s" on public.%1$s
        for select to authenticated using (true);
      create policy "admins insert %1$s" on public.%1$s
        for insert to authenticated with check (true);
      create policy "admins update %1$s" on public.%1$s
        for update to authenticated using (true) with check (true);
      create policy "admins delete %1$s" on public.%1$s
        for delete to authenticated using (true);
    $f$, t);
  end loop;
end $$;

-- =============================================================================
-- SEED DATA  (mirrors src/lib/data/fallback.ts so live == local preview)
-- Photos use Unsplash placeholders — replace image_url / avatar_url with your
-- own studio photos (ideally uploaded to Supabase Storage).
-- =============================================================================

insert into public.gallery_items (title, category, image_url, alt_text, duration_minutes, starting_price, tags, status, sort_order) values
  ('Soft Glam French', 'French',       'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=70', 'French nails nuansa nude',           90,  150000, array['Simple','Short Nails'], 'published', 1),
  ('Korean Milky Gel', 'Korean Style', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=70', 'Gel nails ala Korea warna milky',    120, 200000, array['Gel','Luxury'],          'published', 2),
  ('Chrome Rose',      'Chrome',       'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=70', 'Chrome nails warna rose gold',       120, 220000, array['Luxury','Long Nails'],   'published', 3),
  ('Wedding Pearl',    'Wedding',      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=70', 'Nail art pernikahan dengan mutiara', 150, 300000, array['Wedding','Luxury'],      'published', 4),
  ('Cat Eye Galaxy',   'Cat Eye',      'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=70', 'Cat eye nail art efek galaxy',       120, 230000, array['Luxury','Long Nails'],   'published', 5),
  ('Minimal Nude',     'Simple',       'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=70', 'Desain kuku minimalis nude',         60,  120000, array['Simple','Short Nails'],  'published', 6),
  ('Glitter Ombre',    'Ombre',        'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=70', 'Ombre glitter pink',                 110, 200000, array['Glitter'],               'published', 7),
  ('Character Art',    'Character',    'https://images.unsplash.com/photo-1632344004415-bb22fa8ee32a?auto=format&fit=crop&w=900&q=70', 'Nail art karakter custom',           140, 250000, array['Character','Long Nails'],'published', 8)
on conflict do nothing;

insert into public.services (name, description, duration_minutes, price, icon, sort_order, is_active) values
  ('Gel Polish',         'Cat kuku gel tahan lama, kilap maksimal hingga 3 minggu.',           60,  120000, 'Sparkles', 1, true),
  ('Soft Gel Extension', 'Perpanjangan kuku ringan dan natural, nyaman dipakai harian.',       120, 220000, 'Hand',     2, true),
  ('Nail Art Custom',    'Desain sesuai keinginan — dari simple hingga detail mewah.',         120, 180000, 'Palette',  3, true),
  ('Korean Style Set',   'Tampilan bersih ala salon Korea: glossy, rapi, elegan.',             120, 230000, 'Gem',      4, true),
  ('Manicure & Care',    'Perawatan kutikula dan pelembap agar kuku sehat.',                   45,  90000,  'Flower2',  5, true),
  ('Nail Repair',        'Perbaikan kuku patah atau lepas dengan cepat.',                      30,  40000,  'Wrench',   6, true)
on conflict do nothing;

insert into public.pricing_tiers (name, price, highlight, features, sort_order) values
  ('Basic',   120000, false, array['Gel polish 1 warna','Bentuk & rapikan kuku','Base & top coat','Tahan ±2 minggu'],       1),
  ('Premium', 220000, true,  array['Semua di Basic','Soft gel extension','2–3 aksen nail art','Konsultasi desain'],         2),
  ('Luxury',  350000, false, array['Semua di Premium','Full custom design','Chrome / cat eye / mutiara','Prioritas booking'],3)
on conflict do nothing;

insert into public.pricing_addons (name, price_from, sort_order) values
  ('Tambahan nail art (per kuku)',     10000, 1),
  ('Tambahan extension (per set)',     80000, 2),
  ('Repair / perbaikan (per kuku)',    15000, 3)
on conflict do nothing;

insert into public.testimonials (customer_name, avatar_url, rating, comment, is_published, sort_order) values
  ('Dinda P.',  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=70', 5, 'Hasilnya rapi banget dan tahan lama. Tempatnya nyaman, mbaknya ramah!', true, 1),
  ('Sarah W.',  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=70', 5, 'Korean style-nya juara. Persis seperti referensi yang aku kasih.',      true, 2),
  ('Nabila R.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=70', 5, 'Booking gampang lewat WhatsApp, on time, hasil memuaskan banget.',      true, 3),
  ('Kirana M.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=70', 4, 'Desain wedding-ku cantik dan elegan. Recommended buat acara spesial.',  true, 4)
on conflict do nothing;

insert into public.faq_items (question, answer, sort_order, is_published) values
  ('Berapa lama waktu pengerjaan?', 'Tergantung layanan: gel polish ±60 menit, extension & nail art custom 2–2,5 jam. Estimasi waktu tertera di setiap desain galeri.', 1, true),
  ('Bagaimana cara booking?',       'Klik tombol Book Now / WhatsApp, atau isi form booking di website. Kami konfirmasi jadwal lewat WhatsApp.',                          2, true),
  ('Apakah menerima custom design?','Tentu! Kirim foto referensi saat booking, dan kami bantu wujudkan sedekat mungkin dengan keinginanmu.',                            3, true),
  ('Berapa lama ketahanan gel?',    'Gel polish umumnya tahan 2–3 minggu, extension bisa lebih lama dengan perawatan yang tepat.',                                       4, true),
  ('Apakah aman untuk kuku?',       'Kami pakai produk berkualitas dan teknik aplikasi yang benar agar kuku asli tetap sehat.',                                          5, true)
on conflict do nothing;

-- =============================================================================
-- STORAGE
-- Public bucket "gallery" for gallery + content images (admin uploads here).
-- Optional bucket "references" for customer booking reference photos.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('references', 'references', true)
on conflict (id) do nothing;

-- Storage policies ------------------------------------------------------------
drop policy if exists "public read gallery objects"   on storage.objects;
drop policy if exists "admins write gallery objects"   on storage.objects;
drop policy if exists "admins update gallery objects"  on storage.objects;
drop policy if exists "admins delete gallery objects"  on storage.objects;
drop policy if exists "public read reference objects"  on storage.objects;
drop policy if exists "anyone upload reference object" on storage.objects;

-- gallery bucket: world-readable, admin-writable
create policy "public read gallery objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

create policy "admins write gallery objects"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "admins update gallery objects"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery') with check (bucket_id = 'gallery');

create policy "admins delete gallery objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');

-- references bucket: world-readable, anyone may upload a booking reference
create policy "public read reference objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'references');

create policy "anyone upload reference object"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'references');

-- =============================================================================
-- DONE.
-- Next: create an admin user in Authentication → Users (email + password),
-- then log in at /admin/login.
-- =============================================================================
