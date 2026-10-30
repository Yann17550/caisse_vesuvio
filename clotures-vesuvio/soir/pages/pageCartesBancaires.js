/**
 * Fichier : clotures-vesuvio/soir/pages/pageCartesBancaires.js
 * Rôle : page CB et MyPOS du Soir.
 */

import {
  definirValeur,
  recalculerTotauxSoir,
  ajouterPaiementMyPos,
} from '../etatClotureSoir.js';

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../../core/montants/conversionMontants.js';

import { formaterEuro } from '../../../core/interface/formatageEuro.js';

/**
 * Génère le HTML d’un groupe de carte.
 *
 * @param {string} cle - Clé de la carte dans l’état.
 * @param {string} libelle - Libellé affiché.
 * @returns {string} HTML du groupe.
 */
function genererGroupeCarte(cle, libelle) {
  return `
    <div class="bloc-carte">
      <h3>${libelle}</h3>

      <div class="champ-formulaire">
        <label for="soir-${cle}-contact">Contact</label>
        <input
          type="text"
          id="soir-${cle}-contact"
          inputmode="decimal"
          autocomplete="off"
        />
      </div>

      <div class="champ-formulaire">
        <label for="soir-${cle}-sansContact">Sans contact</label>
        <input
          type="text"
          id="soir-${cle}-sansContact"
          inputmode="decimal"
          autocomplete="off"
        />
      </div>

      <p id="soir-${cle}-total"></p>
    </div>
  `;
}

/**
 * Génère le HTML de la page CB.
 *
 * @returns {string} HTML de la page.
 */
function genererHtmlCartes() {
  return `
    ${genererGroupeCarte('cbClassique', 'CB classique')}
    ${genererGroupeCarte('cbTicketRestaurant', 'CB Ticket Restaurant')}
    ${genererGroupeCarte('ancvConnecte', 'ANCV connecté')}
    ${genererGroupeCarte('amex', 'AMEX')}

    <div class="bloc-mypos">
      <h3>MyPOS</h3>

      <div class="champ-formulaire">
        <label for="soir-mypos-montant">Montant MyPOS</label>
        <input
          type="text"
          id="soir-mypos-montant"
          inputmode="decimal"
          autocomplete="off"
        />
      </div>

      <button type="button" id="soir-mypos-ajouter">
        Ajouter
      </button>

      <ul id="soir-mypos-liste"></ul>
      <p id="soir-mypos-total"></p>
    </div>
  `;
}

/**
 * Met à jour l’affichage d’un groupe de carte.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} etat - État du Soir.
 * @param {string} cle - Clé de la carte.
 */
function mettreAJourCarte(conteneur, etat, cle) {
  const carte = etat.cartes[cle];
  const elementTotal = conteneur.querySelector(`#soir-${cle}-total`);

  if (elementTotal) {
    elementTotal.textContent = `Total : ${formaterEuro(carte.total)}`;
  }
}

/**
 * Initialise la page CB.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} etat - État du Soir.
 */
export function initialiserPageCartes(conteneur, etat) {
  conteneur.innerHTML = genererHtmlCartes();

  const cartes = [
    'cbClassique',
    'cbTicketRestaurant',
    'ancvConnecte',
    'amex',
  ];

  cartes.forEach((cle) => {
    const champContact = conteneur.querySelector(`#soir-${cle}-contact`);
    const champSansContact = conteneur.querySelector(
      `#soir-${cle}-sansContact`,
    );

    champContact.addEventListener('input', () => {
      definirValeur(
        etat,
        `cartes.${cle}.contact`,
        convertirEnMontant(champContact.value) || 0,
      );
      recalculerTotauxSoir(etat);
      mettreAJourCarte(conteneur, etat, cle);
    });

    champSansContact.addEventListener('input', () => {
      definirValeur(
        etat,
        `cartes.${cle}.sansContact`,
        convertirEnMontant(champSansContact.value) || 0,
      );
      recalculerTotauxSoir(etat);
      mettreAJourCarte(conteneur, etat, cle);
    });

    mettreAJourCarte(conteneur, etat, cle);
  });

  const champMyPos = conteneur.querySelector('#soir-mypos-montant');
  const boutonMyPos = conteneur.querySelector('#soir-mypos-ajouter');
  const listeMyPos = conteneur.querySelector('#soir-mypos-liste');
  const totalMyPos = conteneur.querySelector('#soir-mypos-total');

  boutonMyPos.addEventListener('click', () => {
    const montant = convertirEnMontant(champMyPos.value);

    if (montant === null || montant <= 0) {
      totalMyPos.textContent =
        'MyPOS : saisir un montant valide et positif.';
      return;
    }

    ajouterPaiementMyPos(etat, montant);
    champMyPos.value = '';

    const element = document.createElement('li');
    element.textContent = formaterEuro(montant);
    listeMyPos.appendChild(element);

    totalMyPos.textContent = `Total MyPOS : ${formaterEuro(
      etat.myPos.total,
    )}`;
  });

  totalMyPos.textContent = `Total MyPOS : ${formaterEuro(
    etat.myPos.total,
  )}`;
}