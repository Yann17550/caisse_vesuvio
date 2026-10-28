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
 *
 * La liste peut être initialisée avec des paiements existants,
 * afin de restaurer un brouillon après rafraîchissement.
 */


import { validatePositiveAmount } from '../validation/amountValidation.js';
import { formatEuro } from './format.js';


function createPaymentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'payment-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}


/**
 * Transforme des paiements enregistrés en liste exploitable.
 *
 * Les valeurs invalides sont ignorées afin d’éviter qu’un brouillon
 * corrompu bloque l’affichage ou les calculs.
 *
 * @param {*} initialPayments - Paiements à restaurer.
 * @returns {Array<Object>} Liste valide de paiements.
 */
function sanitizeInitialPayments(initialPayments) {
  if (!Array.isArray(initialPayments)) {
    return [];
  }

  return initialPayments
    .map((payment) => {
      const amount = Number(payment && payment.amount);

      if (!Number.isFinite(amount) || amount <= 0) {
        return null;
      }

      return {
        id:
          payment && typeof payment.id === 'string'
            ? payment.id
            : createPaymentId(),
        amount,
      };
    })
    .filter(Boolean);
}


/**
 * Crée une liste de paiements avec ajout, suppression et total.
 *
 * @param {Object} options - Configuration de la liste.
 * @param {HTMLInputElement} options.amountInput - Champ de saisie du montant.
 * @param {HTMLButtonElement} options.addButton - Bouton d’ajout.
 * @param {HTMLElement} options.listElement - Liste affichée.
 * @param {HTMLElement|Object} options.totalElement - Élément recevant le total.
 * @param {Array<Object>} [options.initialPayments] - Paiements à restaurer.
 * @param {Function} [options.onChange] - Action après chaque modification.
 * @returns {Object} Méthodes publiques de la liste.
 */
export function createPaymentList({
  amountInput,
  addButton,
  listElement,
  totalElement,
  initialPayments = [],
  onChange = () => {},
}) {
  const payments = sanitizeInitialPayments(initialPayments);


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


  /**
   * Retourne une copie des paiements courants.
   *
   * La copie évite qu’un fichier extérieur modifie directement
   * la liste interne.
   *
   * @returns {Array<Object>} Paiements courants.
   */
  function getPayments() {
    return payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
    }));
  }


  function add() {
    const validation = validatePositiveAmount(amountInput.value.trim());


    if (!validation.isValid) {
      return validation;
    }


    payments.push({
      id: createPaymentId(),
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


  /**
   * Vide entièrement la liste : paiements, champ de saisie et total.
   * Utilisée après l’enregistrement réussi d’une clôture.
   */
  function clear() {
    payments.length = 0;
    amountInput.value = '';
    render();
  }


  addButton.addEventListener('click', add);


  amountInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      add();
    }
  });


  // Affiche les paiements restaurés sans déclencher onChange :
  // la restauration initiale ne doit pas écraser le brouillon.
  render();


  return {
    getTotal,
    getCount,
    getPayments,
    render,
    clear,
  };
}