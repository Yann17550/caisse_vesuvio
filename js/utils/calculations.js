/**
 * Fichier : js/utils/calculations.js
 * Rôle : fournir les calculs et conversions réutilisables de Caisse Vesuvio.
 *
 * Ces fonctions ne doivent contenir aucune logique d’affichage
 * et ne doivent jamais modifier le DOM.
 *
 * Inputs :
 *  - Nombres, montants textuels ou tableaux de nombres.
 *
 * Outputs :
 *  - Nombres valides, arrondis ou calculés.
 *
 * Dépendances :
 *  - Aucune.
 */

/**
 * Convertit une valeur textuelle en nombre.
 *
 * Accepte les formats français et internationaux :
 * - « 12,50 » devient 12.5
 * - « 1 234,56 » devient 1234.56
 * - « 1234.56 » devient 1234.56
 *
 * @param {string|number} value - Valeur à convertir.
 * @returns {number|null} Nombre converti, ou null si invalide.
 */
export function parseAmount(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleanedValue = value
    .trim()
    .replace(/\s/g, '')
    .replace(/€/g, '');

  if (cleanedValue === '') {
    return null;
  }

  let normalizedValue = cleanedValue;

  if (cleanedValue.includes(',') && cleanedValue.includes('.')) {
    normalizedValue = cleanedValue.replace(/\./g, '').replace(',', '.');
  } else if (cleanedValue.includes(',')) {
    normalizedValue = cleanedValue.replace(',', '.');
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

/**
 * Additionne toutes les valeurs d’un tableau.
 *
 * @param {number[]} values - Valeurs à additionner.
 * @returns {number} Total arrondi à deux décimales.
 */
export function sum(values) {
  const total = values.reduce((accumulator, value) => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? accumulator + numericValue
      : accumulator;
  }, 0);

  return roundToTwoDecimals(total);
}

/**
 * Soustrait une valeur à une autre.
 *
 * @param {number} value - Valeur de départ.
 * @param {number} amount - Valeur à soustraire.
 * @returns {number} Résultat arrondi à deux décimales.
 */
export function subtract(value, amount) {
  return roundToTwoDecimals(Number(value) - Number(amount));
}

/**
 * Multiplie une valeur par un coefficient.
 *
 * @param {number} value - Valeur de départ.
 * @param {number} coefficient - Coefficient de multiplication.
 * @returns {number} Résultat arrondi à deux décimales.
 */
export function multiply(value, coefficient) {
  return roundToTwoDecimals(Number(value) * Number(coefficient));
}

/**
 * Divise une valeur par un diviseur.
 *
 * @param {number} value - Valeur de départ.
 * @param {number} divisor - Diviseur.
 * @returns {number} Résultat arrondi à deux décimales.
 * @throws {Error} Si le diviseur est zéro.
 */
export function divide(value, divisor) {
  if (Number(divisor) === 0) {
    throw new Error('Division par zéro impossible.');
  }

  return roundToTwoDecimals(Number(value) / Number(divisor));
}

/**
 * Calcule un pourcentage d’une valeur.
 *
 * @param {number} value - Valeur de départ.
 * @param {number} percentage - Pourcentage, par exemple 5,5.
 * @returns {number} Résultat arrondi à deux décimales.
 */
export function calculatePercentage(value, percentage) {
  return roundToTwoDecimals(
    (Number(value) * Number(percentage)) / 100,
  );
}

/**
 * Arrondit un nombre à deux décimales.
 *
 * @param {number} value - Valeur à arrondir.
 * @returns {number} Valeur arrondie.
 */
export function roundToTwoDecimals(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.round((numericValue + Number.EPSILON) * 100) / 100;
}