/**
 * Fichier : js/utils/paymentList.js
 * Rôle : gérer une liste de paiements saisis un par un.
 *
 * UX identique au myPOS du Midi :
 * - saisie du montant dans un champ unique ;
 * - touche Entrée pour ajouter le paiement ;
 * - champ vidé et focus conservé après ajout ;
 * - suppression possible depuis la liste.
 *
 * Réutilisé par :
 * - le myPOS du Midi ;
 * - le myPOS du Soir ;
 * - les chèques du Soir.
 */

import { validatePositiveAmount } from '../validation/amountValidation.js';
import { formatEuro } from './format.js';

export function createPaymentList({
  amountInput,
  addButton,
  listElement,
  totalElement,
  onChange = () => {},
}) {
  const payments = [];

  function render() {
    listElement.innerHTML = '';

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
        remove(payment.id);
      });

      listItem.append(amount, removeButton);
      listElement.appendChild(listItem);
    });

    totalElement.textContent = formatEuro(getTotal());
  }

  function getTotal() {
    return payments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0);
  }
  function getCount() {
    return payments.length;
  }
  function add() {
    const validation = validatePositiveAmount(amountInput.value.trim());

    if (!validation.isValid) {
      return validation;
    }

    payments.push({
      id: crypto.randomUUID(),
      amount: validation.value,
    });

    amountInput.value = '';
    amountInput.focus();
    render();
    onChange();

    return validation;
  }

  function remove(paymentId) {
    const index = payments.findIndex((payment) => {
      return payment.id === paymentId;
    });

    if (index !== -1) {
      payments.splice(index, 1);
    }

    render();
    onChange();
  }

  addButton.addEventListener('click', add);

  amountInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      add();
    }
  });

  return {
    getTotal,
    getCount,
    render,
  };
}