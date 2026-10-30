/**
 * Fichier : clotures-vesuvio/midi/modeleVueMidi.js
 * Rôle : décrire la structure HTML du formulaire Midi.
 *
 * Ce module ne manipule pas le DOM.
 */

import { formaterEuro } from '../../core/interface/formatageEuro.js';

/**
 * Crée le HTML d’un champ montant.
 *
 * @param {string} nom - Nom technique du champ.
 * @param {string} libelle - Libellé affiché.
 * @returns {string} HTML du champ.
 */
function creerChampMontant(nom, libelle) {
  return `
    <div class="champ-formulaire">
      <label for="midi-${nom}">${libelle}</label>
      <input
        type="text"
        id="midi-${nom}"
        name="${nom}"
        inputmode="decimal"
        autocomplete="off"
      />
    </div>
  `;
}

/**
 * Crée le HTML d’un champ entier.
 *
 * @param {string} nom - Nom technique du champ.
 * @param {string} libelle - Libellé affiché.
 * @returns {string} HTML du champ.
 */
function creerChampEntier(nom, libelle) {
  return `
    <div class="champ-formulaire">
      <label for="midi-${nom}">${libelle}</label>
      <input
        type="number"
        id="midi-${nom}"
        name="${nom}"
        min="0"
        step="1"
        inputmode="numeric"
        autocomplete="off"
      />
    </div>
  `;
}

/**
 * Génère le HTML du formulaire Midi.
 *
 * @returns {string} HTML complet du formulaire.
 */
export function genererFormulaireMidi() {
  return `
    <form id="formulaire-midi" class="formulaire-cloture">
      <section class="bloc-paiements">
        <h2>Paiements</h2>

        <div class="champ-formulaire">
          <label for="midi-myPos">CB MyPos</label>
          <input
            type="text"
            id="midi-myPos"
            name="myPos"
            inputmode="decimal"
            autocomplete="off"
            readonly
          />
        </div>

        ${creerChampMontant('cbClassique', 'CB classique')}
        ${creerChampMontant('cbTicketRestaurant', 'CB Ticket Restaurant')}
        ${creerChampMontant('cashAdipos', 'Espèces Adipos')}
        ${creerChampMontant('ancvPapier', 'ANCV papier')}
        ${creerChampMontant('ancvDematerialise', 'ANCV dématérialisé')}
        ${creerChampMontant('cheques', 'Chèques')}
      </section>

      <section class="bloc-tva">
        <h2>TVA</h2>

        ${creerChampMontant('tva55', 'TVA 5,5 %')}
        ${creerChampMontant('tva10', 'TVA 10 %')}
        ${creerChampMontant('tva20', 'TVA 20 %')}
      </section>

      <section class="bloc-pizzas">
        <h2>Pizzas</h2>

        ${creerChampEntier('pizzasSurPlace', 'Pizzas sur place')}
        ${creerChampEntier('pizzasEmporter', 'Pizzas à emporter')}
      </section>

      <section class="bloc-mypos">
        <h2>Ajouter un paiement MyPos</h2>

        <div class="champ-formulaire">
          <label for="midi-myPosSaisie">Montant MyPos</label>
          <input
            type="text"
            id="midi-myPosSaisie"
            inputmode="decimal"
            autocomplete="off"
          />
        </div>

        <button type="button" id="midi-myPosAjouter">
          Ajouter
        </button>

        <ul id="midi-myPosListe"></ul>
        <p id="midi-myPosTotal"></p>
      </section>

      <p id="midi-message" class="message"></p>

      <button type="submit" id="midi-valider">
        Valider le Midi
      </button>
    </form>
  `;
}

/**
 * Formate un montant pour l’affichage.
 *
 * @param {number|string} valeur - Montant à formater.
 * @returns {string} Montant formaté en euros.
 */
export function afficherMontant(valeur) {
  return formaterEuro(valeur);
}