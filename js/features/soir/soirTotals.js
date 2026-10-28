/**
 * Fichier : js/features/soir/soirTotals.js
 * Rôle : source de vérité des totaux de la clôture du Soir.
 *
 * Chaque type de paiement est capturé individuellement.
 *
 * Les totaux ANCV papier, chèques et espèces sont lus dans les
 * spans cachés des pages respectives (toujours présents dans le DOM),
 * pas dans le titre de page qui est recréé à chaque navigation.
 *
 * Règle métier :
 * Le total des encaissements (paymentsTotal) exclut le myPOS.
 */

import { getAmountFromText, getAmountFromInput } from '../../utils/amounts.js';
import { getQuantityFromInput } from '../../utils/amounts.js';

// Lit un montant depuis un span caché ; retourne 0 si absent.
function getHiddenAmount(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    return 0;
  }

  return getAmountFromText(element);
}

// Lit un compteur depuis un span ; retourne 0 si absent.
function getHiddenCount(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    return 0;
  }

  const value = Number(element.textContent);

  return Number.isFinite(value) ? value : 0;
}

/**
 * Lit les totaux détaillés de la clôture du Soir.
 *
 * @returns {Object} Détail complet des paiements et totaux.
 */
export function getSoirTotals() {
  // --- Espèces ---
  const cash = {
    fund: getAmountFromInput(document.getElementById('soir-cash-fund')),
    countedTotal: getHiddenAmount('soir-cash-counted-value'),
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

  // --- ANCV connecté (télécollecte) : cumul contact + sans contact ---
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
  // Le nombre de paiements est lu directement dans la liste :
  // chaque ligne correspond à un paiement MyPOS.
  const myPosListElement = document.getElementById('soir-card-mypos-list');

  const myPos = {
    total: getHiddenAmount('soir-card-mypos-total-value'),
    count: myPosListElement
      ? myPosListElement.querySelectorAll('li').length
      : 0,
  };

  // --- ANCV papier ---
  const ancvPaper = {
    count: getHiddenCount('soir-ancv-count-value'),
    total: getHiddenAmount('soir-ancv-paper-total-value'),
    nb10: getHiddenCount('soir-ancv-nb-10'),
    nb20: getHiddenCount('soir-ancv-nb-20'),
    nb25: getHiddenCount('soir-ancv-nb-25'),
    nb50: getHiddenCount('soir-ancv-nb-50'),
  };

  // --- Chèques ---
  const checks = {
    total: getHiddenAmount('soir-checks-total-value'),
    count: getHiddenCount('soir-checks-count'),
  };

  // --- Fréquentation ---
  const pizzas = {
    dineIn: getQuantityFromInput(
      document.getElementById('soir-recap-dine-in'),
    ),
    takeaway: getQuantityFromInput(
      document.getElementById('soir-recap-takeaway'),
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
    pizzas,
    vat,

    paymentsTotal, // myPOS exclu
    vatTotal: vat.total,

    totalDifference: cash.difference + myPos.total,
  };
}