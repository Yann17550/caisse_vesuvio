/**
 * Fichier : core/interface/champsMontants.js
 * Rôle : isoler la lecture des montants dans le DOM.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture
 * et aucun accès à Supabase.
 *
 * Dépendances :
 * - core/montants/conversionMontants.js
 */

import {
  convertirEnMontant,
} from '../montants/conversionMontants.js';

/**
 * Lit un montant depuis un texte.
 *
 * @param {string|null|undefined} texte - Texte à convertir.
 * @returns {number} Montant converti, ou 0 si le texte est vide.
 */
export function lireMontantDepuisTexte(texte) {
  if (texte === null || texte === undefined) {
    return 0;
  }

  return convertirEnMontant(texte);
}

/**
 * Lit un montant depuis un champ de formulaire.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|null} champ - Champ à lire.
 * @returns {number} Montant converti, ou 0 si le champ est absent ou vide.
 */
export function lireMontantDepuisChamp(champ) {
  if (!champ) {
    return 0;
  }

  return lireMontantDepuisTexte(champ.value);
}

/**
 * Lit une quantité depuis un champ de formulaire.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|null} champ - Champ à lire.
 * @returns {number} Quantité convertie, ou 0 si le champ est absent ou vide.
 */
export function lireQuantiteDepuisChamp(champ) {
  if (!champ) {
    return 0;
  }

  const valeur = Number(champ.value);

  return Number.isFinite(valeur) ? valeur : 0;
}

/**
 * Lit un montant depuis un élément DOM non saisissable,
 * par exemple un span ou un paragraphe.
 *
 * @param {HTMLElement|null} element - Élément à lire.
 * @returns {number} Montant converti, ou 0 si l’élément est absent.
 */
export function lireMontantDepuisElement(element) {
  if (!element) {
    return 0;
  }

  return lireMontantDepuisTexte(element.textContent);
}