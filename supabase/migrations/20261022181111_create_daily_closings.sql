-- Création de la table principale des encaissements journaliers.
-- Une ligne correspond à un service d'une journée : Midi ou Soir.

create type public.service_type as enum (
  'midi',
  'soir'
);

create type public.closing_status as enum (
  'open',
  'closed',
  'closed_restaurant'
);

create table public.daily_closings (
  id uuid primary key default gen_random_uuid(),

  business_date date not null,
  service public.service_type not null,
  status public.closing_status not null default 'open',

  cb_classic numeric(12, 2) not null default 0,
  cb_ticket_resto numeric(12, 2) not null default 0,
  mypos numeric(12, 2) not null default 0,
  cb_amex numeric(12, 2) not null default 0,

  cash_counted numeric(12, 2) not null default 0,
  cash_adipos numeric(12, 2) not null default 0,
  cash_delta numeric(12, 2) not null default 0,

  ancv_paper numeric(12, 2) not null default 0,
  ancv_connect numeric(12, 2) not null default 0,
  checks_total numeric(12, 2) not null default 0,

  vat_5_5 numeric(12, 2) not null default 0,
  vat_10 numeric(12, 2) not null default 0,
  vat_20 numeric(12, 2) not null default 0,

  pizzas_takeaway integer not null default 0,
  pizzas_dine_in integer not null default 0,
  total_revenue numeric(12, 2) not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint daily_closings_unique_service_per_day
    unique (business_date, service)
);

create index daily_closings_business_date_idx
  on public.daily_closings (business_date);