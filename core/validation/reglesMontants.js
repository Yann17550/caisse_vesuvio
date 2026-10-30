/**
 * Fichier : core/validation/reglesMontants.js
 * Rôle : fournir les règles de validation génériques des montants.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture,
 * aucune manipulation du DOM et aucun accès à Supabase.
 *
 * Dépendances :
 * - core/montants/conversionMontants.js
 */

import {
  convertirEnMontant,
} from '../montants/conversionMontants.js';

/**
 * Vérifie qu’une valeur est un montant valide.
 *
 * Une valeur est considérée comme valide si elle peut être
 * convertie en nombre fini.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si le montant est valide.
 */
export function estMontantValide(valeur) {
  const montant = convertirEnMontant(valeur);

  return Number.isFinite(montant);
}

/**
 * Vérifie qu’une valeur est strictement positive.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si le montant est strictement positif.
 */
export function estMontantStrictementPositif(valeur) {
  const montant = convertirEnMontant(valeur);

  return Number.isFinite(montant) && montant > 0;
}

/**
 * Vérifie qu’une valeur est positive ou nulle.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si le montant est positif ou nul.
 */
export function estMontantPositifOuNul(valeur) {
  const montant = convertirEnMontant(valeur);

  return Number.isFinite(montant) && montant >= 0;
}

/**
 * Vérifie qu’une valeur est un entier positif ou nul.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @returns {boolean} true si la valeur est un entier positif ou nul.
 */
export function estEntierPositifOuNul(valeur) {
  const montant = convertirEnMontant(valeur);

  return (
    Number.isFinite(montant) &&
    Number.isInteger(montant) &&
    montant >= 0
  );
}

/**
 * Valide un montant strictement positif.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @param {string} nomChamp - Nom du champ pour le message d’erreur.
 * @returns {string|null} Message d’erreur ou null si la valeur est valide.
 */
export function validerMontantStrictementPositif(valeur, nomChamp) {
  if (!estMontantStrictementPositif(valeur)) {
    return `${nomChamp} doit être un montant strictement positif.`;
  }

  return null;
}

/**
 * Valide un montant positif ou nul.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @param {string} nomChamp - Nom du champ pour le message d’erreur.
 * @returns {string|null} Message d’erreur ou null si la valeur est valide.
 */
export function validerMontantPositifOuNul(valeur, nomChamp) {
  if (!estMontantPositifOuNul(valeur)) {
    return `${nomChamp} doit être un montant positif ou nul.`;
  }

  return null;
}

/**
 * Valide un entier positif ou nul.
 *
 * @param {number|string} valeur - Valeur à contrôler.
 * @param {string} nomChamp - Nom du champ pour le message d’erreur.
 * @returns {string|null} Message d’erreur ou null si la valeur est valide.
 */
export function validerEntierPositifOuNul(valeur, nomChamp) {
  if (!estEntierPositifOuNul(valeur)) {
    return `${nomChamp} doit être un entier positif ou nul.`;
  }

  return null;
}