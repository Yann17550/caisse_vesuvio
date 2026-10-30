/**
 * Fichier : core/montants/operationsMontants.js
 * Rôle : fournir les opérations réutilisables sur les montants.
 *
 * Ces fonctions sont génériques et réutilisables par toutes
 * les applications : accueil, clôtures Vesuvio, clôtures Pizza
 * d’Oléron, facturation, TVA, etc.
 *
 * Elles ne contiennent aucune règle métier de clôture,
 * aucune manipulation du DOM et aucun accès à Supabase.
 *
 * Dépendances :
 * - core/montants/conversionMontants.js
 */

import {
  arrondirADeuxDecimales,
} from './conversionMontants.js';

/**
 * Additionne toutes les valeurs numériques d’un tableau.
 *
 * Les valeurs non numériques sont ignorées.
 *
 * @param {Array<number|string>} valeurs - Valeurs à additionner.
 * @returns {number} Total arrondi à deux décimales.
 */
export function calculerSomme(valeurs) {
  if (!Array.isArray(valeurs)) {
    return 0;
  }

  const total = valeurs.reduce((accumulateur, valeur) => {
    const valeurNumerique = Number(valeur);

    return Number.isFinite(valeurNumerique)
      ? accumulateur + valeurNumerique
      : accumulateur;
  }, 0);

  return arrondirADeuxDecimales(total);
}

/**
 * Soustrait un montant à une valeur de départ.
 *
 * @param {number|string} valeur - Valeur de départ.
 * @param {number|string} montant - Montant à soustraire.
 * @returns {number} Résultat arrondi à deux décimales.
 */
export function calculerDifference(valeur, montant) {
  return arrondirADeuxDecimales(
    Number(valeur) - Number(montant),
  );
}

/**
 * Multiplie une valeur par un coefficient.
 *
 * @param {number|string} valeur - Valeur de départ.
 * @param {number|string} coefficient - Coefficient de multiplication.
 * @returns {number} Résultat arrondi à deux décimales.
 */
export function calculerProduit(valeur, coefficient) {
  return arrondirADeuxDecimales(
    Number(valeur) * Number(coefficient),
  );
}

/**
 * Divise une valeur par un diviseur.
 *
 * @param {number|string} valeur - Valeur de départ.
 * @param {number|string} diviseur - Diviseur.
 * @returns {number} Résultat arrondi à deux décimales.
 * @throws {Error} Si le diviseur est zéro.
 */
export function calculerQuotient(valeur, diviseur) {
  if (Number(diviseur) === 0) {
    throw new Error('Division par zéro impossible.');
  }

  return arrondirADeuxDecimales(
    Number(valeur) / Number(diviseur),
  );
}

/**
 * Calcule un pourcentage d’une valeur.
 *
 * @param {number|string} valeur - Valeur de départ.
 * @param {number|string} pourcentage - Pourcentage, par exemple 5,5.
 * @returns {number} Résultat arrondi à deux décimales.
 */
export function calculerPourcentage(valeur, pourcentage) {
  return arrondirADeuxDecimales(
    (Number(valeur) * Number(pourcentage)) / 100,
  );
}