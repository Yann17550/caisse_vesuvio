/**
 * Fichier : clotures-vesuvio/soir/pages/pageRecapitulatif.js
 * Rôle : page Récapitulatif du Soir.
 */

import {
  definirValeur,
  recalculerTotauxSoir,
} from '../etatClotureSoir.js';

import {
  afficherRecapitulatifSoir,
  mettreAJourTitreRecapitulatif,
} from '../affichageRecapitulatifSoir.js';

import {
  convertirEnMontant,
} from '../../../core/montants/conversionMontants.js';

/**
 * Génère le HTML de la page Récapitulatif.
 *
 * @returns {string} HTML de la page.
 */
function genererHtmlRecapitulatif() {
  return `
    <div class="champ-formulaire">
      <label for="soir-pizzas-sur-place">Pizzas sur place</label>
      <input
        type="number"
        id="soir-pizzas-sur-place"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-pizzas-emporter">Pizzas à emporter</label>
      <input
        type="number"
        id="soir-pizzas-emporter"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-tva-55">TVA 5,5 %</label>
      <input
        type="text"
        id="soir-tva-55"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-tva-10">TVA 10 %</label>
      <input
        type="text"
        id="soir-tva-10"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-tva-20">TVA 20 %</label>
      <input
        type="text"
        id="soir-tva-20"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <div id="soir-recap-conteneur"></div>
  `;
}

/**
 * Initialise la page Récapitulatif.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} etat - État du Soir.
 */
export function initialiserPageRecapitulatif(conteneur, etat) {
  conteneur.innerHTML = genererHtmlRecapitulatif();

  const champSurPlace = conteneur.querySelector(
    '#soir-pizzas-sur-place',
  );
  const champEmporter = conteneur.querySelector(
    '#soir-pizzas-emporter',
  );
  const champTva55 = conteneur.querySelector('#soir-tva-55');
  const champTva10 = conteneur.querySelector('#soir-tva-10');
  const champTva20 = conteneur.querySelector('#soir-tva-20');
  const conteneurRecap = conteneur.querySelector(
    '#soir-recap-conteneur',
  );

  function mettreAJourRecap() {
    recalculerTotauxSoir(etat);
    afficherRecapitulatifSoir(conteneurRecap, etat);
    mettreAJourTitreRecapitulatif(etat);
  }

  champSurPlace.addEventListener('input', () => {
    const valeur = Number(champSurPlace.value);

    definirValeur(
      etat,
      'frequentation.pizzasSurPlace',
      Number.isInteger(valeur) && valeur >= 0 ? valeur : 0,
    );

    mettreAJourRecap();
  });

  champEmporter.addEventListener('input', () => {
    const valeur = Number(champEmporter.value);

    definirValeur(
      etat,
      'frequentation.pizzasEmporter',
      Number.isInteger(valeur) && valeur >= 0 ? valeur : 0,
    );

    mettreAJourRecap();
  });

  champTva55.addEventListener('input', () => {
    definirValeur(
      etat,
      'tva.ttc55',
      convertirEnMontant(champTva55.value) || 0,
    );
    mettreAJourRecap();
  });

  champTva10.addEventListener('input', () => {
    definirValeur(
      etat,
      'tva.ttc10',
      convertirEnMontant(champTva10.value) || 0,
    );
    mettreAJourRecap();
  });

  champTva20.addEventListener('input', () => {
    definirValeur(
      etat,
      'tva.ttc20',
      convertirEnMontant(champTva20.value) || 0,
    );
    mettreAJourRecap();
  });

  mettreAJourRecap();
}