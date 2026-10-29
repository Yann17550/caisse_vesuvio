/**
 * Fichier : accueil/pageAccueil.js
 * Rôle : afficher et orchestrer la page d’accueil.
 *
 * La page d’accueil est le point d’entrée de l’écosystème.
 * Elle permet :
 * - d’afficher les applications disponibles ;
 * - de lancer une application ;
 * - de sélectionner l’établissement actif ;
 * - de naviguer vers la clôture correspondante.
 *
 * Ce module coordonne la sélection d’établissement
 * et la navigation vers les applications.
 *
 * Dépendances :
 * - accueil/selectionEtablissement.js
 * - accueil/navigationApplications.js
 */

import {
  obtenirEtablissements,
  selectionnerEtablissement,
  obtenirEtablissementActif,
  reinitialiserEtablissementActif,
} from './selectionEtablissement.js';

import {
  APPLICATIONS,
  determinerDestination,
} from './navigationApplications.js';

/**
 * Éléments DOM utilisés par la page d’accueil.
 *
 * @type {{
 *   section: HTMLElement|null,
 *   boutonClotures: HTMLButtonElement|null,
 *   choixEtablissement: HTMLElement|null,
 *   listeEtablissements: HTMLElement|null,
 *   message: HTMLElement|null,
 *   boutonRetourAccueil: HTMLButtonElement|null
 * }}
 */
const elements = {
  section: null,
  boutonClotures: null,
  choixEtablissement: null,
  listeEtablissements: null,
  message: null,
  boutonRetourAccueil: null,
};

/**
 * Application actuellement choisie sur la page d’accueil.
 *
 * @type {string|null}
 */
let applicationChoisie = null;

/**
 * Sélectionne les éléments DOM de la page d’accueil.
 *
 * @returns {void}
 */
function selectionnerElements() {
  elements.section = document.getElementById('accueil-section');
  elements.boutonClotures = document.getElementById('accueil-bouton-clotures');
  elements.choixEtablissement = document.getElementById(
    'accueil-choix-etablissement',
  );
  elements.listeEtablissements = document.getElementById(
    'accueil-liste-etablissements',
  );
  elements.message = document.getElementById('accueil-message');
  elements.boutonRetourAccueil = document.getElementById(
    'accueil-bouton-retour',
  );
}

/**
 * Affiche un message dans la page d’accueil.
 *
 * @param {string} message - Message à afficher.
 * @param {'info'|'erreur'} type - Type de message.
 * @returns {void}
 */
function afficherMessage(message, type = 'info') {
  if (!elements.message) {
    return;
  }

  elements.message.textContent = message;
  elements.message.classList.toggle(
    'accueil-message-erreur',
    type === 'erreur',
  );
  elements.message.classList.remove('is-hidden');
}

/**
 * Efface le message affiché dans la page d’accueil.
 *
 * @returns {void}
 */
function effacerMessage() {
  if (!elements.message) {
    return;
  }

  elements.message.textContent = '';
  elements.message.classList.add('is-hidden');
  elements.message.classList.remove('accueil-message-erreur');
}

/**
 * Affiche l’écran de choix de l’établissement.
 *
 * @returns {void}
 */
function afficherChoixEtablissement() {
  if (!elements.choixEtablissement || !elements.listeEtablissements) {
    return;
  }

  elements.listeEtablissements.innerHTML = '';

  obtenirEtablissements().forEach((etablissement) => {
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'accueil-bouton-etablissement';
    bouton.textContent = etablissement.nom;
    bouton.dataset.etablissementId = String(etablissement.id);

    bouton.addEventListener('click', () => {
      choisirEtablissement(etablissement.id);
    });

    elements.listeEtablissements.appendChild(bouton);
  });

  elements.choixEtablissement.classList.remove('is-hidden');
  elements.boutonClotures.classList.add('is-hidden');
}

/**
 * Masque l’écran de choix de l’établissement.
 *
 * @returns {void}
 */
function masquerChoixEtablissement() {
  if (!elements.choixEtablissement || !elements.boutonClotures) {
    return;
  }

  elements.choixEtablissement.classList.add('is-hidden');
  elements.boutonClotures.classList.remove('is-hidden');
}

/**
 * Sélectionne l’établissement puis tente d’ouvrir l’application choisie.
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
 * Ouvre la clôture Vesuvio.
 *
 * Cette fonction déclenche l’affichage de la section existante
 * et initialise les services Midi et Soir si nécessaire.
 *
 * @returns {void}
 */
function ouvrirCloturesVesuvio() {
  const accueilSection = elements.section;
  const cloturesSection = document.getElementById(
    'clotures-vesuvio-section',
  );

  if (!accueilSection || !cloturesSection) {
    afficherMessage('Section Clôtures Vesuvio introuvable.', 'erreur');
    return;
  }

  accueilSection.classList.add('is-hidden');
  cloturesSection.classList.remove('is-hidden');

  document.dispatchEvent(
    new CustomEvent('accueil:clotures-vesuvio-ouvertes'),
  );
}

/**
 * Revient à la page d’accueil.
 *
 * @returns {void}
 */
function revenirAccueil() {
  const accueilSection = elements.section;
  const cloturesSection = document.getElementById(
    'clotures-vesuvio-section',
  );

  reinitialiserEtablissementActif();
  applicationChoisie = null;
  effacerMessage();
  masquerChoixEtablissement();

  if (cloturesSection) {
    cloturesSection.classList.add('is-hidden');
  }

  if (accueilSection) {
    accueilSection.classList.remove('is-hidden');
  }
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

  afficherChoixEtablissement();
}

/**
 * Attache les événements de la page d’accueil.
 *
 * @returns {void}
 */
function attacherEvenements() {
  if (elements.boutonClotures) {
    elements.boutonClotures.addEventListener('click', () => {
      lancerApplication('clotures');
    });
  }

  if (elements.boutonRetourAccueil) {
    elements.boutonRetourAccueil.addEventListener('click', () => {
      revenirAccueil();
    });
  }
}

/**
 * Initialise la page d’accueil.
 *
 * @returns {void}
 */
export function initialiserPageAccueil() {
  selectionnerElements();

  if (!elements.section) {
    return;
  }

  attacherEvenements();
  effacerMessage();
}