/**
 * Fichier : clotures-vesuvio/soir/pages/pageCheques.js
 * Rôle : page Chèques du Soir.
 */

import {
  recalculerTotauxSoir,
  ajouterCheque,
} from '../etatClotureSoir.js';

import {
  convertirEnMontant,
} from '../../../core/montants/conversionMontants.js';

import { formaterEuro } from '../../../core/interface/formatageEuro.js';

/**
 * Génère le HTML de la page Chèques.
 *
 * @returns {string} HTML de la page.
 */
function genererHtmlCheques() {
  return `
    <div class="champ-formulaire">
      <label for="soir-cheques-montant">Montant du chèque</label>
      <input
        type="text"
        id="soir-cheques-montant"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <button type="button" id="soir-cheques-ajouter">
      Ajouter
    </button>

    <ul id="soir-cheques-liste"></ul>
    <p id="soir-cheques-total"></p>
  `;
}

/**
 * Initialise la page Chèques.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} etat - État du Soir.
 */
export function initialiserPageCheques(conteneur, etat) {
  conteneur.innerHTML = genererHtmlCheques();

  const champMontant = conteneur.querySelector('#soir-cheques-montant');
  const boutonAjouter = conteneur.querySelector('#soir-cheques-ajouter');
  const liste = conteneur.querySelector('#soir-cheques-liste');
  const elementTotal = conteneur.querySelector('#soir-cheques-total');

  function mettreAJourTotal() {
    elementTotal.textContent = `Total chèques : ${formaterEuro(
      etat.cheques.total,
    )} — ${etat.cheques.nombre} chèque(s)`;
  }

  boutonAjouter.addEventListener('click', () => {
    const montant = convertirEnMontant(champMontant.value);

    if (montant === null || montant <= 0) {
      elementTotal.textContent =
        'Chèques : saisir un montant valide et positif.';
      return;
    }

    ajouterCheque(etat, montant);
    champMontant.value = '';

    const element = document.createElement('li');
    element.textContent = formaterEuro(montant);
    liste.appendChild(element);

    mettreAJourTotal();
  });

  mettreAJourTotal();
}