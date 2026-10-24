/**
 * Fichier : js/features/soir/soirView.js
 * Rôle : afficher le service Soir et gérer la navigation entre ses pages.
 *
 * La structure HTML vient de soirTemplate.js.
 * Ce fichier ne contient ni calcul, ni validation, ni accès Supabase.
 */

import { soirTemplate } from './soirTemplate.js';

const soirView = {
  elements: {},

  init() {
    const section = document.getElementById('soir-section');
    section.innerHTML = soirTemplate;

    this.elements = {
      navigation: document.getElementById('soir-navigation'),
      pagesContainer: document.getElementById('soir-pages'),

      navButtons: section.querySelectorAll('.soir-nav-button'),

      cashPage: document.getElementById('soir-cash-page'),
      cardPage: document.getElementById('soir-card-page'),
      ancvPage: document.getElementById('soir-ancv-page'),
      checksPage: document.getElementById('soir-checks-page'),
      recapPage: document.getElementById('soir-recap-page'),
    };
  },

  /**
   * Affiche la page demandée et masque les autres.
   *
   * @param {string} pageName - Nom de la page : cash, card, ancv, checks ou recap.
   * @returns {void}
   */
  showPage(pageName) {
    this.elements.navButtons.forEach((button) => {
      const isActive = button.dataset.soirPage === pageName;
      button.classList.toggle('is-active', isActive);
    });

    this.elements.pagesContainer
      .querySelectorAll('.soir-page')
      .forEach((page) => {
        const isActive = page.dataset.soirPage === pageName;
        page.classList.toggle('is-hidden', !isActive);
      });
  },

  /**
   * Retourne le conteneur d’une page.
   *
   * @param {string} pageName - Nom de la page.
   * @returns {HTMLElement|null} Conteneur de la page.
   */
  getPageContainer(pageName) {
    const pages = {
      cash: this.elements.cashPage,
      card: this.elements.cardPage,
      ancv: this.elements.ancvPage,
      checks: this.elements.checksPage,
      recap: this.elements.recapPage,
    };

    return pages[pageName] || null;
  },
};

export default soirView;