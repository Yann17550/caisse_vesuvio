/**
 * Fichier : js/features/soir/pages/templates/cardPageTemplate.js
 * Rôle : template HTML de la page CB du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 */

export const cardPageTemplate = `
  <h3>CB</h3>


  <form id="soir-card-form" class="card" novalidate>
    <fieldset>
      <legend>CB classique</legend>


      <div class="form-field">
        <label for="soir-card-classic-contact">Contact</label>
        <input
          type="text"
          id="soir-card-classic-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>


      <div class="form-field">
        <label for="soir-card-classic-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-classic-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>


      <div class="recap-line">
        <span>Total CB classique</span>
        <strong id="soir-card-classic-total">0,00 €</strong>
      </div>
    </fieldset>


    <fieldset>
      <legend>myPOS</legend>


      <div class="form-field">
        <label for="soir-card-mypos-amount">Montant du paiement</label>
        <input
          type="text"
          id="soir-card-mypos-amount"
          inputmode="decimal"
          placeholder="Montant puis Entrée"
        />
      </div>


      <button
        type="button"
        id="soir-card-mypos-add"
        class="button"
      >
        Ajouter un paiement
      </button>


      <ul id="soir-card-mypos-list"></ul>


      <div class="recap-line">
        <span>Total myPOS</span>
        <strong id="soir-card-mypos-total">0,00 €</strong>
      </div>
    </fieldset>


    <fieldset>
      <legend>CB titres restaurant</legend>


      <div class="form-field">
        <label for="soir-card-tr-contact">Contact</label>
        <input
          type="text"
          id="soir-card-tr-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>


      <div class="form-field">
        <label for="soir-card-tr-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-tr-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>


      <div class="recap-line">
        <span>Total CB titres restaurant</span>
        <strong id="soir-card-tr-total">0,00 €</strong>
      </div>
    </fieldset>


    <fieldset>
      <legend>CB ANCV</legend>


      <div class="form-field">
        <label for="soir-card-ancv-contact">Contact</label>
        <input
          type="text"
          id="soir-card-ancv-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>


      <div class="form-field">
        <label for="soir-card-ancv-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-ancv-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>


      <div class="recap-line">
        <span>Total CB ANCV</span>
        <strong id="soir-card-ancv-total">0,00 €</strong>
      </div>
    </fieldset>


    <fieldset>
      <legend>AMEX</legend>


      <div class="form-field">
        <label for="soir-card-amex-contact">Contact</label>
        <input
          type="text"
          id="soir-card-amex-contact"
          inputmode="decimal"
          placeholder="Montant contact"
        />
      </div>


      <div class="form-field">
        <label for="soir-card-amex-no-contact">Sans contact</label>
        <input
          type="text"
          id="soir-card-amex-no-contact"
          inputmode="decimal"
          placeholder="Montant sans contact"
        />
      </div>


      <div class="recap-line">
        <span>Total AMEX</span>
        <strong id="soir-card-amex-total">0,00 €</strong>
      </div>
    </fieldset>
  </form>
`;