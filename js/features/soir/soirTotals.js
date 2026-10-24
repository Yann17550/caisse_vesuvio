/**
 * Fichier : js/features/soir/soirTotals.js
 * Rôle : source de vérité des totaux de la clôture du Soir.
 *
 * Chaque type de paiement est capturé individuellement,
 * afin de permettre :
 * - un contrôle de cohérence précis ;
 * - un enregistrement Supabase détaillé ;
 * - des statistiques fines par type de paiement
 *   (ex. CB contact vs sans contact).
 *
 * Règle métier :
 * Le total des encaissements (paymentsTotal) exclut le myPOS.
 */

import { getAmountFromText, getAmountFromInput } from '../../utils/amounts.js';

/**
 * Lit les totaux détaillés de la clôture du Soir.
 *
 * @returns {Object} Détail complet des paiements et totaux.
 */
export function getSoirTotals() {
  // --- Espèces ---
  const cash = {
    fund: getAmountFromInput(document.getElementById('soir-cash-fund')),
    countedTotal: getAmountFromText(
      document.getElementById('soir-cash-counted-total'),
    ),
    adipos: getAmountFromInput(
      document.getElementById('soir-cash-adipos'),
    ),
  };

  cash.difference = cash.countedTotal - cash.adipos;

  // --- CB classique ---
  const cardClassic = {
    contact: getAmountFromInput(
      document.getElementById('soir-card-classic-contact'),
    ),
    noContact: getAmountFromInput(
      document.getElementById('soir-card-classic-no-contact'),
    ),
  };

  cardClassic.total = cardClassic.contact + cardClassic.noContact;

  // --- CB Ticket Restaurant ---
  const cardTr = {
    contact: getAmountFromInput(
      document.getElementById('soir-card-tr-contact'),
    ),
    noContact: getAmountFromInput(
      document.getElementById('soir-card-tr-no-contact'),
    ),
  };

  cardTr.total = cardTr.contact + cardTr.noContact;

  // --- CB ANCV (télécollecte) ---
  const cardAncv = {
    contact: getAmountFromInput(
      document.getElementById('soir-card-ancv-contact'),
    ),
    noContact: getAmountFromInput(
      document.getElementById('soir-card-ancv-no-contact'),
    ),
  };

  cardAncv.total = cardAncv.contact + cardAncv.noContact;

  // --- AMEX ---
  const cardAmex = {
    contact: getAmountFromInput(
      document.getElementById('soir-card-amex-contact'),
    ),
    noContact: getAmountFromInput(
      document.getElementById('soir-card-amex-no-contact'),
    ),
  };

  cardAmex.total = cardAmex.contact + cardAmex.noContact;

  // --- myPOS ---
  const myPos = {
    total: getAmountFromText(
      document.getElementById('soir-card-mypos-total'),
    ),
  };

  // --- ANCV papier (par dénomination) ---
  const ancvPaper = {
    nb10: getAmountFromInput(document.getElementById('soir-ancv-nb-10')),
    nb20: getAmountFromInput(document.getElementById('soir-ancv-nb-20')),
    nb25: getAmountFromInput(document.getElementById('soir-ancv-nb-25')),
    nb50: getAmountFromInput(document.getElementById('soir-ancv-nb-50')),
  };

  ancvPaper.total = getAmountFromText(
    document.getElementById('soir-ancv-grand-total'),
  );

  // --- Chèques ---
  const checks = {
    total: getAmountFromText(
      document.getElementById('soir-checks-total'),
    ),
    count: Number(
      document.getElementById('soir-checks-count').textContent,
    ),
  };

  // --- TVA (montants TTC saisis) ---
  const vat = {
    ttc55: getAmountFromInput(
      document.getElementById('soir-recap-vat-55'),
    ),
    ttc10: getAmountFromInput(
      document.getElementById('soir-recap-vat-10'),
    ),
    ttc20: getAmountFromInput(
      document.getElementById('soir-recap-vat-20'),
    ),
  };

  vat.total = vat.ttc55 + vat.ttc10 + vat.ttc20;

  // --- Totaux de contrôle ---
  // myPOS exclu du total des encaissements.
  const paymentsTotal =
    cash.adipos +
    cardClassic.total +
    cardTr.total +
    cardAncv.total +
    cardAmex.total +
    ancvPaper.total +
    checks.total;

  return {
    cash,
    cardClassic,
    cardTr,
    cardAncv,
    cardAmex,
    myPos,
    ancvPaper,
    checks,
    vat,

    paymentsTotal, // myPOS exclu
    vatTotal: vat.total,

    totalDifference: cash.difference + myPos.total,
  };
}