/**
 * Fichier : js/features/soir/pages/checksPage.js
 * Rôle : logique de la page Chèques du service Soir.
 *
 * Cette page gère les chèques saisis un par un :
 * - montant saisi puis validé avec Entrée ;
 * - nombre de chèques ;
 * - total des chèques.
 */


import { createPaymentList } from '../../../utils/paymentList.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { checksPageTemplate } from './templates/checksPageTemplate.js';


export function initChecksPage(container) {
  container.innerHTML = checksPageTemplate;


  const formElement = document.getElementById('soir-checks-form');


  const checksAmountInput = document.getElementById('soir-checks-amount');
  const checksCountElement = document.getElementById('soir-checks-count');


  function updateChecksCount() {
    checksCountElement.textContent = String(checksList.getCount());
  }


  const checksList = createPaymentList({
    amountInput: checksAmountInput,
    addButton: document.getElementById('soir-checks-add'),
    listElement: document.getElementById('soir-checks-list'),
    totalElement: document.getElementById('soir-checks-total'),
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