/**
 * Fichier : js/features/soir/pages/cashPage.js
 * Rôle : fournir et afficher la page Espèces du service Soir.
 *
 * Cette page gère :
 * - le fond de caisse ;
 * - le décompte des billets et pièces ;
 * - le total des espèces comptées, correspondant au CA en espèces ;
 * - les espèces Adipos.
 *
 * Total espèces comptées = (billets + pièces) - fond de caisse.
 * L’écart espèces est visible dans le Récapitulatif.
 *
 * La touche Entrée permet de passer d’un champ au suivant.
 */

import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { formatEuro } from '../../../utils/format.js';

export const cashPageTemplate = `
  <h3>Espèces</h3>

  <form id="soir-cash-form" class="card" novalidate>
    <fieldset>
      <legend>Fond de caisse</legend>

      <div class="form-field">
        <label for="soir-cash-fund">Fond de caisse</label>
        <input
          type="text"
          id="soir-cash-fund"
          inputmode="decimal"
          value="134"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Billets</legend>

      <div class="form-field">
        <label for="soir-bill-100">Billets de 100 €</label>
        <input
          type="text"
          id="soir-bill-100"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-bill-50">Billets de 50 €</label>
        <input
          type="text"
          id="soir-bill-50"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-bill-20">Billets de 20 €</label>
        <input
          type="text"
          id="soir-bill-20"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-bill-10">Billets de 10 €</label>
        <input
          type="text"
          id="soir-bill-10"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-bill-5">Billets de 5 €</label>
        <input
          type="text"
          id="soir-bill-5"
          inputmode="numeric"
          value="0"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Pièces</legend>

      <div class="form-field">
        <label for="soir-coin-2">Pièces de 2 €</label>
        <input
          type="text"
          id="soir-coin-2"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-coin-1">Pièces de 1 €</label>
        <input
          type="text"
          id="soir-coin-1"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-coin-050">Pièces de 0,50 €</label>
        <input
          type="text"
          id="soir-coin-050"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-coin-020">Pièces de 0,20 €</label>
        <input
          type="text"
          id="soir-coin-020"
          inputmode="numeric"
          value="0"
        />
      </div>

      <div class="form-field">
        <label for="soir-coin-010">Pièces de 0,10 €</label>
        <input
          type="text"
          id="soir-coin-010"
          inputmode="numeric"
          value="0"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Total</legend>

      <div class="recap-line">
        <span>Total espèces comptées</span>
        <strong id="soir-cash-counted-total">0,00 €</strong>
      </div>

      <div class="form-field">
        <label for="soir-cash-adipos">Espèces Adipos</label>
        <input
          type="text"
          id="soir-cash-adipos"
          inputmode="decimal"
          placeholder="Montant Adipos"
        />
      </div>
    </fieldset>
  </form>
`;

export function initCashPage(container) {
  container.innerHTML = cashPageTemplate;

  const formElement = document.getElementById('soir-cash-form');

  const inputs = {
    fund: document.getElementById('soir-cash-fund'),
    bill100: document.getElementById('soir-bill-100'),
    bill50: document.getElementById('soir-bill-50'),
    bill20: document.getElementById('soir-bill-20'),
    bill10: document.getElementById('soir-bill-10'),
    bill5: document.getElementById('soir-bill-5'),
    coin2: document.getElementById('soir-coin-2'),
    coin1: document.getElementById('soir-coin-1'),
    coin050: document.getElementById('soir-coin-050'),
    coin020: document.getElementById('soir-coin-020'),
    coin010: document.getElementById('soir-coin-010'),
    adipos: document.getElementById('soir-cash-adipos'),
  };

  const countedTotalElement = document.getElementById(
    'soir-cash-counted-total',
  );

  function getNumber(input) {
    const value = Number(input.value.replace(',', '.'));

    return Number.isFinite(value) ? value : 0;
  }

  function updateCountedTotal() {
    const cashOnHand =
      getNumber(inputs.bill100) * 100 +
      getNumber(inputs.bill50) * 50 +
      getNumber(inputs.bill20) * 20 +
      getNumber(inputs.bill10) * 10 +
      getNumber(inputs.bill5) * 5 +
      getNumber(inputs.coin2) * 2 +
      getNumber(inputs.coin1) * 1 +
      getNumber(inputs.coin050) * 0.5 +
      getNumber(inputs.coin020) * 0.2 +
      getNumber(inputs.coin010) * 0.1;

    const countedTotal = cashOnHand - getNumber(inputs.fund);

    countedTotalElement.textContent = formatEuro(countedTotal);
  }

  Object.values(inputs).forEach((input) => {
    input.addEventListener('input', updateCountedTotal);
  });

  setupEnterNavigation(formElement);

  updateCountedTotal();
}