/**
 * Fichier : accueil/navigationApplications.js
 * Rôle : définir les applications accessibles depuis la page d’accueil
 * et déterminer la destination selon l’établissement actif.
 *
 * Ce module ne manipule pas le DOM.
 * Il ne sélectionne pas non plus l’établissement.
 *
 * La page d’accueil utilise ce module pour :
 * - afficher les applications disponibles ;
 * - vérifier qu’une application est connue ;
 * - déterminer la clôture à ouvrir selon l’établissement actif.
 *
 * Dépendances :
 * - Aucune.
 */

/**
 * Applications disponibles depuis la page d’accueil.
 *
 * Chaque application possède :
 * - un identifiant technique stable ;
 * - un nom affiché dans l’interface ;
 * - une description courte.
 *
 * @type {ReadonlyArray<{
 *   id: string,
 *   nom: string,
 *   description: string
 * }>}
 */
export const APPLICATIONS = Object.freeze([
  Object.freeze({
    id: 'clotures',
    nom: 'Clôtures',
    description: 'Clôtures de service par établissement.',
  }),
]);

/**
 * Vérifie qu’une application est connue.
 *
 * @param {string} applicationId - Identifiant de l’application.
 * @returns {boolean} True si l’application existe, false sinon.
 */
export function estApplicationConnue(applicationId) {
  if (typeof applicationId !== 'string') {
    return false;
  }

  return APPLICATIONS.some(
    (application) => application.id === applicationId,
  );
}

/**
 * Recherche une application à partir de son identifiant.
 *
 * @param {string} applicationId - Identifiant de l’application.
 * @returns {object|null} Application trouvée, ou null si inconnue.
 */
export function trouverApplicationParId(applicationId) {
  if (typeof applicationId !== 'string') {
    return null;
  }

  return APPLICATIONS.find(
    (application) => application.id === applicationId,
  ) ?? null;
}

/**
 * Détermine la destination d’une application
 * en fonction de l’établissement actif.
 *
 * Règle métier :
 * - Le Vesuvio ouvre la clôture Vesuvio.
 * - Pizza d’Oléron ouvrira la clôture Pizza d’Oléron,
 *   lorsque cette application sera disponible.
 *
 * @param {string} applicationId - Identifiant de l’application.
 * @param {object|null} etablissementActif - Établissement sélectionné.
 * @returns {{
 *   succes: boolean,
 *   destination: string|null,
 *   messageErreur: string|null
 * }} Résultat de la navigation.
 */
export function determinerDestination(
  applicationId,
  etablissementActif,
) {
  if (!estApplicationConnue(applicationId)) {
    return {
      succes: false,
      destination: null,
      messageErreur: 'Application inconnue.',
    };
  }

  if (!etablissementActif) {
    return {
      succes: false,
      destination: null,
      messageErreur: 'Aucun établissement sélectionné.',
    };
  }

  if (applicationId === 'clotures') {
    if (etablissementActif.id === 2) {
      return {
        succes: true,
        destination: 'clotures-vesuvio',
        messageErreur: null,
      };
    }

    if (etablissementActif.id === 1) {
      return {
        succes: false,
        destination: null,
        messageErreur: 'Application non disponible.',
      };
    }
  }

  return {
    succes: false,
    destination: null,
    messageErreur: 'Aucune application disponible pour cet établissement.',
  };
}