/**
 * Fichier : js/features/soir/soirController.js
 * Rôle : coordonner la navigation et les pages du service Soir.
 *
 * Ce contrôleur ne contient ni calcul métier ni accès Supabase.
 * Il délègue chaque page à son module dédié.
 */


import soirView from './soirView.js';
import { initCashPage } from './pages/cashPage.js';
import { initCardPage } from './pages/cardPage.js';
import { initAncvPage } from './pages/ancvPage.js';
import { initChecksPage } from './pages/checksPage.js';
import { initRecapPage } from './pages/recapPage.js';
import { validateCashPage } from './pages/cashPage.js';


const soirController = {
  currentPage: 'card',


  /**
   * Initialise le service Soir.
   *
   * @returns {void}
   */
  init() {
    soirView.init();


    this.initPages();
    this.bindNavigation();


    this.showPage('card');
  },


  /**
   * Initialise les pages du service Soir.
   *
   * @returns {void}
   */
  initPages() {
    const cashContainer = document.getElementById('soir-cash-page');


    if (cashContainer) {
      initCashPage(cashContainer);
    }


    const cardContainer = document.getElementById('soir-card-page');


    if (cardContainer) {
      initCardPage(cardContainer);
    }


    const ancvContainer = document.getElementById('soir-ancv-page');


    if (ancvContainer) {
      initAncvPage(ancvContainer);
    }


    const checksContainer = document.getElementById('soir-checks-page');


    if (checksContainer) {
      initChecksPage(checksContainer);
    }


    const recapContainer = document.getElementById('soir-recap-page');


    if (recapContainer) {
      initRecapPage(recapContainer);
    }
  },


  /**
   * Affiche une page du service Soir.
   *
   * @param {string} page - Identifiant de la page à afficher.
   * @returns {void}
   */
  showPage(page) {
    this.currentPage = page;


    soirView.showPage(page);
  },


  /**
   * Attache les écouteurs de navigation.
   *
   * @returns {void}
   */
  bindNavigation() {
    soirView.elements.navButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetPage = button.dataset.soirPage;


        // Validation obligatoire avant de quitter la page Espèces.
        if (this.currentPage === 'cash' && targetPage !== 'cash') {
          if (!validateCashPage()) {
            return;
          }
        }


        this.showPage(targetPage);
      });
    });
  },
};


export default soirController;