/**
 * Fichier : clotures-vesuvio/soir/pages/pageEspeces.js
 * Rôle : page Espèces du Soir.
 */

import {
  definirValeur,
  recalculerTotauxSoir,
} from '../etatClotureSoir.js';

import {
  convertirEnMontant,
} from '../../../core/montants/conversionMontants.js';

import { formaterEuro } from '../../../core/interface/formatageEuro.js';

/**
 * Génère le HTML de la page Espèces.
 *
 * @returns {string} HTML de la page.
 */
function genererHtmlEspeces() {
  return `
    <div class="champ-formulaire">
      <label for="soir-especes-fond">Fond de caisse</label>
      <input
        type="text"
        id="soir-especes-fond"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-especes-compte">Total compté</label>
      <input
        type="text"
        id="soir-especes-compte"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <div class="champ-formulaire">
      <label for="soir-especes-adipos">Espèces Adipos</label>
      <input
        type="text"
        id="soir-especes-adipos"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>

    <p id="soir-especes-ecart"></p>
  `;
}

/**
 * Initialise la page Espèces.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} etat - État du Soir.
 */
export function initialiserPageEspeces(conteneur, etat) {
  conteneur.innerHTML = genererHtmlEspeces();

  const champFond = conteneur.querySelector('#soir-especes-fond');
  const champCompte = conteneur.querySelector('#soir-especes-compte');
  const champAdipos = conteneur.querySelector('#soir-especes-adipos');
  const elementEcart = conteneur.querySelector('#soir-especes-ecart');

  function mettreAJourEcart() {
    elementEcart.textContent = `Écart espèces : ${formaterEuro(
      etat.especes.ecart,
    )}`;
  }

  champFond.addEventListener('input', () => {
    definirValeur(
      etat,
      'especes.fondCaisse',
      convertirEnMontant(champFond.value) || 0,
    );
    recalculerTotauxSoir(etat);
  });

  champCompte.addEventListener('input', () => {
    definirValeur(
      etat,
      'especes.totalCompte',
      convertirEnMontant(champCompte.value) || 0,
    );
    recalculerTotauxSoir(etat);
    mettreAJourEcart();
  });

  champAdipos.addEventListener('input', () => {
    definirValeur(
      etat,
      'especes.adipos',
      convertirEnMontant(champAdipos.value) || 0,
    );
    recalculerTotauxSoir(etat);
    mettreAJourEcart();
  });

  mettreAJourEcart();
}