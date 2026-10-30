/**
 * Fichier : clotures-vesuvio/midi/affichageRecapitulatifMidi.js
 * Rôle : afficher le récapitulatif du Midi.
 *
 * Ce module ne contient aucune règle métier de validation.
 */

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../core/montants/conversionMontants.js';

import { formaterEuro } from '../../core/interface/formatageEuro.js';

/**
 * Calcule le total encaissé hors MyPOS.
 *
 * @param {Object} donnees - Données du formulaire.
 * @returns {number} Total encaissé hors MyPOS.
 */
export function calculerTotalEncaisse(donnees) {
  const total =
    convertirEnMontant(donnees.cbClassique) +
    convertirEnMontant(donnees.cbTicketRestaurant) +
    convertirEnMontant(donnees.cashAdipos) +
    convertirEnMontant(donnees.ancvPapier) +
    convertirEnMontant(donnees.ancvDematerialise) +
    convertirEnMontant(donnees.cheques);

  return arrondirADeuxDecimales(total);
}

/**
 * Calcule le total de TVA TTC.
 *
 * @param {Object} donnees - Données du formulaire.
 * @returns {number} Total de TVA.
 */
export function calculerTotalTva(donnees) {
  const total =
    convertirEnMontant(donnees.tva55) +
    convertirEnMontant(donnees.tva10) +
    convertirEnMontant(donnees.tva20);

  return arrondirADeuxDecimales(total);
}

/**
 * Affiche le récapitulatif dans des éléments DOM.
 *
 * @param {HTMLElement|null} elementEncaisse - Élément du total encaissé.
 * @param {HTMLElement|null} elementTva - Élément du total TVA.
 * @param {Object} donnees - Données du formulaire.
 */
export function afficherRecapitulatif(
  elementEncaisse,
  elementTva,
  donnees,
) {
  if (elementEncaisse) {
    elementEncaisse.textContent = formaterEuro(
      calculerTotalEncaisse(donnees),
    );
  }

  if (elementTva) {
    elementTva.textContent = formaterEuro(
      calculerTotalTva(donnees),
    );
  }
}