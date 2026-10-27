/**
 * Fichier : js/features/midi/midiTemplate.js
 * Rôle : fournir la structure HTML du service Midi.
 *
 * Mise en page mobile : 2 colonnes, myPOS et validation
 * en pleine largeur, pour limiter au maximum le défilement.
 *
 * Ce fichier ne contient aucune logique JavaScript,
 * aucune lecture de données et aucun accès au DOM.
 */


export const midiTemplate = `
  <h2>Service Midi</h2>



  <form id="midi-form" class="midi-form" novalidate>
    <div class="midi-grid">
      <div class="midi-field">
        <label for="midi-cb-classic">CB</label>
        <input
          type="text"
          id="midi-cb-classic"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>



      <div class="midi-field">
        <label for="midi-cb-ticket-resto">CB TR</label>
        <input
          type="text"
          id="midi-cb-ticket-resto"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>



      <div class="midi-field">
        <label for="midi-cash-adipos">Espèces</label>
        <input
          type="text"
          id="midi-cash-adipos"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>



      <div class="midi-field">
        <label for="midi-ancv-paper">ANCV</label>
        <input
          type="text"
          id="midi-ancv-paper"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>



      <div class="midi-field">
        <label for="midi-ancv-connect">ANCV CB</label>
        <input
          type="text"
          id="midi-ancv-connect"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>



      <div class="midi-field">
        <label for="midi-checks">Chèques</label>
        <input
          type="text"
          id="midi-checks"
          inputmode="decimal"
          placeholder="0,00"
        />
      </div>



      <div class="midi-mypos">
        <label for="midi-mypos-amount">MyPos — paiement suivant</label>
        <div class="midi-mypos-row">
          <input
            type="text"
            id="midi-mypos-amount"
            inputmode="decimal"
            placeholder="Montant"
          />



          <button type="button" id="midi-mypos-add-button">
            Ajouter
          </button>
        </div>



        <ul id="midi-mypos-list" class="payment-list"></ul>



        <div class="recap-line">
          <span>Total MyPos</span>
          <strong id="midi-mypos-total">0,00 €</strong>
        </div>
      </div>



      <div class="midi-vat-row">
        <div class="midi-field">
          <label for="midi-vat-5-5">TVA 5,5</label>
          <input
            type="text"
            id="midi-vat-5-5"
            inputmode="decimal"
            placeholder="0,00"
          />
        </div>



        <div class="midi-field">
          <label for="midi-vat-10">TVA 10</label>
          <input
            type="text"
            id="midi-vat-10"
            inputmode="decimal"
            placeholder="0,00"
          />
        </div>



        <div class="midi-field">
          <label for="midi-vat-20">TVA 20</label>
          <input
            type="text"
            id="midi-vat-20"
            inputmode="decimal"
            placeholder="0,00"
          />
        </div>
      </div>



      <div class="midi-field">
        <label for="midi-pizzas-takeaway">Emporter</label>
        <input
          type="number"
          id="midi-pizzas-takeaway"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="0"
        />
      </div>



      <div class="midi-field">
        <label for="midi-pizzas-dine-in">Couverts</label>
        <input
          type="number"
          id="midi-pizzas-dine-in"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="0"
        />
      </div>
    </div>



    <p id="midi-form-message" class="form-message" role="status"></p>



    <button type="submit" id="midi-validate-button" class="midi-validate">
      Validation
    </button>
  </form>
`;