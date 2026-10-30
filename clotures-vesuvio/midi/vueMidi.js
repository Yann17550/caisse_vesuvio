/**
 * Fichier : clotures-vesuvio/midi/vueMidi.js
 * Rôle : manipuler le DOM du formulaire Midi.
 *
 * Ce module ne contient aucune règle métier.
 */

import { genererFormulaireMidi } from './modeleVueMidi.js';

const elements = {};

/**
 * Initialise la vue Midi dans un conteneur.
 *
 * @param {HTMLElement} conteneur - Conteneur du Midi.
 */
export function initialiserVueMidi(conteneur) {
  conteneur.innerHTML = genererFormulaireMidi();

  elements.formulaire = conteneur.querySelector('#formulaire-midi');
  elements.message = conteneur.querySelector('#midi-message');
  elements.boutonValider = conteneur.querySelector('#midi-valider');

  elements.myPosSaisie = conteneur.querySelector('#midi-myPosSaisie');
  elements.myPosAjouter = conteneur.querySelector('#midi-myPosAjouter');
  elements.myPosListe = conteneur.querySelector('#midi-myPosListe');
  elements.myPosTotal = conteneur.querySelector('#midi-myPosTotal');

  elements.champs = {
    cbClassique: conteneur.querySelector('#midi-cbClassique'),
    cbTicketRestaurant: conteneur.querySelector('#midi-cbTicketRestaurant'),
    cashAdipos: conteneur.querySelector('#midi-cashAdipos'),
    ancvPapier: conteneur.querySelector('#midi-ancvPapier'),
    ancvDematerialise: conteneur.querySelector('#midi-ancvDematerialise'),
    cheques: conteneur.querySelector('#midi-cheques'),
    tva55: conteneur.querySelector('#midi-tva55'),
    tva10: conteneur.querySelector('#midi-tva10'),
    tva20: conteneur.querySelector('#midi-tva20'),
    pizzasSurPlace: conteneur.querySelector('#midi-pizzasSurPlace'),
    pizzasEmporter: conteneur.querySelector('#midi-pizzasEmporter'),
  };
}

/**
 * Retourne les éléments de la vue.
 *
 * @returns {Object} Éléments DOM du Midi.
 */
export function obtenirElements() {
  return elements;
}

/**
 * Affiche un message.
 *
 * @param {string} texte - Message à afficher.
 * @param {'info'|'succes'|'erreur'} type - Type de message.
 */
export function afficherMessage(texte, type = 'info') {
  if (!elements.message) {
    return;
  }

  elements.message.textContent = texte;
  elements.message.className = `message message-${type}`;
}

/**
 * Efface le message affiché.
 */
export function effacerMessage() {
  if (!elements.message) {
    return;
  }

  elements.message.textContent = '';
  elements.message.className = 'message';
}

/**
 * Lit la valeur brute d’un champ.
 *
 * @param {HTMLInputElement|null} champ - Champ à lire.
 * @returns {string} Valeur saisie.
 */
export function lireValeur(champ) {
  return champ ? champ.value : '';
}

/**
 * Verrouille ou déverrouille le formulaire.
 *
 * @param {boolean} verrouille - true pour verrouiller.
 */
export function definirVerrouillage(verrouille) {
  if (!elements.formulaire) {
    return;
  }

  elements.formulaire
    .querySelectorAll('input, button')
    .forEach((element) => {
      if (element.id !== 'midi-myPosSaisie') {
        element.disabled = verrouille;
      }
    });
}

/**
 * Remet à zéro le formulaire.
 */
export function reinitialiserVue() {
  if (!elements.formulaire) {
    return;
  }

  elements.formulaire.reset();
  elements.myPosListe.innerHTML = '';
  elements.myPosTotal.textContent = '';
  effacerMessage();
}