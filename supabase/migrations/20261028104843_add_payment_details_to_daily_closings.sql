-- Ajout du détail des paiements et des compteurs à la clôture journalière.
-- Ces colonnes permettent de conserver le niveau fin de saisie
-- et de réaliser ensuite des statistiques par type de paiement.

-- Détail CB classique.
alter table public.daily_closings
  add column cb_classic_contact numeric(12, 2) not null default 0,
  add column cb_classic_no_contact numeric(12, 2) not null default 0;

-- Détail CB Ticket Restaurant.
alter table public.daily_closings
  add column cb_tr_contact numeric(12, 2) not null default 0,
  add column cb_tr_no_contact numeric(12, 2) not null default 0;

-- Détail CB AMEX.
alter table public.daily_closings
  add column cb_amex_contact numeric(12, 2) not null default 0,
  add column cb_amex_no_contact numeric(12, 2) not null default 0;

-- Détail CB ANCV (télécollecte).
alter table public.daily_closings
  add column cb_ancv_contact numeric(12, 2) not null default 0,
  add column cb_ancv_no_contact numeric(12, 2) not null default 0;

-- Détail ANCV papier : nombre de titres par dénomination.
alter table public.daily_closings
  add column ancv_paper_10 integer not null default 0,
  add column ancv_paper_20 integer not null default 0,
  add column ancv_paper_25 integer not null default 0,
  add column ancv_paper_50 integer not null default 0;

-- Compteurs de paiements.
alter table public.daily_closings
  add column checks_count integer not null default 0,
  add column mypos_count integer not null default 0;