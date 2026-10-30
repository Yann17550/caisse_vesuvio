/**
 * Fichier : core/montants/conversionMontants.js
 * Rôle : fournir la conversion et l’arrondi uniques des montants.
 *
 * Ces fonctions sont génériques et réutilisables par toutes
 * les applications : accueil, clôtures Vesuvio, clôtures Pizza
 * d’Oléron, facturation, TVA, etc.
 *
 * Elles ne contiennent aucune règle métier de clôture,
 * aucune manipulation du DOM et aucun accès à Supabase.
 *
 * Dépendances :
 * - Aucune.
 */

/**
 * Convertit une valeur textuelle ou numérique en montant numérique.
 *
 * Formats acceptés :
 * - « 12,50 » devient 12.5
 * - « 1 234,56 » devient 1234.56
 * - « 1.234,56 » devient 1234.56
 * - « 1234.56 » devient 1234.56
 * - « 1 234,56 € » devient 1234.56
 *
 * @param {string|number} valeur - Valeur à convertir.
 * @returns {number|null} Nombre converti, ou null si invalide.
 */
export function convertirEnMontant(valeur) {
  if (typeof valeur === 'number') {
    return Number.isFinite(valeur) ? valeur : null;
  }

  if (typeof valeur !== 'string') {
    return null;
  }

  const valeurNettoyee = valeur
    .trim()
    .replace(/\s/g, '')
    .replace(/€/g, '');

  if (valeurNettoyee === '') {
    return null;
  }

  let valeurNormalisee = valeurNettoyee;

  if (
    valeurNettoyee.includes(',') &&
    valeurNettoyee.includes('.')
  ) {
    valeurNormalisee = valeurNettoyee
      .replace(/\./g, '')
      .replace(',', '.');
  } else if (valeurNettoyee.includes(',')) {
    valeurNormalisee = valeurNettoyee.replace(',', '.');
  }

  const valeurConvertie = Number(valeurNormalisee);

  return Number.isFinite(valeurConvertie) ? valeurConvertie : null;
}

/**
 * Arrondit un nombre à deux décimales.
 *
 * Une valeur non finie est convertie en 0.
 *
 * @param {number|string} valeur - Valeur à arrondir.
 * @returns {number} Valeur arrondie à deux décimales.
 */
export function arrondirADeuxDecimales(valeur) {
  const valeurNumerique = Number(valeur);

  if (!Number.isFinite(valeurNumerique)) {
    return 0;
  }

  return Math.round(
    (valeurNumerique + Number.EPSILON) * 100,
  ) / 100;
}