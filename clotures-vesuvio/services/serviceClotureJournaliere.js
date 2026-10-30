/**
 * Fichier : clotures-vesuvio/services/serviceClotureJournaliere.js
 * Rôle : orchestrer la clôture journalière du Vesuvio.
 *
 * Ce service utilise les accès génériques de core/base-de-donnees/.
 * L’identifiant d’établissement est obligatoire et provient
 * de la sélection effectuée sur la page d’accueil.
 *
 * Dépendances :
 * - core/base-de-donnees/accesCloturesJournalieres.js
 */

import {
  lireClotureJournaliere,
  enregistrerClotureJournaliere,
  validerClotureJournaliere,
  rouvrirClotureJournaliere,
} from '../../core/base-de-donnees/accesCloturesJournalieres.js';

/**
 * Récupère la clôture Vesuvio d’un service pour une date donnée.
 *
 * @param {Object} parametres - Paramètres de recherche.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service recherché.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 * @returns {Promise<Object|null>} Clôture trouvée ou null.
 */
export async function obtenirClotureVesuvio({
  dateActivite,
  service,
  etablissementId,
}) {
  return lireClotureJournaliere({
    dateActivite,
    service,
    etablissementId,
  });
}

/**
 * Enregistre la clôture Vesuvio d’un service.
 *
 * @param {Object} parametres - Paramètres d’enregistrement.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service concerné.
 * @param {Object} parametres.donnees - Données validées à enregistrer.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 * @returns {Promise<Object>} Clôture enregistrée.
 */
export async function enregistrerClotureVesuvio({
  dateActivite,
  service,
  donnees,
  etablissementId,
}) {
  return enregistrerClotureJournaliere({
    dateActivite,
    service,
    donnees,
    etablissementId,
  });
}

/**
 * Valide définitivement la clôture Vesuvio d’un service.
 *
 * @param {Object} parametres - Paramètres de validation.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service concerné.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 * @returns {Promise<Object>} Clôture validée.
 */
export async function validerClotureVesuvio({
  dateActivite,
  service,
  etablissementId,
}) {
  return validerClotureJournaliere({
    dateActivite,
    service,
    etablissementId,
  });
}

/**
 * Rouvre la clôture Vesuvio d’un service.
 *
 * @param {Object} parametres - Paramètres de réouverture.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service concerné.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 * @returns {Promise<Object>} Clôture rouverte.
 */
export async function rouvrirClotureVesuvio({
  dateActivite,
  service,
  etablissementId,
}) {
  return rouvrirClotureJournaliere({
    dateActivite,
    service,
    etablissementId,
  });
}