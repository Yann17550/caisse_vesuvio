/**
 * Fichier : js/features/soir/pages/checksPage.js
 * Rôle : fournir et afficher la page Chèques du service Soir.
 *
 * Cette page gère les chèques saisis un par un :
 * - montant saisi puis validé avec Entrée ;
 * - nombre de chèques ;
 * - total des chèques.
 */

import { createPaymentList } from '../../../utils/paymentList.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';

export const checksPageTemplate = `
  <h3>Chèques</h3>

  <form id="soir-checks-form" class="card" novalidate>
    <fieldset>
      <legend>Chèques</legend>

      <div class="form-field">
        <label for="soir-checks-amount">Montant du chèque</label>
        <input
          type="text"
          id="soir-checks-amount"
          inputmode="decimal"
          placeholder="Montant puis Entrée"
        />
      </div>

      <button
        type="button"
        id="soir-checks-add"
        class="button"
      >
        Ajouter un chèque
      </button>

      <ul id="soir-checks-list"></ul>

      <div class="recap-line">
        <span>Nombre de chèques</span>
        <strong id="soir-checks-count">0</strong>
      </div>

      <div class="recap-line">
        <span>Total chèques</span>
        <strong id="soir-checks-total">0,00 €</strong>
      </div>
    </fieldset>
  </form>
`;

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