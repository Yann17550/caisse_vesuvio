/**
 * Fichier : clotures-vesuvio/midi/clotureMidi.js
 * Rôle : validation finale et enregistrement du Midi dans Supabase.
 */

import {
  convertirEnMontant,
} from '../../core/montants/conversionMontants.js';

import {
  validerCoherenceMidi,
} from './calculMidi.js';

import {
  enregistrerClotureVesuvio,
  validerClotureVesuvio,
} from '../services/serviceClotureJournaliere.js';

/**
 * Retourne la date du jour au format ISO.
 *
 * @returns {string} Date YYYY-MM-DD.
 */
function obtenirDateActivite() {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
  const jour = String(maintenant.getDate()).padStart(2, '0');

  return `${annee}-${mois}-${jour}`;
}

/**
 * Valide les données du Midi.
 *
 * @param {Object} donnees - Données brutes.
 * @param {Object} totaux - Totaux calculés.
 * @returns {Object} Résultat de validation.
 */
function validerDonnees(donnees, totaux) {
  const champsMontants = [
    'cbClassique',
    'cbTicketResto',
    'cashAdipos',
    'ancvPaper',
    'ancvConnect',
    'checks',
    'vat55',
    'vat10',
    'vat20',
  ];

  for (const champ of champsMontants) {
    const montant = convertirEnMontant(donnees[champ]);

    if (montant === null || montant < 0) {
      return {
        succes: false,
        message: 'Midi : saisir des montants valides et positifs.',
      };
    }
  }

  const coherence = validerCoherenceMidi(totaux);

  if (!coherence.estCoherent) {
    return {
      succes: false,
      message: `Validation impossible : écart de ${coherence.ecart.toFixed(2)} € entre les encaissements et la TVA.`,
    };
  }

  return {
    succes: true,
    message: null,
  };
}

/**
 * Valide et enregistre la clôture du Midi.
 *
 * @param {Object} parametres - Paramètres.
 * @param {Object} parametres.donnees - Données brutes.
 * @param {Object} parametres.totaux - Totaux calculés.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 * @returns {Promise<Object>} Résultat.
 */
export async function validerEtEnregistrerMidi({
  donnees,
  totaux,
  etablissementId,
}) {
  const validation = validerDonnees(donnees, totaux);

  if (!validation.succes) {
    return validation;
  }

  const dateActivite = obtenirDateActivite();

  const donneesCloture = {
    mypos: totaux.myPos,
    cb_classic: convertirEnMontant(donnees.cbClassique),
    cb_ticket_resto: convertirEnMontant(donnees.cbTicketResto),
    cash_adipos: convertirEnMontant(donnees.cashAdipos),
    ancv_paper: convertirEnMontant(donnees.ancvPaper),
    ancv_connect: convertirEnMontant(donnees.ancvConnect),
    checks_total: convertirEnMontant(donnees.checks),
    vat_5_5: convertirEnMontant(donnees.vat55),
    vat_10: convertirEnMontant(donnees.vat10),
    vat_20: convertirEnMontant(donnees.vat20),
    pizzas_dine_in: Number(donnees.pizzasDineIn) || 0,
    pizzas_takeaway: Number(donnees.pizzasTakeaway) || 0,
  };

  await enregistrerClotureVesuvio({
    dateActivite,
    service: 'midi',
    donnees: donneesCloture,
    etablissementId,
  });

  await validerClotureVesuvio({
    dateActivite,
    service: 'midi',
    etablissementId,
  });

  return {
    succes: true,
    message: 'Midi enregistré et validé dans Supabase.',
  };
}