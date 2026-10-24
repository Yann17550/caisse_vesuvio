/**
 * Fichier : js/features/soir/pages/templates/cashPageTemplate.js
 * Rôle : template HTML de la page Espèces du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 */

export const cashPageTemplate = `
  <h3>Espèces</h3>


  <form id="soir-cash-form" class="card" novalidate>
    <fieldset>
      <legend>Fond de caisse</legend>


      <div class="form-field">
        <label for="soir-cash-fund">Fond de caisse</label>
        <input
          type="text"
          id="soir-cash-fund"
          inputmode="decimal"
          value="134"
        />
      </div>
    </fieldset>


    <fieldset>
      <legend>Billets</legend>


      <div class="form-field">
        <label for="soir-bill-100">Billets de 100 €</label>
        <input
          type="text"
          id="soir-bill-100"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-bill-50">Billets de 50 €</label>
        <input
          type="text"
          id="soir-bill-50"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-bill-20">Billets de 20 €</label>
        <input
          type="text"
          id="soir-bill-20"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-bill-10">Billets de 10 €</label>
        <input
          type="text"
          id="soir-bill-10"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-bill-5">Billets de 5 €</label>
        <input
          type="text"
          id="soir-bill-5"
          inputmode="numeric"
          value="0"
        />
      </div>
    </fieldset>


    <fieldset>
      <legend>Pièces</legend>


      <div class="form-field">
        <label for="soir-coin-2">Pièces de 2 €</label>
        <input
          type="text"
          id="soir-coin-2"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-coin-1">Pièces de 1 €</label>
        <input
          type="text"
          id="soir-coin-1"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-coin-050">Pièces de 0,50 €</label>
        <input
          type="text"
          id="soir-coin-050"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-coin-020">Pièces de 0,20 €</label>
        <input
          type="text"
          id="soir-coin-020"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-coin-010">Pièces de 0,10 €</label>
        <input
          type="text"
          id="soir-coin-010"
          inputmode="numeric"
          value="0"
        />
      </div>
    </fieldset>


    <fieldset>
      <legend>Total</legend>


      <div class="recap-line">
        <span>Total espèces comptées</span>
        <strong id="soir-cash-counted-total">0,00 €</strong>
      </div>


      <div class="form-field">
        <label for="soir-cash-adipos">Espèces Adipos</label>
        <input
          type="text"
          id="soir-cash-adipos"
          inputmode="decimal"
          placeholder="Montant Adipos"
        />
      </div>
    </fieldset>
  </form>
`;