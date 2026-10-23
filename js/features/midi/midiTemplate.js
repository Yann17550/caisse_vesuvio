/**
 * Fichier : js/features/midi/midiTemplate.js
 * Rôle : fournir la structure HTML du service Midi.
 *
 * Ce fichier ne contient aucune logique JavaScript,
 * aucune lecture de données et aucun accès au DOM.
 */

export const midiTemplate = `
  <h2>Service Midi</h2>

  <form id="midi-form" class="card" novalidate>
    <fieldset>
      <legend>Carte bancaire</legend>

      <div class="form-field">
        <label for="midi-mypos-amount">MyPos — paiement suivant</label>
        <input
          type="text"
          id="midi-mypos-amount"
          inputmode="decimal"
          placeholder="Montant du paiement"
        />

        <button type="button" id="midi-mypos-add-button">
          Ajouter le paiement
        </button>
      </div>

      <ul id="midi-mypos-list" class="payment-list"></ul>

      <div class="recap-line">
        <span>Total MyPos</span>
        <strong id="midi-mypos-total">0,00 €</strong>
      </div>

      <div class="form-field">
        <label for="midi-cb-classic">CB classique</label>
        <input
          type="text"
          id="midi-cb-classic"
          inputmode="decimal"
          placeholder="Montant total"
        />
      </div>

      <div class="form-field">
        <label for="midi-cb-ticket-resto">CB Ticket Restaurant</label>
        <input
          type="text"
          id="midi-cb-ticket-resto"
          inputmode="decimal"
          placeholder="Montant total"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Espèces et titres</legend>

      <div class="form-field">
        <label for="midi-cash-adipos">Espèces Adipos</label>
        <input
          type="text"
          id="midi-cash-adipos"
          inputmode="decimal"
          placeholder="Montant total"
        />
      </div>

      <div class="form-field">
        <label for="midi-ancv-paper">ANCV papier</label>
        <input
          type="text"
          id="midi-ancv-paper"
          inputmode="decimal"
          placeholder="Montant total"
        />
      </div>

      <div class="form-field">
        <label for="midi-ancv-connect">ANCV dématérialisé</label>
        <input
          type="text"
          id="midi-ancv-connect"
          inputmode="decimal"
          placeholder="Montant total"
        />
      </div>

      <div class="form-field">
        <label for="midi-checks">Chèques</label>
        <input
          type="text"
          id="midi-checks"
          inputmode="decimal"
          placeholder="Montant total"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>TVA</legend>

      <div class="form-field">
        <label for="midi-vat-5-5">TVA 5,5 %</label>
        <input
          type="text"
          id="midi-vat-5-5"
          inputmode="decimal"
          placeholder="Montant TTC"
        />
      </div>

      <div class="form-field">
        <label for="midi-vat-10">TVA 10 %</label>
        <input
          type="text"
          id="midi-vat-10"
          inputmode="decimal"
          placeholder="Montant TTC"
        />
      </div>

      <div class="form-field">
        <label for="midi-vat-20">TVA 20 %</label>
        <input
          type="text"
          id="midi-vat-20"
          inputmode="decimal"
          placeholder="Montant TTC"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Pizzas</legend>

      <div class="form-field">
        <label for="midi-pizzas-dine-in">Pizzas sur place</label>
        <input
          type="number"
          id="midi-pizzas-dine-in"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="Nombre"
        />
      </div>

      <div class="form-field">
        <label for="midi-pizzas-takeaway">Pizzas à emporter</label>
        <input
          type="number"
          id="midi-pizzas-takeaway"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="Nombre"
        />
      </div>
    </fieldset>

    <section class="recap-section">
      <h3>Récapitulatif Midi</h3>

      <dl class="recap-list">
        <div>
          <dt>CB MyPos</dt>
          <dd id="recap-midi-mypos">0,00 €</dd>
        </div>

        <div>
          <dt>CB classique</dt>
          <dd id="recap-midi-cb-classic">0,00 €</dd>
        </div>

        <div>
          <dt>CB Ticket Restaurant</dt>
          <dd id="recap-midi-cb-ticket-resto">0,00 €</dd>
        </div>

        <div>
          <dt>Espèces Adipos</dt>
          <dd id="recap-midi-cash-adipos">0,00 €</dd>
        </div>

        <div>
          <dt>ANCV papier</dt>
          <dd id="recap-midi-ancv-paper">0,00 €</dd>
        </div>

        <div>
          <dt>ANCV dématérialisé</dt>
          <dd id="recap-midi-ancv-connect">0,00 €</dd>
        </div>

        <div>
          <dt>Chèques</dt>
          <dd id="recap-midi-checks">0,00 €</dd>
        </div>

        <div>
          <dt>TVA 5,5 %</dt>
          <dd id="recap-midi-vat-5-5">0,00 €</dd>
        </div>

        <div>
          <dt>TVA 10 %</dt>
          <dd id="recap-midi-vat-10">0,00 €</dd>
        </div>

        <div>
          <dt>TVA 20 %</dt>
          <dd id="recap-midi-vat-20">0,00 €</dd>
        </div>

        <div>
          <dt>Pizzas sur place</dt>
          <dd id="recap-midi-pizzas-dine-in">0</dd>
        </div>

        <div>
          <dt>Pizzas à emporter</dt>
          <dd id="recap-midi-pizzas-takeaway">0</dd>
        </div>
      </dl>

      <p id="midi-form-message" class="form-message" role="status"></p>

      <div class="form-actions">
        <button type="button" id="midi-modify-button">
          Modification
        </button>

        <button type="submit" id="midi-validate-button">
          Validation
        </button>
      </div>
    </section>
  </form>
`;