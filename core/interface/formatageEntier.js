/**
 * Fichier : core/interface/formatageEntier.js
 * Rôle : formater les quantités entières.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture.
 */

/**
 * Formate un nombre en entier lisible.
 *
 * @param {number|string} valeur - Valeur à formater.
 * @returns {string} Entier formaté, par exemple « 1 234 ».
 */
export function formaterEntier(valeur) {
  const nombre = Number(valeur);

  if (!Number.isFinite(nombre)) {
    return '0';
  }

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(nombre);
}

/**
 * Formate une quantité avec son unité.
 *
 * @param {number|string} valeur - Quantité à formater.
 * @param {string} unite - Unité à afficher.
 * @returns {string} Quantité formatée, par exemple « 3 tickets ».
 */
export function formaterQuantiteAvecUnite(valeur, unite) {
  const nombre = Number(valeur);

  if (!Number.isFinite(nombre)) {
    return `0 ${unite}`;
  }

  return `${formaterEntier(nombre)} ${unite}`;
}