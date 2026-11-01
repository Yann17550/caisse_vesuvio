/**
 * Fichier : clotures-vesuvio/soir/calculSoir.js
 * Rôle : collecter les totaux du Soir depuis les pages.
 *
 * Reprend la logique de l’ancien soirTotals.js :
 * le total des encaissements exclut MyPOS.
 */

import {
  convertirEnMontant,
} from '../../../core/montants/conversionMontants.js';

function lireMontantTexte(id) {
  const element = document.getElementById(id);

  return element ? convertirEnMontant(element.textContent) || 0 : 0;
}

function lireNombreTexte(id) {
  const element = document.getElementById(id);
  const valeur = element ? Number(element.textContent) : 0;

  return Number.isFinite(valeur) ? valeur : 0;
}

/**
 * Collecte les totaux du Soir.
 *
 * @returns {Object} Totaux du Soir.
 */
export function collecterTotauxSoir() {
  const fond = convertirEnMontant(
    document.getElementById('soir-cash-fund')?.value,
  ) || 0;

  const countedTotal = lireMontantTexte('soir-cash-counted-value');
  const adipos = convertirEnMontant(
    document.getElementById('soir-cash-adipos')?.value,
  ) || 0;

  const cash = {
    fond,
    countedTotal,
    adipos,
    difference: arrondir(countedTotal - adipos),
  };

  function lirePaire(prefixe) {
    const contact = convertirEnMontant(
      document.getElementById(`${prefixe}-contact`)?.value,
    ) || 0;

    const sansContact = convertirEnMontant(
      document.getElementById(`${prefixe}-no-contact`)?.value,
    ) || 0;

    return {
      contact,
      sansContact,
      total: arrondir(contact + sansContact),
    };
  }

  const cardClassic = lirePaire('soir-card-classic');
  const cardTr = lirePaire('soir-card-tr');
  const cardAncv = lirePaire('soir-card-ancv');
  const cardAmex = lirePaire('soir-card-amex');

  const myPos = {
    total: lireMontantTexte('soir-card-mypos-total-value'),
    count: document.getElementById('soir-card-mypos-list')
      ? document.getElementById('soir-card-mypos-list')
        .querySelectorAll('li')
        .length
      : 0,
  };

  const ancvPaper = {
    count: lireNombreTexte('soir-ancv-count-value'),
    total: lireMontantTexte('soir-ancv-paper-total-value'),
    nb10: lireNombreTexte('soir-ancv-nb-10'),
    nb20: lireNombreTexte('soir-ancv-nb-20'),
    nb25: lireNombreTexte('soir-ancv-nb-25'),
    nb50: lireNombreTexte('soir-ancv-nb-50'),
  };

  const checks = {
    total: lireMontantTexte('soir-checks-total-value'),
    count: lireNombreTexte('soir-checks-count'),
  };

  const pizzas = {
    dineIn: Number(
      document.getElementById('soir-recap-dine-in')?.value,
    ) || 0,
    takeaway: Number(
      document.getElementById('soir-recap-takeaway')?.value,
    ) || 0,
  };

  const vat = {
    ttc55: convertirEnMontant(
      document.getElementById('soir-recap-vat-55')?.value,
    ) || 0,
    ttc10: convertirEnMontant(
      document.getElementById('soir-recap-vat-10')?.value,
    ) || 0,
    ttc20: convertirEnMontant(
      document.getElementById('soir-recap-vat-20')?.value,
    ) || 0,
  };

  vat.total = arrondir(vat.ttc55 + vat.ttc10 + vat.ttc20);

  const paymentsTotal = arrondir(
    cash.adipos +
      cardClassic.total +
      cardTr.total +
      cardAncv.total +
      cardAmex.total +
      ancvPaper.total +
      checks.total,
  );

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
    paymentsTotal,
    vatTotal: vat.total,
    totalDifference: arrondir(cash.difference + myPos.total),
  };
}

function arrondir(valeur) {
  return Math.round((Number(valeur) + Number.EPSILON) * 100) / 100;
}