/**
 * Fichier : js/utils/closingValidation.js
 * Rôle : validation générique de cohérence d'une clôture de caisse.
 *
 * Cette règle est indépendante du DOM et du service (Midi ou Soir).
 * Elle reçoit des nombres et retourne un résultat testable.
 *
 * Règle :
 * totalAttendu = totalSaisi
 *
 * Le rapprochement est fait au centime pour éviter les écarts
 * liés aux calculs flottants.
 */

/**
 * Arrondit un montant à 2 décimales.
 *
 * @param {number} value - Montant à arrondir.
 * @returns {number} Montant arrondi au centime.
 */
function roundToCents(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Valide la cohérence entre un total attendu et un total saisi.
 *
 * @param {Object} totals - Totaux à comparer.
 * @param {number} totals.expectedTotal - Total attendu (ex. somme des TTC).
 * @param {number} totals.actualTotal - Total constaté (ex. somme des encaissements).
 * @returns {Object} Résultat de la validation.
 */
export function validateClosingTotals({ expectedTotal, actualTotal }) {
  const expectedCents = Math.round(expectedTotal * 100);
  const actualCents = Math.round(actualTotal * 100);

  const differenceCents = expectedCents - actualCents;
  const difference = differenceCents / 100;

  return {
    isValid: differenceCents === 0,
    difference,
  };
}