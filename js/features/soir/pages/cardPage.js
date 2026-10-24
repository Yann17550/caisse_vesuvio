/**
 * Fichier : js/features/soir/pages/cardPage.js
 * Rôle : fournir et afficher la page CB du service Soir.
 *
 * Cette page gère :
 * - la CB classique (contact et sans contact) ;
 * - le myPOS, paiement par paiement ;
 * - la CB titres restaurant (contact et sans contact) ;
 * - la CB ANCV (contact et sans contact) ;
 * - la CB AMEX (contact et sans contact).
 *
 * Chaque type de paiement possède son propre cumul.
 * La touche Entrée permet de passer d’un champ au suivant,
 * sauf dans le champ myPOS où Entrée ajoute un paiement.
 */

import { createPaymentList } from '../../../utils/paymentList.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { formatEuro } from '../../../utils/format.js';

export const cardPageTemplate = `
  <h3>CB</h3>

  <form id="soir-card-form" class="card" novalidate>
    <fieldset>
      <legend>CB classique</legend>

      <div class="form-field">
        <label for="soir-card-classic-contact">Contact</label>
        <input
          type="text"
          id="soir-card-classic-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>

      <div class="form-field">
        <label for="soir-card-classic-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-classic-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>

      <div class="recap-line">
        <span>Total CB classique</span>
        <strong id="soir-card-classic-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>myPOS</legend>

      <div class="form-field">
        <label for="soir-card-mypos-amount">Montant du paiement</label>
        <input
          type="text"
          id="soir-card-mypos-amount"
          inputmode="decimal"
          placeholder="Montant puis Entrée"
        />
      </div>

      <button
        type="button"
        id="soir-card-mypos-add"
        class="button"
      >
        Ajouter un paiement
      </button>

      <ul id="soir-card-mypos-list"></ul>

      <div class="recap-line">
        <span>Total myPOS</span>
        <strong id="soir-card-mypos-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>CB titres restaurant</legend>

      <div class="form-field">
        <label for="soir-card-tr-contact">Contact</label>
        <input
          type="text"
          id="soir-card-tr-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>

      <div class="form-field">
        <label for="soir-card-tr-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-tr-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>

      <div class="recap-line">
        <span>Total CB titres restaurant</span>
        <strong id="soir-card-tr-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>CB ANCV</legend>

      <div class="form-field">
        <label for="soir-card-ancv-contact">Contact</label>
        <input
          type="text"
          id="soir-card-ancv-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>

      <div class="form-field">
        <label for="soir-card-ancv-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-ancv-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>

      <div class="recap-line">
        <span>Total CB ANCV</span>
        <strong id="soir-card-ancv-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>AMEX</legend>

      <div class="form-field">
        <label for="soir-card-amex-contact">Contact</label>
        <input
          type="text"
          id="soir-card-amex-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>

      <div class="form-field">
        <label for="soir-card-amex-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-amex-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>

      <div class="recap-line">
        <span>Total AMEX</span>
        <strong id="soir-card-amex-total">0,00 €</strong>
      </div>
    </fieldset>
  </form>
`;

export function initCardPage(container) {
  container.innerHTML = cardPageTemplate;

  const formElement = document.getElementById('soir-card-form');

  const classicContactInput = document.getElementById(
    'soir-card-classic-contact',
  );
  const classicNoContactInput = document.getElementById(
    'soir-card-classic-no-contact',
  );
  const classicTotalElement = document.getElementById(
    'soir-card-classic-total',
  );

  const trContactInput = document.getElementById('soir-card-tr-contact');
  const trNoContactInput = document.getElementById('soir-card-tr-no-contact');
  const trTotalElement = document.getElementById('soir-card-tr-total');

  const ancvContactInput = document.getElementById('soir-card-ancv-contact');
  const ancvNoContactInput = document.getElementById(
    'soir-card-ancv-no-contact',
  );
  const ancvTotalElement = document.getElementById('soir-card-ancv-total');

  const amexContactInput = document.getElementById('soir-card-amex-contact');
  const amexNoContactInput = document.getElementById(
    'soir-card-amex-no-contact',
  );
  const amexTotalElement = document.getElementById('soir-card-amex-total');

  const myPosAmountInput = document.getElementById(
    'soir-card-mypos-amount',
  );

  function getAmount(input) {
    const value = Number(input.value.replace(',', '.'));

    return Number.isFinite(value) ? value : 0;
  }

  function updateClassicTotal() {
    const total =
      getAmount(classicContactInput) +
      getAmount(classicNoContactInput);

    classicTotalElement.textContent = formatEuro(total);
  }

  function updateTrTotal() {
    const total =
      getAmount(trContactInput) +
      getAmount(trNoContactInput);

    trTotalElement.textContent = formatEuro(total);
  }

  function updateAncvTotal() {
    const total =
      getAmount(ancvContactInput) +
      getAmount(ancvNoContactInput);

    ancvTotalElement.textContent = formatEuro(total);
  }

  function updateAmexTotal() {
    const total =
      getAmount(amexContactInput) +
      getAmount(amexNoContactInput);

    amexTotalElement.textContent = formatEuro(total);
  }

  const myPosList = createPaymentList({
    amountInput: myPosAmountInput,
    addButton: document.getElementById('soir-card-mypos-add'),
    listElement: document.getElementById('soir-card-mypos-list'),
    totalElement: document.getElementById('soir-card-mypos-total'),
    onChange: () => {
      container.dispatchEvent(
        new CustomEvent('soir:payments-changed', { bubbles: true }),
      );
    },
  });

  setupEnterNavigation(formElement, myPosAmountInput);

  [
    classicContactInput,
    classicNoContactInput,
  ].forEach((input) => {
    input.addEventListener('input', updateClassicTotal);
  });

  [
    trContactInput,
    trNoContactInput,
  ].forEach((input) => {
    input.addEventListener('input', updateTrTotal);
  });

  [
    ancvContactInput,
    ancvNoContactInput,
  ].forEach((input) => {
    input.addEventListener('input', updateAncvTotal);
  });

  [
    amexContactInput,
    amexNoContactInput,
  ].forEach((input) => {
    input.addEventListener('input', updateAmexTotal);
  });

  updateClassicTotal();
  updateTrTotal();
  updateAncvTotal();
  updateAmexTotal();
}