/**
 * Fichier : clotures-vesuvio/demarrageCloturesVesuvio.js
 * Rôle : point d’entrée de la nouvelle application Clôtures Vesuvio.
 *
 * Gère la navigation Midi / Soir / Accueil.
 * Lorsque le Soir est actif, sa navigation de pages est déplacée
 * dans le header. Pendant la navigation entre les pages du Soir,
 * les boutons Midi / Soir / Accueil sont occultés.
 *
 * Ce module ne contient ni calcul métier ni accès direct à Supabase.
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
 * Retourne la navigation du Soir, ou null si absente.
 *
 * @returns {HTMLElement|null} Navigation du Soir.
 */
function obtenirNavigationSoir() {
  return document.querySelector('.soir-navigation');
}


/**
 * Replace la navigation du Soir dans sa section d’origine.
 *
 * @returns {void}
 */
function rangerNavigationSoir() {
  const navigationSoir = obtenirNavigationSoir();
  const sectionSoir = document.getElementById('soir-section');
  const conteneurPages = document.getElementById('soir-pages');


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
 * Affiche le service sélectionné et masque les autres.
 *
 * @param {'midi'|'soir'|'accueil'} service - Service à afficher.
 */
function afficherService(service) {
  const boutonsService = document.querySelectorAll('.service-button');
  const sectionsService = document.querySelectorAll('.service-section');
  const sectionAccueil = document.getElementById('accueil-section');
  const navigationService = document.getElementById('service-switch');
  const body = document.body;


  body.classList.remove('service-midi', 'service-soir');


  if (service === 'midi') {
    body.classList.add('service-midi');
  }


  if (service === 'soir') {
    body.classList.add('service-soir');
  }


  boutonsService.forEach((bouton) => {
    const estActif = bouton.dataset.service === service;


    bouton.classList.toggle('is-active', estActif);
  });


  sectionsService.forEach((section) => {
    const estActif = section.dataset.service === service;


    section.classList.toggle('is-hidden', !estActif);
  });


  if (sectionAccueil) {
    sectionAccueil.classList.toggle(
      'is-hidden',
      service !== 'accueil',
    );
  }


  if (navigationService) {
    navigationService.classList.toggle(
      'is-hidden',
      service === 'accueil',
    );
  }


  if (service === 'soir') {
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
    initialiserPageSoir({
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
 * Attache la navigation entre Accueil, Midi et Soir.
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
 * Occulte les boutons Midi / Soir / Accueil pendant la navigation
 * entre les pages du Soir.
 *
 * Règle : cliquer sur une page du Soir masque les boutons de service.
 * Cliquer à nouveau sur la page déjà active les fait réapparaître.
 */
function attacherOccultationServicesSoir() {
  document.addEventListener('click', (evenement) => {
    const boutonPage = evenement.target.closest('.soir-nav-button');


    if (!boutonPage) {
      return;
    }


    const navigationService =
      document.getElementById('service-switch');


    if (!navigationService) {
      return;
    }


    if (boutonPage.classList.contains('is-active')) {
      navigationService.classList.toggle('is-hidden');
    } else {
      navigationService.classList.add('is-hidden');
    }
  });
}


/**
 * Initialise l’application.
 */
function initialiserApplication() {
  attacherNavigationServices();
  attacherOccultationServicesSoir();


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