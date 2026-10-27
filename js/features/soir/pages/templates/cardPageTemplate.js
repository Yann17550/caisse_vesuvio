/**
 * Fichier : js/features/soir/pages/templates/cardPageTemplate.js
 * Rôle : template HTML de la page CB du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 *
 * Le total myPOS est également écrit dans un span caché,
 * lu par soirTotals.js même lorsque la page CB n'est pas affichée.
 */



export const cardPageTemplate = `
  <form id="soir-card-form" class="card" novalidate>
    <fieldset>
      <legend>
        CB classique — <strong id="soir-card-classic-total">0,00 €</strong>
      </legend>


      <div class="soir-card-pair">
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
      </div>
    </fieldset>


    <fieldset>
      <legend>
        myPOS — <strong id="soir-card-mypos-total">0,00 €</strong>
      </legend>


      <div class="soir-card-mypos-row">
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
          Ajouter
        </button>
      </div>


      <ul id="soir-card-mypos-list"></ul>
    </fieldset>


    <fieldset>
      <legend>
        CB titres restaurant — <strong id="soir-card-tr-total">0,00 €</strong>
      </legend>


      <div class="soir-card-pair">
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
      </div>
    </fieldset>


    <fieldset>
      <legend>
        CB ANCV — <strong id="soir-card-ancv-total">0,00 €</strong>
      </legend>


      <div class="soir-card-pair">
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
      </div>
    </fieldset>


    <fieldset>
      <legend>
        AMEX — <strong id="soir-card-amex-total">0,00 €</strong>
      </legend>


      <div class="soir-card-pair">
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
      </div>
    </fieldset>

    <strong id="soir-card-mypos-total-value" hidden>0,00 €</strong>
  </form>
`;