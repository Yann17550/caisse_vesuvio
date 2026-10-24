alter table daily_closings
  add column if not exists cb_classic_contact numeric default 0,
  add column if not exists cb_classic_no_contact numeric default 0,
  add column if not exists cb_tr_contact numeric default 0,
  add column if not exists cb_tr_no_contact numeric default 0,
  add column if not exists cb_amex_contact numeric default 0,
  add column if not exists cb_amex_no_contact numeric default 0,
  add column if not exists cb_ancv_contact numeric default 0,
  add column if not exists cb_ancv_no_contact numeric default 0,
  add column if not exists ancv_paper_10 integer default 0,
  add column if not exists ancv_paper_20 integer default 0,
  add column if not exists ancv_paper_25 integer default 0,
  add column if not exists ancv_paper_50 integer default 0;