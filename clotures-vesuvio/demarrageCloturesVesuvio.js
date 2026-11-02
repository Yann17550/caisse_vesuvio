/**
 * Fichier : clotures-vesuvio/demarrageCloturesVesuvio.js
 * Rôle : point d’entrée de l’application Clôtures Vesuvio.
 *
 * Après sélection de l’établissement :
 * - titre et Retour accueil sur une ligne permanente ;
 * - choix Midi / Soir sur la ligne suivante ;
 * - aucun service ouvert automatiquement.
 *
 * Après sélection du service :
 * - le choix Midi / Soir est masqué ;
 * - le sous-titre du service est affiché et centré.
 *
 * Ce module ne contient ni calcul métier ni accès direct à Supabase.
 */

import { initialiserPageAccueil } from '../accueil/pageAccueil.js';
import { obtenirEtablissementActif } from '../accueil/selectionEtablissement.js';
import { initialiserPageMidi } from './midi/pageMidi.js';
import { initialiserPageSoir } from './soir/pageSoir.js';

let cloturesVesuvioInitialisees = false;

/**
 * Retourne la navigation des pages du Soir.
 *
 * @returns {HTMLElement|null} Navigation du Soir.
 */
function obtenirNavigationSoir() {
  return document.querySelector('.soir-navigation');
}

/**
 * Replace la navigation du Soir dans sa section.
 */
function rangerNavigationSoir() {
  const navigationSoir = obtenirNavigationSoir();
  const sectionSoir = document.getElementById('soir-section');
  const conteneurPages = sectionSoir?.querySelector('#soir-pages');

  if (
    navigationSoir &&
    sectionSoir &&
    conteneurPages &&
    navigationSoir.parentElement !== sectionSoir
  ) {
    sectionSoir.insertBefore(navigationSoir, conteneurPages);
  }
}

/**
 * Affiche l’accueil, le choix du service ou le service sélectionné.
 *
 * @param {'accueil'|'choix'|'midi'|'soir'} service - Écran à afficher.
 */
function afficherService(service) {
  const estAccueil = service === 'accueil';
  const estChoix = service === 'choix';
  const estMidi = service === 'midi';
  const estSoir = service === 'soir';

  const sectionAccueil = document.getElementById('accueil-section');
  const sectionClotures = document.getElementById(
    'clotures-vesuvio-section',
  );
  const navigationService = document.getElementById('service-switch');
  const boutonAccueil = document.getElementById('service-accueil-button');
  const sousTitre = document.getElementById('clotures-sous-titre');

  document.body.classList.toggle('accueil-actif', estAccueil);
  document.body.classList.toggle('service-midi', estMidi);
  document.body.classList.toggle('service-soir', estSoir);

  if (sectionAccueil) {
    sectionAccueil.classList.toggle('is-hidden', !estAccueil);
  }

  if (sectionClotures) {
    sectionClotures.classList.toggle('is-hidden', estAccueil);
  }

  document.querySelectorAll('.service-section').forEach((section) => {
    section.classList.toggle(
      'is-hidden',
      section.dataset.service !== service,
    );
  });

  document.querySelectorAll('.service-button').forEach((bouton) => {
    bouton.classList.toggle(
      'is-active',
      bouton.dataset.service === service,
    );
  });

  if (boutonAccueil) {
    boutonAccueil.classList.toggle('is-hidden', estAccueil);
  }

  if (navigationService) {
    navigationService.classList.toggle('is-hidden', !estChoix);
  }

  if (sousTitre) {
    sousTitre.textContent = estMidi
      ? 'Clôture midi'
      : estSoir
        ? 'Clôture soir'
        : '';

    sousTitre.classList.toggle('is-hidden', !estMidi && !estSoir);
  }

  if (estSoir) {
    const appHeader = document.querySelector('.app-header');
    const navigationSoir = obtenirNavigationSoir();

    if (appHeader && navigationSoir) {
      appHeader.appendChild(navigationSoir);
    }
  } else {
    rangerNavigationSoir();
  }
}

/**
 * Initialise les services après sélection de l’établissement,
 * puis affiche uniquement le choix Midi / Soir.
 */
function initialiserCloturesVesuvio() {
  const etablissement = obtenirEtablissementActif();

  if (!etablissement || !etablissement.id) {
    return;
  }

  if (!cloturesVesuvioInitialisees) {
    const sectionMidi = document.getElementById('midi-section');
    const sectionSoir = document.getElementById('soir-section');

    if (sectionMidi) {
      initialiserPageMidi({
        conteneur: sectionMidi,
        etablissementId: etablissement.id,
      });
    }

    if (sectionSoir) {
      initialiserPageSoir({
        conteneur: sectionSoir,
        etablissementId: etablissement.id,
      });
    }

    cloturesVesuvioInitialisees = true;
  }

  afficherService('choix');
}

/**
 * Attache les boutons Midi, Soir et Retour accueil.
 */
function attacherNavigationServices() {
  document.querySelectorAll('.service-button').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const service = bouton.dataset.service;

      if (service === 'accueil') {
        afficherService('accueil');
        return;
      }

      if (
        cloturesVesuvioInitialisees &&
        (service === 'midi' || service === 'soir')
      ) {
        afficherService(service);
      }
    });
  });
}

/**
 * Initialise l’application.
 */
function initialiserApplication() {
  attacherNavigationServices();

  document.addEventListener(
    'accueil:clotures-vesuvio-ouvertes',
    initialiserCloturesVesuvio,
  );

  initialiserPageAccueil();
}

document.addEventListener(
  'DOMContentLoaded',
  initialiserApplication,
);