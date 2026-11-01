/**
 * Fichier : clotures-vesuvio/soir/templates/pageChequesTemplate.js
 * Rôle : fournir la structure HTML de la page Chèques du Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique JavaScript.
 */

export const pageChequesTemplate = `
  <form id="soir-checks-form" class="card" novalidate>
    <div class="soir-checks-row">
      <div class="form-field">
        <label for="soir-checks-amount">Montant du chèque</label>
        <input
          type="text"
          id="soir-checks-amount"
          inputmode="decimal"
          placeholder="Montant puis Entrée"
        />
      </div>

      <button type="button" id="soir-checks-add" class="button">Ajouter</button>
    </div>

    <ul id="soir-checks-list"></ul>

    <div class="recap-line">
      <span>Nombre de chèques</span>
      <strong id="soir-checks-count">0</strong>
    </div>

    <strong id="soir-checks-total-value" hidden>0,00 €</strong>
  </form>
`;