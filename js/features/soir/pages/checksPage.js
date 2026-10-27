/**
 * Fichier : js/features/soir/pages/checksPage.js
 * Rôle : logique de la page Chèques du service Soir.
 *
 * Cette page gère les chèques saisis un par un :
 * - montant saisi puis validé avec Entrée ;
 * - nombre de chèques affiché en bas de page ;
 * - total des chèques affiché dans le titre de page.
 *
 * Le total est également écrit dans un span caché,
 * lu par soirTotals.js depuis n'importe quelle page.
 *
 * Le span du titre est recréé par soirController.js à chaque
 * affichage de la page : il est donc recherché dans le DOM
 * à chaque mise à jour via un proxy.
 */


import { createPaymentList } from '../../../utils/paymentList.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { checksPageTemplate } from './templates/checksPageTemplate.js';


export function initChecksPage(container) {
  container.innerHTML = checksPageTemplate;


  const formElement = document.getElementById('soir-checks-form');


  const checksAmountInput = document.getElementById('soir-checks-amount');
  const checksCountElement = document.getElementById('soir-checks-count');


  // Le span du total vit dans le titre de page, recréé par le
  // contrôleur à chaque affichage. Ce proxy le recherche donc
  // dynamiquement et écrit aussi dans le span caché.
  const checksTotalProxy = {
    get textContent() {
      const element = document.getElementById('soir-checks-total');
      return element ? element.textContent : '';
    },
    set textContent(value) {
      const titleElement = document.getElementById('soir-checks-total');
      if (titleElement) {
        titleElement.textContent = value;
      }

      const hiddenElement = document.getElementById('soir-checks-total-value');
      if (hiddenElement) {
        hiddenElement.textContent = value;
      }
    },
  };


  function updateChecksCount() {
    if (checksCountElement) {
      checksCountElement.textContent = String(checksList.getCount());
    }
  }


  const checksList = createPaymentList({
    amountInput: checksAmountInput,
    addButton: document.getElementById('soir-checks-add'),
    listElement: document.getElementById('soir-checks-list'),
    totalElement: checksTotalProxy,
    onChange: () => {
      updateChecksCount();
      container.dispatchEvent(
        new CustomEvent('soir:payments-changed', { bubbles: true }),
      );
    },
  });


  setupEnterNavigation(formElement, checksAmountInput);


  updateChecksCount();
}