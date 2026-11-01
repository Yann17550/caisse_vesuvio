/**
 * Fichier : clotures-vesuvio/soir/templates/pageCBTemplate.js
 * Rôle : fournir la structure HTML de la page CB du Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique JavaScript.
 */

export const pageCBTemplate = `
  <h2>CB</h2>

  <form id="soir-cb-form" class="card" novalidate>
    <div id="soir-cb-message" class="form-message" role="status"></div>

    <fieldset>
      <legend>CB classique</legend>

      <div class="soir-cb-grid">
        <div class="form-field">
          <label for="soir-card-classic-contact">Contact</label>
          <input
            type="text"
            id="soir-card-classic-contact"
            inputmode="decimal"
            value="0"
          />
        </div>

        <div class="form-field">
          <label for="soir-card-classic-no-contact">Sans contact</label>
          <input
            type="text"
            id="soir-card-classic-no-contact"
            inputmode="decimal"
            value="0"
          />
        </div>
      </div>

      <div class="recap-line">
        <span>Total CB classique</span>
        <strong id="soir-card-classic-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>CB Ticket Restaurant</legend>

      <div class="soir-cb-grid">
        <div class="form-field">
          <label for="soir-card-tr-contact">Contact</label>
          <input
            type="text"
            id="soir-card-tr-contact"
            inputmode="decimal"
            value="0"
          />
        </div>

        <div class="form-field">
          <label for="soir-card-tr-no-contact">Sans contact</label>
          <input
            type="text"
            id="soir-card-tr-no-contact"
            inputmode="decimal"
            value="0"
          />
        </div>
      </div>

      <div class="recap-line">
        <span>Total CB Ticket Restaurant</span>
        <strong id="soir-card-tr-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>ANCV connecté</legend>

      <div class="soir-cb-grid">
        <div class="form-field">
          <label for="soir-card-ancv-contact">Contact</label>
          <input
            type="text"
            id="soir-card-ancv-contact"
            inputmode="decimal"
            value="0"
          />
        </div>

        <div class="form-field">
          <label for="soir-card-ancv-no-contact">Sans contact</label>
          <input
            type="text"
            id="soir-card-ancv-no-contact"
            inputmode="decimal"
            value="0"
          />
        </div>
      </div>

      <div class="recap-line">
        <span>Total ANCV connecté</span>
        <strong id="soir-card-ancv-total">0,00 €</strong>
      </div>
    </fieldset>

    <fieldset>
      <legend>CB AMEX</legend>

      <div class="soir-cb-grid">
        <div class="form-field">
          <label for="soir-card-amex-contact">Contact</label>
          <input
            type="text"
            id="soir-card-amex-contact"
            inputmode="decimal"
            value="0"
          />
        </div>

        <div class="form-field">
          <label for="soir-card-amex-no-contact">Sans contact</label>
          <input
            type="text"
            id="soir-card-amex-no-contact"
            inputmode="decimal"
            value="0"
          />
        </div>
      </div>

      <div class="recap-line">
        <span>Total CB AMEX</span>
        <strong id="soir-card-amex-total">0,00 €</strong>
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
          placeholder="Montant"
        />
      </div>

      <button
        type="button"
        id="soir-card-mypos-add"
        class="button-secondary"
      >
        Ajouter le paiement
      </button>

      <ul id="soir-card-mypos-list" class="payment-list"></ul>

      <div class="recap-line">
        <span>Total myPOS</span>
        <strong id="soir-card-mypos-total">0,00 €</strong>
      </div>

      <input
        type="hidden"
        id="soir-card-mypos-total-value"
        value="0,00 €"
      />
    </fieldset>

    <button type="submit" class="button-primary">
      Continuer
    </button>
  </form>
`;