/**
 * Fichier : js/utils/amounts.js
 * Rôle : lecture et conversion des montants.
 */

/**
 * Lit un montant depuis le texte d'un élément (ex. "1 250,00 €").
 *
 * @param {HTMLElement} element - Élément contenant le montant.
 * @returns {number} Montant numérique, 0 si illisible.
 */
export function getAmountFromText(element) {
  if (!element) return 0;

  const value = Number(
    element.textContent.replace('€', '').replace(/\s/g, '').replace(',', '.'),
  );

  return Number.isFinite(value) ? value : 0;
}

/**
 * Lit un montant depuis un champ de saisie.
 *
 * @param {HTMLInputElement} input - Champ de saisie.
 * @returns {number} Montant numérique, 0 si vide ou invalide.
 */
export function getAmountFromInput(input) {
  if (!input) return 0;

  const value = Number(input.value.replace(',', '.'));

  return Number.isFinite(value) ? value : 0;
}