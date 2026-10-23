/**
 * Fichier : js/features/midi/midiView.js
 * Rôle : afficher le service Midi et exposer ses éléments au contrôleur.
 *
 * La structure HTML vient de midiTemplate.js.
 * Ce fichier ne contient ni calcul, ni validation, ni accès Supabase.
 */

import { midiTemplate } from './midiTemplate.js';
import { formatEuro } from '../../utils/format.js';

const midiView = {
  elements: {},

  init() {
    const section = document.getElementById('midi-section');
    section.innerHTML = midiTemplate;

    this.elements = {
      form: document.getElementById('midi-form'),
      message: document.getElementById('midi-form-message'),

      myPosAmount: document.getElementById('midi-mypos-amount'),
      myPosAddButton: document.getElementById('midi-mypos-add-button'),
      myPosList: document.getElementById('midi-mypos-list'),
      myPosTotal: document.getElementById('midi-mypos-total'),

      cbClassic: document.getElementById('midi-cb-classic'),
      cbTicketResto: document.getElementById('midi-cb-ticket-resto'),
      cashAdipos: document.getElementById('midi-cash-adipos'),
      ancvPaper: document.getElementById('midi-ancv-paper'),
      ancvConnect: document.getElementById('midi-ancv-connect'),
      checks: document.getElementById('midi-checks'),

      vat55: document.getElementById('midi-vat-5-5'),
      vat10: document.getElementById('midi-vat-10'),
      vat20: document.getElementById('midi-vat-20'),

      pizzasDineIn: document.getElementById('midi-pizzas-dine-in'),
      pizzasTakeaway: document.getElementById('midi-pizzas-takeaway'),

      modifyButton: document.getElementById('midi-modify-button'),
      validateButton: document.getElementById('midi-validate-button'),

      recapMyPos: document.getElementById('recap-midi-mypos'),
      recapCbClassic: document.getElementById('recap-midi-cb-classic'),
      recapCbTicketResto: document.getElementById('recap-midi-cb-ticket-resto'),
      recapCashAdipos: document.getElementById('recap-midi-cash-adipos'),
      recapAncvPaper: document.getElementById('recap-midi-ancv-paper'),
      recapAncvConnect: document.getElementById('recap-midi-ancv-connect'),
      recapChecks: document.getElementById('recap-midi-checks'),
      recapVat55: document.getElementById('recap-midi-vat-5-5'),
      recapVat10: document.getElementById('recap-midi-vat-10'),
      recapVat20: document.getElementById('recap-midi-vat-20'),
      recapPizzasDineIn: document.getElementById('recap-midi-pizzas-dine-in'),
      recapPizzasTakeaway: document.getElementById('recap-midi-pizzas-takeaway'),
    };
  },

  getRawValue(input) {
    return input.value.trim();
  },

  getMyPosAmount() {
    return this.getRawValue(this.elements.myPosAmount);
  },

  clearMyPosAmount() {
    this.elements.myPosAmount.value = '';
    this.elements.myPosAmount.focus();
  },

  renderMyPosPayments(payments, onRemove) {
    this.elements.myPosList.innerHTML = '';

    payments.forEach((payment) => {
      const listItem = document.createElement('li');

      const amount = document.createElement('span');
      amount.textContent = formatEuro(payment.amount);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'payment-remove-button';
      removeButton.textContent = 'Supprimer';

      removeButton.addEventListener('click', () => {
        onRemove(payment.id);
      });

      listItem.append(amount, removeButton);
      this.elements.myPosList.appendChild(listItem);
    });
  },

  renderMyPosTotal(total) {
    this.elements.myPosTotal.textContent = formatEuro(total);
  },

  showMessage(text, type = 'info') {
    this.elements.message.textContent = text;
    this.elements.message.classList.remove('is-error', 'is-success');

    if (type === 'error') {
      this.elements.message.classList.add('is-error');
    }

    if (type === 'success') {
      this.elements.message.classList.add('is-success');
    }
  },

  clearMessage() {
    this.elements.message.textContent = '';
    this.elements.message.classList.remove('is-error', 'is-success');
  },

  setLocked(isLocked) {
    const inputs = this.elements.form.querySelectorAll('input, button');

    inputs.forEach((element) => {
      if (element === this.elements.modifyButton) {
        element.disabled = !isLocked;
        return;
      }

      if (element === this.elements.validateButton) {
        element.disabled = isLocked;
        return;
      }

      element.disabled = isLocked;
    });
  },
};

export default midiView;