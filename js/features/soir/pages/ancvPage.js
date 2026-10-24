/**
 * Fichier : js/features/soir/pages/ancvPage.js
 * Rôle : logique de la page ANCV du service Soir.
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
import { getQuantityFromInput } from '../../../utils/amounts.js';
import { ancvPageTemplate } from './templates/ancvPageTemplate.js';


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


  function updateTotals() {
    let grandTotal = 0;


    denominations.forEach((denomination) => {
      const total =
        getQuantityFromInput(denomination.nbInput) * denomination.value;


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