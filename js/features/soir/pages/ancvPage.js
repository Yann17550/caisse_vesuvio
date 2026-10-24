/**
 * Fichier : js/features/soir/pages/ancvPage.js
 * Rôle : fournir et afficher la page ANCV du service Soir.
 *
 * Cette page gère les ANCV papier par valeur :
 * - 10 € ;
 * - 20 € ;
 * - 25 € ;
 * - 50 €.
 *
 * Pour chaque valeur : nombre de titres et total.
 * Un total général cumule les quatre valeurs.
 *
 * La touche Entrée permet de passer d’un champ au suivant.
 */

import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { formatEuro } from '../../../utils/format.js';

export const ancvPageTemplate = `
  <h3>ANCV</h3>

  <form id="soir-ancv-form" class="card" novalidate>
    <fieldset>
      <legend>ANCV papier</legend>

      <div class="recap-line">
        <span>ANCV</span>
        <span>Total cumulé</span>
      </div>

      <div class="form-field">
        <label for="soir-ancv-nb-10">ANCV 10 €</label>
        <input
          type="text"
          id="soir-ancv-nb-10"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-10">0,00 €</strong>
      </div>

      <div class="form-field">
        <label for="soir-ancv-nb-20">ANCV 20 €</label>
        <input
          type="text"
          id="soir-ancv-nb-20"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-20">0,00 €</strong>
      </div>

      <div class="form-field">
        <label for="soir-ancv-nb-25">ANCV 25 €</label>
        <input
          type="text"
          id="soir-ancv-nb-25"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-25">0,00 €</strong>
      </div>

      <div class="form-field">
        <label for="soir-ancv-nb-50">ANCV 50 €</label>
        <input
          type="text"
          id="soir-ancv-nb-50"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-50">0,00 €</strong>
      </div>

      <div class="recap-line">
        <span>Total général ANCV</span>
        <strong id="soir-ancv-grand-total">0,00 €</strong>
      </div>
    </fieldset>
  </form>
`;

export function initAncvPage(container) {
  container.innerHTML = ancvPageTemplate;

  const formElement = document.getElementById('soir-ancv-form');

  const denominations = [
    {
      value: 10,
      nbInput: document.getElementById('soir-ancv-nb-10'),
      totalElement: document.getElementById('soir-ancv-total-10'),
    },
    {
      value: 20,
      nbInput: document.getElementById('soir-ancv-nb-20'),
      totalElement: document.getElementById('soir-ancv-total-20'),
    },
    {
      value: 25,
      nbInput: document.getElementById('soir-ancv-nb-25'),
      totalElement: document.getElementById('soir-ancv-total-25'),
    },
    {
      value: 50,
      nbInput: document.getElementById('soir-ancv-nb-50'),
      totalElement: document.getElementById('soir-ancv-total-50'),
    },
  ];

  const grandTotalElement = document.getElementById(
    'soir-ancv-grand-total',
  );

  function getQuantity(input) {
    const value = Number(input.value);

    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  function updateTotals() {
    let grandTotal = 0;

    denominations.forEach((denomination) => {
      const total =
        getQuantity(denomination.nbInput) * denomination.value;

      denomination.totalElement.textContent = formatEuro(total);
      grandTotal += total;
    });

    grandTotalElement.textContent = formatEuro(grandTotal);
  }

  denominations.forEach((denomination) => {
    denomination.nbInput.addEventListener('input', updateTotals);
  });

  setupEnterNavigation(formElement);

  updateTotals();
}