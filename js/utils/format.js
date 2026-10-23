/**
 * Fichier : js/utils/format.js
 * Rôle : fournir des fonctions de formatage réutilisables.
 *
 * Ces fonctions ne doivent contenir aucune logique métier
 * et ne doivent jamais modifier le DOM.
 *
 * Inputs :
 *  - Valeurs numériques, textuelles ou dates.
 *
 * Outputs :
 *  - Chaînes formatées pour l’affichage.
 *
 * Dépendances :
 *  - Aucune.
 */

/**
 * Formate un nombre en euros pour l’affichage.
 *
 * @param {number|string} value - Montant à formater.
 * @returns {string} Montant formaté, par exemple « 12,50 € ».
 */
export function formatEuro(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return '0,00 €';
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Formate une date au format français : 22/10/2026.
 *
 * @param {Date|string} value - Date à formater.
 * @returns {string} Date formatée ou chaîne vide si invalide.
 */
export function formatDateFr(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate un nombre entier pour l’affichage français.
 *
 * @param {number|string} value - Nombre à formater.
 * @returns {string} Nombre formaté ou « 0 » si invalide.
 */
export function formatInteger(value) {
  const number = Number(value);

  if (!Number.isInteger(number)) {
    return '0';
  }

  return new Intl.NumberFormat('fr-FR').format(number);
}