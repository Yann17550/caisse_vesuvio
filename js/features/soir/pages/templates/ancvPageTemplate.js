/**
 * Fichier : js/features/soir/pages/templates/ancvPageTemplate.js
 * Rôle : template HTML de la page ANCV du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 */

export const ancvPageTemplate = `
  <h3>ANCV</h3>


  <form id="soir-ancv-form" class="card" novalidate>
    <fieldset>
      <legend>ANCV papier</legend>


      <div class="recap-line">
        <span>ANCV</span>
        <span>Total cumulé</span>
      </div>


      <div class="form-field">
        <label for="soir-ancv-nb-10">ANCV 10 €</label>
        <input
          type="text"
          id="soir-ancv-nb-10"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-10">0,00 €</strong>
      </div>


      <div class="form-field">
        <label for="soir-ancv-nb-20">ANCV 20 €</label>
        <input
          type="text"
          id="soir-ancv-nb-20"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-20">0,00 €</strong>
      </div>


      <div class="form-field">
        <label for="soir-ancv-nb-25">ANCV 25 €</label>
        <input
          type="text"
          id="soir-ancv-nb-25"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-25">0,00 €</strong>
      </div>


      <div class="form-field">
        <label for="soir-ancv-nb-50">ANCV 50 €</label>
        <input
          type="text"
          id="soir-ancv-nb-50"
          inputmode="numeric"
          value="0"
        />
        <strong id="soir-ancv-total-50">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>Total général ANCV</span>
        <strong id="soir-ancv-grand-total">0,00 €</strong>
      </div>
    </fieldset>
  </form>
`;