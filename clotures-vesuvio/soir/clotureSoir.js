/**
 * Fichier : clotures-vesuvio/soir/clotureSoir.js
 * Rôle : validation finale et enregistrement du Soir dans Supabase.
 *
 * Reprend exactement le format de l’ancien buildSoirClosingData() :
 * les colonnes correspondent à la table daily_closings.
 */

import {
  enregistrerClotureVesuvio,
  validerClotureVesuvio,
} from '../services/serviceClotureJournaliere.js';

/**
 * Retourne la date métier du Soir.
 *
 * Une clôture réalisée entre minuit et 03:00 appartient à la veille.
 *
 * @returns {string} Date au format YYYY-MM-DD.
 */
function obtenirDateMetier() {
  const maintenant = new Date();
  const dateMetier = new Date(maintenant);

  if (maintenant.getHours() < 3) {
    dateMetier.setDate(dateMetier.getDate() - 1);
  }

  const annee = dateMetier.getFullYear();
  const mois = String(dateMetier.getMonth() + 1).padStart(2, '0');
  const jour = String(dateMetier.getDate()).padStart(2, '0');

  return `${annee}-${mois}-${jour}`;
}

/**
 * Construit les données à enregistrer dans Supabase.
 *
 * @param {Object} totaux - Totaux collectés par calculSoir.js.
 * @returns {Object} Données au format daily_closings.
 */
function construireDonneesCloture(totaux) {
  return {
    cb_classic_contact: totaux.cardClassic.contact,
    cb_classic_no_contact: totaux.cardClassic.noContact,

    cb_tr_contact: totaux.cardTr.contact,
    cb_tr_no_contact: totaux.cardTr.noContact,

    cb_amex_contact: totaux.cardAmex.contact,
    cb_amex_no_contact: totaux.cardAmex.noContact,

    cb_ancv_contact: totaux.cardAncv.contact,
    cb_ancv_no_contact: totaux.cardAncv.noContact,

    ancv_paper_10: totaux.ancvPaper.nb10,
    ancv_paper_20: totaux.ancvPaper.nb20,
    ancv_paper_25: totaux.ancvPaper.nb25,
    ancv_paper_50: totaux.ancvPaper.nb50,

    mypos: totaux.myPos.total,
    mypos_count: totaux.myPos.count,

    cb_classic: totaux.cardClassic.total,
    cb_ticket_resto: totaux.cardTr.total,
    cb_amex: totaux.cardAmex.total,
    ancv_connect: totaux.cardAncv.total,

    cash_counted: totaux.cash.countedTotal,
    cash_adipos: totaux.cash.adipos,
    cash_delta: totaux.cash.difference,

    ancv_paper: totaux.ancvPaper.total,
    checks_total: totaux.checks.total,
    checks_count: totaux.checks.count,

    vat_5_5: totaux.vat.ttc55,
    vat_10: totaux.vat.ttc10,
    vat_20: totaux.vat.ttc20,

    pizzas_dine_in: totaux.pizzas.dineIn,
    pizzas_takeaway: totaux.pizzas.takeaway,

    total_revenue: totaux.vatTotal,
  };
}

/**
 * Valide la cohérence TVA / encaissements.
 *
 * @param {Object} totaux - Totaux du Soir.
 * @returns {Object} Résultat du contrôle.
 */
function validerCoherence(totaux) {
  const ecart = Math.round(
    (totaux.vatTotal - totaux.paymentsTotal + Number.EPSILON) * 100,
  ) / 100;

  return {
    estCoherent: Math.abs(ecart) <= 0.005,
    ecart,
  };
}

/**
 * Valide et enregistre la clôture du Soir.
 *
 * @param {Object} parametres - Paramètres.
 * @param {Object} parametres.totaux - Totaux collectés.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 * @returns {Promise<Object>} Résultat.
 */
export async function validerEtEnregistrerSoir({
  totaux,
  etablissementId,
}) {
  const coherence = validerCoherence(totaux);

  if (!coherence.estCoherent) {
    return {
      succes: false,
      message:
        `Validation impossible : écart de ${coherence.ecart.toFixed(2)} € ` +
        'entre les encaissements et la TVA.',
    };
  }

  const dateActivite = obtenirDateMetier();
  const donnees = construireDonneesCloture(totaux);

  await enregistrerClotureVesuvio({
    dateActivite,
    service: 'soir',
    donnees,
    etablissementId,
  });

  await validerClotureVesuvio({
    dateActivite,
    service: 'soir',
    etablissementId,
  });

  return {
    succes: true,
    message: 'Soir enregistré et validé dans Supabase.',
  };
}