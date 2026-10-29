/**
 * Fichier : accueil/pageAccueil.js
 * Rôle : orchestrer la page d’accueil.
 *
 * Ce module coordonne :
 * - la vue de la page d’accueil ;
 * - la sélection de l’établissement actif ;
 * - la navigation vers les applications.
 *
 * Il ne manipule pas directement le DOM.
 * Toute interaction avec l’interface est déléguée à vueAccueil.js.
 *
 * Dépendances :
 * - accueil/vueAccueil.js
 * - accueil/selectionEtablissement.js
 * - accueil/navigationApplications.js
 */

import {
  initialiserVueAccueil,
  estVueAccueilDisponible,
  afficherAccueil,
  masquerAccueil,
  afficherChoixEtablissement,
  masquerChoixEtablissement,
  afficherEtablissements,
  afficherMessage,
  effacerMessage,
  attacherEvenementBoutonClotures,
  attacherEvenementBoutonRetour,
  afficherCloturesVesuvio,
  masquerCloturesVesuvio,
} from './vueAccueil.js';

import {
  obtenirEtablissements,
  selectionnerEtablissement,
  obtenirEtablissementActif,
  reinitialiserEtablissementActif,
} from './selectionEtablissement.js';

import {
  determinerDestination,
} from './navigationApplications.js';

/**
 * Application actuellement choisie sur la page d’accueil.
 *
 * @type {string|null}
 */
let applicationChoisie = null;

/**
 * Sélectionne un établissement puis tente d’ouvrir l’application choisie.
 *
 * @param {number|string} etablissementId - Identifiant de l’établissement.
 * @returns {void}
 */
function choisirEtablissement(etablissementId) {
  effacerMessage();

  const selection = selectionnerEtablissement(etablissementId);

  if (!selection.succes) {
    afficherMessage(selection.messageErreur, 'erreur');
    return;
  }

  const navigation = determinerDestination(
    applicationChoisie,
    obtenirEtablissementActif(),
  );

  if (!navigation.succes) {
    afficherMessage(navigation.messageErreur, 'erreur');
    masquerChoixEtablissement();
    return;
  }

  masquerChoixEtablissement();

  if (navigation.destination === 'clotures-vesuvio') {
    ouvrirCloturesVesuvio();
    return;
  }

  afficherMessage(navigation.messageErreur, 'erreur');
}

/**
 * Ouvre les clôtures Vesuvio.
 *
 * La page d’accueil est masquée, la section des clôtures Vesuvio
 * est affichée, puis un événement est diffusé pour permettre
 * au point d’entrée d’initialiser les services concernés.
 *
 * @returns {void}
 */
function ouvrirCloturesVesuvio() {
  masquerAccueil();
  afficherCloturesVesuvio();

  document.dispatchEvent(
    new CustomEvent('accueil:clotures-vesuvio-ouvertes'),
  );
}

/**
 * Revient à la page d’accueil.
 *
 * La sélection d’établissement est annulée,
 * l’application choisie est réinitialisée
 * et les clôtures Vesuvio sont masquées.
 *
 * @returns {void}
 */
function revenirAccueil() {
  reinitialiserEtablissementActif();

  applicationChoisie = null;

  effacerMessage();
  masquerChoixEtablissement();
  masquerCloturesVesuvio();
  afficherAccueil();
}

/**
 * Lance une application depuis la page d’accueil.
 *
 * @param {string} applicationId - Identifiant de l’application.
 * @returns {void}
 */
function lancerApplication(applicationId) {
  effacerMessage();

  applicationChoisie = applicationId;

  afficherEtablissements(
    obtenirEtablissements(),
    choisirEtablissement,
  );

  afficherChoixEtablissement();
}

/**
 * Initialise la page d’accueil.
 *
 * @returns {boolean} True si l’initialisation a réussi, false sinon.
 */
export function initialiserPageAccueil() {
  const estDisponible = initialiserVueAccueil();

  if (!estDisponible || !estVueAccueilDisponible()) {
    return false;
  }

  attacherEvenementBoutonClotures(() => {
    lancerApplication('clotures');
  });

  attacherEvenementBoutonRetour(() => {
    revenirAccueil();
  });

  effacerMessage();
  afficherAccueil();

  return true;
}