-- ============================================================
-- CherryPick — Lemon Squeezy Integration Migration
-- Run this AFTER the initial migration.sql
-- ============================================================

-- Add Lemon Squeezy Variant ID to templates
-- This links each template to a specific Lemon Squeezy product variant
alter table public.templates
  add column if not exists lemon_squeezy_variant_id text;

-- Add Lemon Squeezy order tracking fields to orders
alter table public.orders
  add column if not exists lemon_squeezy_order_id text unique,
  add column if not exists customer_email text;

-- Index for fast webhook lookups
create index if not exists orders_ls_order_id_idx
  on public.orders(lemon_squeezy_order_id);
