/**
 * Fichier : clotures-vesuvio/midi/calculMidi.js
 * Rôle : calculs et contrôle de cohérence du Midi.
 *
 * Règle métier : le CA hors MyPOS doit être égal à la TVA TTC.
 * L’AMEX n’est pas saisi au Midi.
 */

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../../core/montants/conversionMontants.js';

/**
 * Calcule les totaux du Midi.
 *
 * @param {Object} donnees - Données brutes du formulaire.
 * @returns {Object} Totaux du Midi.
 */
export function calculerTotauxMidi(donnees) {
  const encaissementsHorsMyPos = arrondirADeuxDecimales(
    convertirEnMontant(donnees.cbClassique) +
      convertirEnMontant(donnees.cbTicketResto) +
      convertirEnMontant(donnees.cashAdipos) +
      convertirEnMontant(donnees.ancvPaper) +
      convertirEnMontant(donnees.ancvConnect) +
      convertirEnMontant(donnees.checks),
  );

  const tvaTtc = arrondirADeuxDecimales(
    convertirEnMontant(donnees.vat55) +
      convertirEnMontant(donnees.vat10) +
      convertirEnMontant(donnees.vat20),
  );

  const myPos = arrondirADeuxDecimales(
    convertirEnMontant(donnees.myPosTotal) || 0,
  );

  return {
    encaissementsHorsMyPos,
    tvaTtc,
    myPos,
    ecart: arrondirADeuxDecimales(tvaTtc - encaissementsHorsMyPos),
  };
}

/**
 * Vérifie la cohérence TVA / encaissements.
 *
 * @param {Object} totaux - Totaux du Midi.
 * @returns {Object} Résultat du contrôle.
 */
export function validerCoherenceMidi(totaux) {
  const estCoherent = totaux.ecart === 0;

  return {
    estCoherent,
    ecart: totaux.ecart,
  };
}