/**
 * Fichier : accueil/selectionEtablissement.js
 * Rôle : sélectionner, valider et mémoriser l’établissement actif.
 *
 * Ce module ne manipule pas le DOM.
 * Il ne décide pas non plus quelle application ouvrir.
 *
 * La page d’accueil utilise ce module pour :
 * - obtenir la liste des établissements disponibles ;
 * - sélectionner un établissement ;
 * - mémoriser l’établissement actif pendant la session ;
 * - récupérer l’établissement actif avant d’ouvrir une application.
 *
 * Dépendances :
 * - core/configuration/configurationEtablissements.js
 */

import {
  ETABLISSEMENTS,
  estEtablissementConnu,
  trouverEtablissementParId,
} from '../core/configuration/configurationEtablissements.js';

/**
 * Établissement actuellement sélectionné.
 *
 * Cette valeur n’est pas persistée : elle reste active
 * uniquement pendant la session en cours.
 *
 * @type {object|null}
 */
let etablissementActif = null;

/**
 * Retourne la liste des établissements disponibles.
 *
 * @returns {ReadonlyArray<object>} Liste figée des établissements.
 */
export function obtenirEtablissements() {
  return ETABLISSEMENTS;
}

/**
 * Retourne l’établissement actuellement sélectionné.
 *
 * @returns {object|null} Établissement actif, ou null si aucun choix.
 */
export function obtenirEtablissementActif() {
  return etablissementActif;
}

/**
 * Retourne l’identifiant de l’établissement actif.
 *
 * @returns {number|null} Identifiant technique, ou null si aucun choix.
 */
export function obtenirIdentifiantEtablissementActif() {
  return etablissementActif ? etablissementActif.id : null;
}

/**
 * Vérifie qu’un établissement est actuellement sélectionné.
 *
 * @returns {boolean} True si un établissement est actif, false sinon.
 */
export function estEtablissementActifDefini() {
  return etablissementActif !== null;
}

/**
 * Sélectionne un établissement à partir de son identifiant.
 *
 * @param {number|string} etablissementId - Identifiant de l’établissement.
 * @returns {{succes: boolean, etablissement: object|null, messageErreur: string|null}}
 * Résultat de la sélection.
 */
export function selectionnerEtablissement(etablissementId) {
  if (!estEtablissementConnu(etablissementId)) {
    return {
      succes: false,
      etablissement: null,
      messageErreur: 'Établissement inconnu.',
    };
  }

  const etablissement = trouverEtablissementParId(etablissementId);

  if (!etablissement) {
    return {
      succes: false,
      etablissement: null,
      messageErreur: 'Impossible de trouver l’établissement demandé.',
    };
  }

  etablissementActif = etablissement;

  return {
    succes: true,
    etablissement,
    messageErreur: null,
  };
}

/**
 * Annule la sélection de l’établissement actif.
 *
 * @returns {void}
 */
export function reinitialiserEtablissementActif() {
  etablissementActif = null;
}