-- ============================================================
-- CherryPick Template Marketplace - Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type public.user_role as enum ('admin', 'customer');
create type public.template_status as enum ('published', 'draft', 'wip');
create type public.order_status as enum ('pending', 'completed', 'refunded', 'cancelled');

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with role information
-- ============================================================

create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  role        public.user_role not null default 'customer',
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- CATEGORIES
-- ============================================================

create table public.categories (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  icon_url      text,
  is_coming_soon boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index categories_slug_idx on public.categories(slug);
create index categories_sort_order_idx on public.categories(sort_order);

-- ============================================================
-- TEMPLATES
-- ============================================================

create table public.templates (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  description   text,
  price         numeric(10, 2) not null default 0,
  category_id   uuid references public.categories(id) on delete set null,
  is_featured   boolean not null default false,
  is_new        boolean not null default true,
  status        public.template_status not null default 'draft',
  file_type     text,
  file_size     text,
  product_type  text,
  rating        numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  sales_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index templates_slug_idx on public.templates(slug);
create index templates_status_idx on public.templates(status);
create index templates_featured_idx on public.templates(is_featured) where is_featured = true;
create index templates_category_idx on public.templates(category_id);
create index templates_created_at_idx on public.templates(created_at desc);

create trigger templates_updated_at
  before update on public.templates
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- TEMPLATE IMAGES
-- ============================================================

create table public.template_images (
  id           uuid primary key default uuid_generate_v4(),
  template_id  uuid not null references public.templates(id) on delete cascade,
  image_url    text not null,
  alt_text     text,
  sort_order   integer not null default 0,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now()
);

create index template_images_template_idx on public.template_images(template_id);
create index template_images_sort_idx on public.template_images(template_id, sort_order);

-- Ensure only one primary image per template
create unique index template_images_one_primary_idx 
  on public.template_images(template_id) 
  where is_primary = true;

-- ============================================================
-- REVIEWS
-- ============================================================

create table public.reviews (
  id             uuid primary key default uuid_generate_v4(),
  template_id    uuid references public.templates(id) on delete cascade,
  author_name    text not null,
  author_role    text,
  author_avatar  text,
  rating         integer not null default 5 check (rating >= 1 and rating <= 5),
  content        text not null,
  created_at     timestamptz not null default now()
);

create index reviews_template_idx on public.reviews(template_id);

-- ============================================================
-- FAQS
-- ============================================================

create table public.faqs (
  id          uuid primary key default uuid_generate_v4(),
  question    text not null,
  answer      text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index faqs_sort_order_idx on public.faqs(sort_order);

-- ============================================================
-- ORDERS
-- ============================================================

create table public.orders (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete set null,
  template_id   uuid references public.templates(id) on delete set null,
  status        public.order_status not null default 'pending',
  total_amount  numeric(10, 2) not null,
  created_at    timestamptz not null default now()
);

create index orders_user_idx on public.orders(user_id);
create index orders_template_idx on public.orders(template_id);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.templates enable row level security;
alter table public.template_images enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;
alter table public.orders enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- ---- PROFILES ----
create policy "Profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can update all profiles" on public.profiles
  for update using (public.is_admin());

-- ---- CATEGORIES ----
create policy "Categories are publicly readable" on public.categories
  for select using (true);

create policy "Only admins can insert categories" on public.categories
  for insert with check (public.is_admin());

create policy "Only admins can update categories" on public.categories
  for update using (public.is_admin());

create policy "Only admins can delete categories" on public.categories
  for delete using (public.is_admin());

-- ---- TEMPLATES ----
create policy "Published templates are publicly readable" on public.templates
  for select using (status = 'published' or public.is_admin());

create policy "Only admins can insert templates" on public.templates
  for insert with check (public.is_admin());

create policy "Only admins can update templates" on public.templates
  for update using (public.is_admin());

create policy "Only admins can delete templates" on public.templates
  for delete using (public.is_admin());

-- ---- TEMPLATE IMAGES ----
create policy "Template images are publicly readable" on public.template_images
  for select using (
    exists (
      select 1 from public.templates t
      where t.id = template_id and (t.status = 'published' or public.is_admin())
    )
  );

create policy "Only admins can insert template images" on public.template_images
  for insert with check (public.is_admin());

create policy "Only admins can update template images" on public.template_images
  for update using (public.is_admin());

create policy "Only admins can delete template images" on public.template_images
  for delete using (public.is_admin());

-- ---- REVIEWS ----
create policy "Reviews are publicly readable" on public.reviews
  for select using (true);

create policy "Only admins can insert reviews" on public.reviews
  for insert with check (public.is_admin());

create policy "Only admins can update reviews" on public.reviews
  for update using (public.is_admin());

create policy "Only admins can delete reviews" on public.reviews
  for delete using (public.is_admin());

-- ---- FAQS ----
create policy "FAQs are publicly readable" on public.faqs
  for select using (true);

create policy "Only admins can insert faqs" on public.faqs
  for insert with check (public.is_admin());

create policy "Only admins can update faqs" on public.faqs
  for update using (public.is_admin());

create policy "Only admins can delete faqs" on public.faqs
  for delete using (public.is_admin());

-- ---- ORDERS ----
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

create policy "Only admins can insert orders" on public.orders
  for insert with check (public.is_admin());

create policy "Only admins can update orders" on public.orders
  for update using (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Create the template-images bucket (run separately in Supabase dashboard or via API)
-- insert into storage.buckets (id, name, public) values ('template-images', 'template-images', true);

-- Storage policies (create in Supabase dashboard > Storage > Policies)
-- Allow public read: bucket = 'template-images', operation = SELECT, policy = true
-- Allow admin write: bucket = 'template-images', operation = INSERT/UPDATE/DELETE, policy = is_admin()
