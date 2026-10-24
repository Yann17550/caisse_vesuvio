/**
 * Fichier : js/features/soir/pages/cardPage.js
 * Rôle : logique de la page CB du service Soir.
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
import { getInputAmount } from '../../../utils/amounts.js';
import { cardPageTemplate } from './templates/cardPageTemplate.js';


export function initCardPage(container) {
  container.innerHTML = cardPageTemplate;


  const formElement = document.getElementById('soir-card-form');


  const myPosAmountInput = document.getElementById(
    'soir-card-mypos-amount',
  );


  /**
   * Relie un couple contact / sans contact à son total affiché.
   *
   * @param {string} contactId - Identifiant du champ contact.
   * @param {string} noContactId - Identifiant du champ sans contact.
   * @param {string} totalId - Identifiant de l'élément de total.
   * @returns {Function} Fonction de mise à jour du total.
   */
  function bindContactPair(contactId, noContactId, totalId) {
    const contactInput = document.getElementById(contactId);
    const noContactInput = document.getElementById(noContactId);
    const totalElement = document.getElementById(totalId);


    function updateTotal() {
      const total =
        getInputAmount(contactInput) +
        getInputAmount(noContactInput);


      totalElement.textContent = formatEuro(total);
    }


    contactInput.addEventListener('input', updateTotal);
    noContactInput.addEventListener('input', updateTotal);


    updateTotal();


    return updateTotal;
  }


  bindContactPair(
    'soir-card-classic-contact',
    'soir-card-classic-no-contact',
    'soir-card-classic-total',
  );


  bindContactPair(
    'soir-card-tr-contact',
    'soir-card-tr-no-contact',
    'soir-card-tr-total',
  );


  bindContactPair(
    'soir-card-ancv-contact',
    'soir-card-ancv-no-contact',
    'soir-card-ancv-total',
  );


  bindContactPair(
    'soir-card-amex-contact',
    'soir-card-amex-no-contact',
    'soir-card-amex-total',
  );


  createPaymentList({
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
}