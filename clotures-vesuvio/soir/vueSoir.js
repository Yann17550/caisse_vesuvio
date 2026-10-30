/**
 * Fichier : clotures-vesuvio/soir/vueSoir.js
 * Rôle : manipuler le DOM du service Soir.
 *
 * Ce module ne contient aucune règle métier.
 */

import { genererStructureSoir, obtenirPagesSoir } from './modeleVueSoir.js';

const elements = {};
let pageActive = 'cartes';

/**
 * Initialise la vue du Soir dans un conteneur.
 *
 * @param {HTMLElement} conteneur - Conteneur du Soir.
 */
export function initialiserVueSoir(conteneur) {
  conteneur.innerHTML = genererStructureSoir();

  elements.conteneur = conteneur;
  elements.titre = conteneur.querySelector('#soir-titre-page');
  elements.boutonsNavigation = Array.from(
    conteneur.querySelectorAll('.soir-nav-button'),
  );
  elements.pages = Array.from(
    conteneur.querySelectorAll('.soir-page'),
  );
}

/**
 * Retourne les éléments de la vue.
 *
 * @returns {Object} Éléments DOM du Soir.
 */
export function obtenirElementsSoir() {
  return elements;
}

/**
 * Retourne la page actuellement affichée.
 *
 * @returns {string} Identifiant de la page active.
 */
export function obtenirPageActive() {
  return pageActive;
}

/**
 * Affiche une page du Soir.
 *
 * @param {string} page - Identifiant de la page.
 */
export function afficherPageSoir(page) {
  pageActive = page;

  elements.pages.forEach((section) => {
    section.classList.toggle(
      'is-hidden',
      section.dataset.soirPage !== page,
    );
  });

  elements.boutonsNavigation.forEach((bouton) => {
    bouton.classList.toggle(
      'is-active',
      bouton.dataset.soirPage === page,
    );
  });

  const pageTrouvee = obtenirPagesSoir().find(
    (pageDefinition) => pageDefinition.id === page,
  );

  if (elements.titre && pageTrouvee) {
    elements.titre.textContent = pageTrouvee.libelle;
  }
}

/**
 * Met à jour le titre avec un contenu personnalisé.
 *
 * @param {string} html - Contenu HTML du titre.
 */
export function definirTitreSoir(html) {
  if (elements.titre) {
    elements.titre.innerHTML = html;
  }
}

/**
 * Retourne le conteneur d’une page.
 *
 * @param {string} page - Identifiant de la page.
 * @returns {HTMLElement|null} Conteneur de la page.
 */
export function obtenirConteneurPage(page) {
  return elements.conteneur
    ? elements.conteneur.querySelector(`#soir-page-${page}`)
    : null;
}