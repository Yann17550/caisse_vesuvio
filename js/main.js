/**
 * Fichier : js/main.js
 * Rôle : point d’entrée de Caisse Vesuvio.
 *
 * Ce fichier coordonne uniquement les modules.
 * Il ne contient ni calcul métier, ni accès direct à Supabase.
 */


import midiController from './features/midi/midiController.js';
import soirController from './features/soir/soirController.js';


const serviceButtons = document.querySelectorAll('.service-button');
const serviceSections = document.querySelectorAll('.service-section');
const body = document.body;


/**
 * Affiche le service sélectionné et masque les autres.
 *
 * Déplace également la navigation du Soir :
 * - dans le header lorsque le service Soir est actif ;
 * - dans la section Soir (position d’origine) sinon.
 *
 * @param {'midi'|'soir'} service - Service à afficher.
 * @returns {void}
 */
function showService(service) {
  const appHeader = document.querySelector('.app-header');
  const soirNavigation = document.querySelector('.soir-navigation');
  const soirSection = document.getElementById('soir-section');
  const soirPages = document.getElementById('soir-pages');

  body.classList.remove('service-midi', 'service-soir');
  body.classList.add(`service-${service}`);


  serviceButtons.forEach((button) => {
    const isActive = button.dataset.service === service;
    button.classList.toggle('is-active', isActive);
  });


  serviceSections.forEach((section) => {
    const isActive = section.dataset.service === service;
    section.classList.toggle('is-hidden', !isActive);
  });


  if (service === 'soir') {
    appHeader.appendChild(soirNavigation);
  } else {
    soirSection.insertBefore(soirNavigation, soirPages);
  }
}


/**
 * Initialise l’application.
 *
 * @returns {void}
 */
function initApp() {
  serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showService(button.dataset.service);
    });
  });


  midiController.init();
  soirController.init();


  showService('midi');
}


document.addEventListener('DOMContentLoaded', initApp);