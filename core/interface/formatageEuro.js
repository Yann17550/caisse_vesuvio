/**
 * Fichier : core/interface/formatageEuro.js
 * Rôle : formater les montants en euros.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture.
 */

import {
  arrondirADeuxDecimales,
} from '../montants/conversionMontants.js';

/**
 * Formate un montant en euros avec deux décimales.
 *
 * @param {number|string} valeur - Montant à formater.
 * @returns {string} Montant formaté, par exemple « 12,50 € ».
 */
export function formaterEuro(valeur) {
  const montant = arrondirADeuxDecimales(valeur);

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(montant);
}

/**
 * Formate un montant en euros sans symbole monétaire.
 *
 * @param {number|string} valeur - Montant à formater.
 * @returns {string} Montant formaté, par exemple « 12,50 ».
 */
export function formaterMontantSansSymbole(valeur) {
  const montant = arrondirADeuxDecimales(valeur);

  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(montant);
}