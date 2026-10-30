/**
 * Fichier : clotures-vesuvio/demarrageCloturesVesuvio.js
 * Rôle : point d’entrée de la nouvelle application Clôtures Vesuvio.
 *
 * Ce module réutilise la page d’accueil existante,
 * récupère l’établissement actif puis initialise
 * les nouveaux modules Midi et Soir.
 *
 * Il ne contient ni calcul métier ni accès direct à Supabase.
 */

import { initialiserPageAccueil } from '../accueil/pageAccueil.js';
import { obtenirEtablissementActif } from '../accueil/selectionEtablissement.js';

import { initialiserPageMidi } from './midi/pageMidi.js';
import { initialiserPageSoir } from './soir/pageSoir.js';

/**
 * Indique si les clôtures Vesuvio ont déjà été initialisées.
 *
 * @type {boolean}
 */
let cloturesVesuvioInitialisees = false;

/**
 * Affiche le service sélectionné et masque les autres.
 *
 * @param {'midi'|'soir'} service - Service à afficher.
 */
function afficherService(service) {
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
}

/**
 * Initialise les clôtures Vesuvio.
 *
 * Cette fonction est appelée lorsque l’utilisateur
 * a sélectionné l’établissement Le Vesuvio.
 */
function initialiserCloturesVesuvio() {
  if (cloturesVesuvioInitialisees) {
    afficherService('midi');
    return;
  }

  const etablissement = obtenirEtablissementActif();

  if (!etablissement || !etablissement.id) {
    return;
  }

  const sectionMidi = document.getElementById('midi-section');
  const sectionSoir = document.getElementById('soir-section');

  if (sectionMidi) {
    initialiserPageMidi({
      conteneur: sectionMidi,
      etablissementId: etablissement.id,
    });
  }

  if (sectionSoir) {
    initialiserSoir({
      conteneur: sectionSoir,
      etablissementId: etablissement.id,
    });
  }

  const navigationService = document.getElementById('service-switch');

  if (navigationService) {
    navigationService.classList.remove('is-hidden');
  }

  afficherService('midi');

  cloturesVesuvioInitialisees = true;
}

/**
 * Attache la navigation entre Midi et Soir.
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
 */
function initialiserApplication() {
  attacherNavigationServices();

  initialiserPageAccueil();

  document.addEventListener(
    'accueil:clotures-vesuvio-ouvertes',
    initialiserCloturesVesuvio,
  );
}

document.addEventListener(
  'DOMContentLoaded',
  initialiserApplication,
);