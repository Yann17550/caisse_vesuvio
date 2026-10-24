/**
 * Fichier : js/features/soir/pages/templates/checksPageTemplate.js
 * Rôle : template HTML de la page Chèques du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 */

export const checksPageTemplate = `
  <h3>Chèques</h3>


  <form id="soir-checks-form" class="card" novalidate>
    <fieldset>
      <legend>Chèques</legend>


      <div class="form-field">
        <label for="soir-checks-amount">Montant du chèque</label>
        <input
          type="text"
          id="soir-checks-amount"
          inputmode="decimal"
          placeholder="Montant puis Entrée"
        />
      </div>


      <button
        type="button"
        id="soir-checks-add"
        class="button"
      >
        Ajouter un chèque
      </button>


      <ul id="soir-checks-list"></ul>


      <div class="recap-line">
        <span>Nombre de chèques</span>
        <strong id="soir-checks-count">0</strong>
      </div>


      <div class="recap-line">
        <span>Total chèques</span>
        <strong id="soir-checks-total">0,00 €</strong>
      </div>
    </fieldset>
  </form>
`;