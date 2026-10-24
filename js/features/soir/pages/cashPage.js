/**
 * Fichier : js/features/soir/pages/cashPage.js
 * Rôle : logique de la page Espèces du service Soir.
 *
 * Cette page gère :
 * - le fond de caisse ;
 * - le décompte des billets et pièces ;
 * - le total des espèces comptées, correspondant au CA en espèces ;
 * - les espèces Adipos.
 *
 * Total espèces comptées = (billets + pièces) - fond de caisse.
 * Le résultat ne peut jamais être négatif : le fond de caisse
 * ne fait pas partie du chiffre d’affaires.
 *
 * La touche Entrée permet de passer d’un champ au suivant.
 */



import { isFilled, showFieldError, clearFieldError } from '../../../utils/validation.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { formatEuro } from '../../../utils/format.js';
import { getInputAmount } from '../../../utils/amounts.js';
import { cashPageTemplate } from './templates/cashPageTemplate.js';



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



  function updateCountedTotal() {
    const cashOnHand =
      getInputAmount(inputs.bill100) * 100 +
      getInputAmount(inputs.bill50) * 50 +
      getInputAmount(inputs.bill20) * 20 +
      getInputAmount(inputs.bill10) * 10 +
      getInputAmount(inputs.bill5) * 5 +
      getInputAmount(inputs.coin2) * 2 +
      getInputAmount(inputs.coin1) * 1 +
      getInputAmount(inputs.coin050) * 0.5 +
      getInputAmount(inputs.coin020) * 0.2 +
      getInputAmount(inputs.coin010) * 0.1;



    // CA en espèces : le fond de caisse est déduit du comptage
    // physique, mais le résultat ne peut pas être négatif.
    const countedTotal = Math.max(
      0,
      cashOnHand - getInputAmount(inputs.fund),
    );



    countedTotalElement.textContent = formatEuro(countedTotal);
  }



  Object.values(inputs).forEach((input) => {
    input.addEventListener('input', updateCountedTotal);
  });



  setupEnterNavigation(formElement);



  updateCountedTotal();
}



/**
 * Valide la page Espèces du Soir.
 * Le champ Espèces Adipos est obligatoire, même s'il vaut 0.
 *
 * @returns {boolean} true si la page est valide, false sinon.
 */
export function validateCashPage() {
  const adiposInput = document.getElementById('soir-cash-adipos');



  clearFieldError(adiposInput);



  if (!isFilled(adiposInput.value)) {
    showFieldError(
      adiposInput,
      'Espèces Adipos obligatoire (0 autorisé).',
    );



    adiposInput.focus();



    return false;
  }



  return true;
}