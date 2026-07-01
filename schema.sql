-- Krta admin panel schema
create table if not exists products (
  id text primary key,
  name text not null,
  price integer not null,
  sale_price integer,
  category text,
  collection text,
  color text,
  sizes text[] not null default '{}',
  featured boolean not null default false,
  images text[] not null default '{}',   -- public URLs from the product-images bucket
  details text[] not null default '{}',
  description text,
  stock jsonb not null default '{}',      -- e.g. {"S": 5, "M": 3, "L": 0}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text,
  razorpay_payment_id text,
  customer_name text,
  customer_phone text,
  customer_address text,
  items jsonb not null default '[]',      -- [{product_id, name, size, qty, price}]
  amount integer not null default 0,
  status text not null default 'pending', -- pending | paid | shipped | cancelled
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table orders enable row level security;

-- Public (anon) can only READ products; all writes go through the service_role key
-- from server-side admin routes, which bypasses RLS entirely.
create policy "public can read products" on products
  for select using (true);

-- No public policies on orders: only accessible via service_role (server-side).
