-- Ajout de l’établissement aux clôtures journalières.
-- Une clôture est désormais identifiée par :
-- etablissement_id + business_date + service.

alter table public.daily_closings
  add column etablissement_id bigint;

-- Les clôtures de test existantes sont rattachées à Le Vesuvio.
update public.daily_closings
set etablissement_id = 2;

-- La colonne devient obligatoire.
alter table public.daily_closings
  alter column etablissement_id set not null;

-- Lien vers la table des établissements.
alter table public.daily_closings
  add constraint daily_closings_etablissement_fk
  foreign key (etablissement_id)
  references public.etablissements (id);

-- L’ancienne règle ne permettait qu’une clôture Midi et une clôture
-- Soir par jour, tous établissements confondus.
alter table public.daily_closings
  drop constraint daily_closings_unique_service_per_day;

-- Nouvelle règle : une clôture Midi et une clôture Soir par jour
-- et par établissement.
alter table public.daily_closings
  add constraint daily_closings_unique_service_per_day
  unique (etablissement_id, business_date, service);

-- Index utile pour les futures synthèses par établissement.
create index daily_closings_etablissement_idx
  on public.daily_closings (etablissement_id);