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



/**
 * Titres affichés dans le header de page,
 * selon la page du Soir sélectionnée.
 */
const PAGE_TITLES = {
  card: 'CB',
  cash: 'Espèces',
  ancv: 'ANCV',
  checks: 'Chèques',
  recap: 'Récapitulatif',
};



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
   * Met également à jour le titre de page affiché
   * au-dessus du conteneur.
   *
   * @param {string} page - Identifiant de la page à afficher.
   * @returns {void}
   */
  showPage(page) {
    this.currentPage = page;



    soirView.showPage(page);



    const titleElement = document.getElementById('soir-page-title');



    if (!titleElement) {
      return;
    }



    // Page ANCV : le titre affiche aussi le total général,
    // mis à jour en direct par ancvPage.js.
    if (page === 'ancv') {
      titleElement.innerHTML =
        'ANCV — <strong id="soir-ancv-grand-total">0,00 €</strong>';
    }



    // Page Espèces : le titre affiche aussi le CA espèces,
    // mis à jour en direct par cashPage.js.
    if (page === 'cash') {
      titleElement.innerHTML =
        'Espèces — <strong id="soir-cash-counted-total">0,00 €</strong>';
    }



    // Page Chèques : le titre affiche aussi le total,
    // mis à jour en direct par checksPage.js.
    if (page === 'checks') {
      titleElement.innerHTML =
        'Chèques — <strong id="soir-checks-total">0,00 €</strong>';
    }



    // Page Récapitulatif : le titre affiche la TVA TTC totale
    // et l'écart total, mis à jour en direct par recapPage.js.
    if (page === 'recap') {
      titleElement.innerHTML =
        'Récapitulatif — TVA TTC : ' +
        '<strong id="soir-recap-title-vat">0,00 €</strong>' +
        ' — Écart : ' +
        '<strong id="soir-recap-title-ecart">0,00 €</strong>';
    }



    if (
      page !== 'ancv' &&
      page !== 'cash' &&
      page !== 'checks' &&
      page !== 'recap'
    ) {
      titleElement.textContent = PAGE_TITLES[page] || '';
    }



    // Le titre vient d'être recréé : les pages concernées
    // peuvent maintenant le mettre à jour.
    document.dispatchEvent(
      new CustomEvent('soir:page-shown', { detail: { page } }),
    );
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