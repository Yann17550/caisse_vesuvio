/**
 * Fichier : accueil/demarrageApplication.js
 * Rôle : point d’entrée unique de l’application.
 *
 * Ce fichier démarre la page d’accueil.
 * Les clôtures Vesuvio ne sont initialisées que lorsque
 * l’utilisateur a sélectionné l’établissement « Le Vesuvio ».
 *
 * Pendant la phase d’accueil, le dossier `js/` correspond
 * à l’ancien code fonctionnel et ne doit pas être modifié.
 * Les contrôleurs existants sont donc importés depuis `js/`.
 *
 * Ce fichier ne contient ni calcul métier,
 * ni accès direct à Supabase.
 *
 * Dépendances :
 * - accueil/pageAccueil.js
 * - js/features/midi/midiController.js
 * - js/features/soir/soirController.js
 */

import { initialiserPageAccueil } from './pageAccueil.js';
import midiController from '../js/features/midi/midiController.js';
import soirController from '../js/features/soir/soirController.js';

/**
 * Indique si les clôtures Vesuvio ont déjà été initialisées.
 *
 * @type {boolean}
 */
let cloturesVesuvioInitialisees = false;

/**
 * Affiche le service sélectionné et masque les autres.
 *
 * Déplace également la navigation du Soir :
 * - dans l’en-tête lorsque le service Soir est actif ;
 * - dans la section Soir sinon.
 *
 * @param {'midi'|'soir'} service - Service à afficher.
 * @returns {void}
 */
function afficherService(service) {
  const enTeteApplication = document.querySelector('.app-header');
  const navigationSoir = document.querySelector('.soir-navigation');
  const sectionSoir = document.getElementById('soir-section');
  const pagesSoir = document.getElementById('soir-pages');
  const boutonsService = document.querySelectorAll('.service-button');
  const sectionsService = document.querySelectorAll('.service-section');
  const body = document.body;

  body.classList.remove('service-midi', 'service-soir');
  body.classList.add(`service-${service}`);

  boutonsService.forEach((bouton) => {
    const estActif = bouton.dataset.service === service;
    bouton.classList.toggle('is-active', estActif);
  });

  sectionsService.forEach((section) => {
    const estActif = section.dataset.service === service;
    section.classList.toggle('is-hidden', !estActif);
  });

  if (service === 'soir') {
    enTeteApplication.appendChild(navigationSoir);
  } else {
    sectionSoir.insertBefore(navigationSoir, pagesSoir);
  }
}

/**
 * Initialise les clôtures Vesuvio.
 *
 * Cette fonction est appelée une seule fois,
 * lorsque l’utilisateur accède aux clôtures Vesuvio.
 *
 * @returns {void}
 */
function initialiserCloturesVesuvio() {
  if (cloturesVesuvioInitialisees) {
    return;
  }

  midiController.init();
  soirController.init();

  const navigationService = document.getElementById('service-switch');

  if (navigationService) {
    navigationService.classList.remove('is-hidden');
  }

  afficherService('midi');

  cloturesVesuvioInitialisees = true;
}

/**
 * Attache la navigation entre Midi et Soir.
 *
 * @returns {void}
 */
function attacherNavigationServices() {
  const boutonsService = document.querySelectorAll('.service-button');

  boutonsService.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      afficherService(bouton.dataset.service);
    });
  });
}

/**
 * Initialise l’application.
 *
 * @returns {void}
 */
function initialiserApplication() {
  attacherNavigationServices();

  initialiserPageAccueil();

  document.addEventListener(
    'accueil:clotures-vesuvio-ouvertes',
    initialiserCloturesVesuvio,
  );
}

document.addEventListener('DOMContentLoaded', initialiserApplication);