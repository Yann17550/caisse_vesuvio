/**
 * Fichier : js/features/soir/pages/templates/recapPageTemplate.js
 * Rôle : template HTML de la page Récapitulatif du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 */


export const recapPageTemplate = `
  <h3>Récapitulatif</h3>



  <form id="soir-recap-form" class="card" novalidate>
    <div
      id="soir-recap-message"
      class="form-message"
      role="status"
    ></div>



    <fieldset>
      <legend>Encaissements</legend>



      <div class="recap-line">
        <span>Espèces Adipos</span>
        <strong id="soir-recap-adipos">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>CB classique + AMEX</span>
        <strong id="soir-recap-cb-classic-amex">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>CB Ticket Restaurant</span>
        <strong id="soir-recap-cb-tr">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>CB ANCV</span>
        <strong id="soir-recap-cb-ancv">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>myPOS</span>
        <strong id="soir-recap-mypos">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>ANCV papier</span>
        <strong id="soir-recap-ancv-paper">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>Chèques</span>
        <strong id="soir-recap-checks">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>Nombre de chèques</span>
        <strong id="soir-recap-checks-count">0</strong>
      </div>
    </fieldset>



    <fieldset>
      <legend>Écart</legend>



      <div class="recap-line">
        <span>Écart espèces</span>
        <strong id="soir-recap-cash-difference">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>myPOS</span>
        <strong id="soir-recap-mypos-difference">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>Écart total</span>
        <strong id="soir-recap-total-difference">0,00 €</strong>
      </div>
    </fieldset>



    <fieldset>
      <legend>Fréquentation</legend>



      <div class="form-field">
        <label for="soir-recap-dine-in">Nombre de couverts sur place</label>
        <input
          type="text"
          id="soir-recap-dine-in"
          inputmode="numeric"
          value="0"
        />
      </div>



      <div class="form-field">
        <label for="soir-recap-takeaway">Nombre de pizzas à emporter</label>
        <input
          type="text"
          id="soir-recap-takeaway"
          inputmode="numeric"
          value="0"
        />
      </div>
    </fieldset>



    <fieldset>
      <legend>TVA</legend>



      <div class="form-field">
        <label for="soir-recap-vat-55">Montant TTC 5,5 %</label>
        <input
          type="text"
          id="soir-recap-vat-55"
          inputmode="decimal"
          placeholder="Montant TTC 5,5 %"
        />
      </div>



      <div class="form-field">
        <label for="soir-recap-vat-10">Montant TTC 10 %</label>
        <input
          type="text"
          id="soir-recap-vat-10"
          inputmode="decimal"
          placeholder="Montant TTC 10 %"
        />
      </div>



      <div class="form-field">
        <label for="soir-recap-vat-20">Montant TTC 20 %</label>
        <input
          type="text"
          id="soir-recap-vat-20"
          inputmode="decimal"
          placeholder="Montant TTC 20 %"
        />
      </div>



      <div class="recap-line">
        <span>Total TVA TTC</span>
        <strong id="soir-recap-vat-total">0,00 €</strong>
      </div>



      <div class="recap-line">
        <span>Contrôle TVA</span>
        <strong id="soir-recap-coherence">—</strong>
      </div>
    </fieldset>



      <button
        type="submit"
        id="soir-recap-validate-button"
        class="button-primary"
      >
        Valider le Soir
      </button>
    </div>
  </form>
`;