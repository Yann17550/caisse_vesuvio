/**
 * Fichier : clotures-vesuvio/soir/pages/pageAncv.js
 * Rôle : page ANCV papier du Soir.
 */

import {
  definirValeur,
  recalculerTotauxSoir,
} from '../etatClotureSoir.js';

import { formaterEuro } from '../../../core/interface/formatageEuro.js';

/**
 * Génère le HTML de la page ANCV.
 *
 * @returns {string} HTML de la page.
 */
function genererHtmlAncv() {
  return `
    <div class="champ-formulaire">
      <label for="soir-ancv-10">Coupons de 10 €</label>
      <input
        type="number"
        id="soir-ancv-10"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-ancv-20">Coupons de 20 €</label>
      <input
        type="number"
        id="soir-ancv-20"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-ancv-25">Coupons de 25 €</label>
      <input
        type="number"
        id="soir-ancv-25"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-ancv-50">Coupons de 50 €</label>
      <input
        type="number"
        id="soir-ancv-50"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>

    <p id="soir-ancv-total"></p>
  `;
}

/**
 * Initialise la page ANCV.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} etat - État du Soir.
 */
export function initialiserPageAncv(conteneur, etat) {
  conteneur.innerHTML = genererHtmlAncv();

  const correspondances = [
    { champ: '#soir-ancv-10', chemin: 'ancvPapier.nombre10' },
    { champ: '#soir-ancv-20', chemin: 'ancvPapier.nombre20' },
    { champ: '#soir-ancv-25', chemin: 'ancvPapier.nombre25' },
    { champ: '#soir-ancv-50', chemin: 'ancvPapier.nombre50' },
  ];

  const elementTotal = conteneur.querySelector('#soir-ancv-total');

  function mettreAJourTotal() {
    elementTotal.textContent = `Total ANCV papier : ${formaterEuro(
      etat.ancvPapier.total,
    )}`;
  }

  correspondances.forEach(({ champ, chemin }) => {
    const element = conteneur.querySelector(champ);

    element.addEventListener('input', () => {
      const valeur = Number(element.value);

      definirValeur(
        etat,
        chemin,
        Number.isInteger(valeur) && valeur >= 0 ? valeur : 0,
      );

      recalculerTotauxSoir(etat);
      mettreAJourTotal();
    });
  });

  mettreAJourTotal();
}