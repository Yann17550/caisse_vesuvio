/**
 * Fichier : js/features/midi/midiView.js
 * Rôle : gérer l’affichage et les interactions visuelles du service Midi.
 *
 * Ce module ne calcule rien et n’appelle pas Supabase.
 * Il expose les éléments du formulaire et met à jour l’interface.
 *
 * Inputs :
 *  - Actions de l’utilisateur dans le formulaire Midi.
 *
 * Outputs :
 *  - Valeurs lues, messages affichés, listes et récapitulatifs mis à jour.
 *
 * Dépendances :
 *  - js/utils/format.js
 */

import { formatEuro, formatInteger } from '../../utils/format.js';

const midiView = {
  elements: {},

  /**
   * Récupère tous les éléments nécessaires au service Midi.
   *
   * @returns {void}
   */
  init() {
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

      modifyButton: document.getElementById('midi-modify-button'),
      validateButton: document.getElementById('midi-validate-button'),
    };
  },

  /**
   * Lit la valeur brute d’un champ.
   *
   * @param {HTMLInputElement} input - Champ à lire.
   * @returns {string} Valeur saisie, sans espaces.
   */
  getRawValue(input) {
    return input.value.trim();
  },

  /**
   * Lit le montant saisi pour un paiement MyPos.
   *
   * @returns {string} Valeur brute saisie.
   */
  getMyPosAmount() {
    return this.getRawValue(this.elements.myPosAmount);
  },

  /**
   * Vide le champ de saisie MyPos.
   *
   * @returns {void}
   */
  clearMyPosAmount() {
    this.elements.myPosAmount.value = '';
    this.elements.myPosAmount.focus();
  },

  /**
   * Affiche la liste des paiements MyPos.
   *
   * @param {Array<{id: string, amount: number}>} payments - Paiements validés.
   * @param {(id: string) => void} onRemove - Fonction appelée lors d’une suppression.
   * @returns {void}
   */
  renderMyPosPayments(payments, onRemove) {
    this.elements.myPosList.innerHTML = '';

    payments.forEach((payment) => {
      const listItem = document.createElement('li');
      listItem.dataset.paymentId = payment.id;

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

  /**
   * Affiche le total MyPos.
   *
   * @param {number} total - Total en euros.
   * @returns {void}
   */
  renderMyPosTotal(total) {
    this.elements.myPosTotal.textContent = formatEuro(total);
  },

  /**
   * Affiche ou masque une ligne du récapitulatif.
   *
   * @param {string} field - Nom de l’élément du récapitulatif.
   * @param {boolean} isVisible - True pour afficher la ligne.
   * @returns {void}
   */
  setRecapVisibility(field, isVisible) {
    const target = this.elements[field];

    if (!target) {
      return;
    }

    const recapRow = target.closest('.recap-list > div');

    if (recapRow) {
      recapRow.classList.toggle('is-hidden', !isVisible);
    }
  },

  /**
   * Met à jour une ligne du récapitulatif Midi.
   *
   * @param {string} field - Nom de l’élément du récapitulatif.
   * @param {number} value - Valeur à afficher.
   * @param {'currency'|'integer'} type - Type d’affichage.
   * @returns {void}
   */
  renderRecapValue(field, value, type = 'currency') {
    const target = this.elements[field];

    if (!target) {
      return;
    }

    target.textContent =
      type === 'integer'
        ? formatInteger(value)
        : formatEuro(value);
  },

  /**
   * Affiche un message à l’utilisateur.
   *
   * @param {string} text - Message à afficher.
   * @param {'info'|'success'|'error'} type - Type de message.
   * @returns {void}
   */
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

  /**
   * Vide le message affiché.
   *
   * @returns {void}
   */
  clearMessage() {
    this.elements.message.textContent = '';
    this.elements.message.classList.remove('is-error', 'is-success');
  },

  /**
   * Active ou désactive les boutons du formulaire.
   *
   * @param {boolean} isLocked - True si le Midi est validé.
   * @returns {void}
   */
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

  /**
   * Réinitialise l’affichage du formulaire Midi.
   *
   * @returns {void}
   */
  reset() {
    this.elements.form.reset();
    this.elements.myPosList.innerHTML = '';
    this.elements.myPosTotal.textContent = formatEuro(0);
    this.clearMessage();
  },
};

export default midiView;