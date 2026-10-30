/**
 * Fichier : core/validation/reglesSaisies.js
 * Rôle : fournir les règles de validation génériques des saisies.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture,
 * aucune manipulation du DOM et aucun accès à Supabase.
 */

/**
 * Vérifie qu’une valeur est renseignée.
 *
 * Une valeur est considérée comme renseignée si elle n’est ni
 * `null`, ni `undefined`, ni une chaîne vide après suppression
 * des espaces.
 *
 * @param {string|number|null|undefined} valeur - Valeur à contrôler.
 * @returns {boolean} true si la valeur est renseignée.
 */
export function estRenseigne(valeur) {
  if (valeur === null || valeur === undefined) {
    return false;
  }

  if (typeof valeur === 'string') {
    return valeur.trim().length > 0;
  }

  return true;
}

/**
 * Vérifie qu’une valeur est un entier valide.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si la valeur est un entier.
 */
export function estEntierValide(valeur) {
  const nombre = Number(valeur);

  return Number.isFinite(nombre) && Number.isInteger(nombre);
}

/**
 * Vérifie qu’une valeur est un entier strictement positif.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si la valeur est un entier strictement positif.
 */
export function estEntierStrictementPositif(valeur) {
  const nombre = Number(valeur);

  return (
    Number.isFinite(nombre) &&
    Number.isInteger(nombre) &&
    nombre > 0
  );
}

/**
 * Vérifie qu’une valeur est un entier positif ou nul.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si la valeur est un entier positif ou nul.
 */
export function estEntierPositifOuNul(valeur) {
  const nombre = Number(valeur);

  return (
    Number.isFinite(nombre) &&
    Number.isInteger(nombre) &&
    nombre >= 0
  );
}

/**
 * Valide qu’un champ est renseigné.
 *
 * @param {string|number|null|undefined} valeur - Valeur à contrôler.
 * @param {string} nomChamp - Nom du champ pour le message d’erreur.
 * @returns {string|null} Message d’erreur ou null si la valeur est valide.
 */
export function validerChampRenseigne(valeur, nomChamp) {
  if (!estRenseigne(valeur)) {
    return `${nomChamp} doit être renseigné.`;
  }

  return null;
}

/**
 * Valide qu’un champ contient un entier positif ou nul.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @param {string} nomChamp - Nom du champ pour le message d’erreur.
 * @returns {string|null} Message d’erreur ou null si la valeur est valide.
 */
export function validerChampEntierPositifOuNul(valeur, nomChamp) {
  if (!estEntierPositifOuNul(valeur)) {
    return `${nomChamp} doit être un entier positif ou nul.`;
  }

  return null;
}

/**
 * Valide qu’un champ contient un entier strictement positif.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @param {string} nomChamp - Nom du champ pour le message d’erreur.
 * @returns {string|null} Message d’erreur ou null si la valeur est valide.
 */
export function validerChampEntierStrictementPositif(valeur, nomChamp) {
  if (!estEntierStrictementPositif(valeur)) {
    return `${nomChamp} doit être un entier strictement positif.`;
  }

  return null;
}