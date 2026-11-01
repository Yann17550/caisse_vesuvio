/**
 * Fichier : clotures-vesuvio/soir/templates/pageANCVTemplate.js
 * Rôle : fournir la structure HTML de la page ANCV papier du Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique JavaScript.
 */

export const pageAncvTemplate = `
  <form id="soir-ancv-form" class="card" novalidate>
    <div class="soir-ancv-values">
      <button type="button" class="soir-ancv-value-button is-active" data-ancv-value="10">10 €</button>
      <button type="button" class="soir-ancv-value-button" data-ancv-value="20">20 €</button>
      <button type="button" class="soir-ancv-value-button" data-ancv-value="25">25 €</button>
      <button type="button" class="soir-ancv-value-button" data-ancv-value="50">50 €</button>
    </div>

    <div class="soir-ancv-entry">
      <input
        type="text"
        id="soir-ancv-nb"
        inputmode="numeric"
        maxlength="2"
        enterkeyhint="next"
        value="0"
        aria-label="Nombre d'ANCV"
      />

      <button type="button" id="soir-ancv-add" class="button">Ajouter</button>
    </div>

    <ul id="soir-ancv-list"></ul>

    <div class="recap-line">
      <span>Nombre d'ANCV</span>
      <strong id="soir-ancv-count-value">0</strong>
    </div>

    <span id="soir-ancv-paper-total-value" class="hidden-value" aria-hidden="true">0,00 €</span>
    <span id="soir-ancv-nb-10" class="hidden-value" aria-hidden="true">0</span>
    <span id="soir-ancv-nb-20" class="hidden-value" aria-hidden="true">0</span>
    <span id="soir-ancv-nb-25" class="hidden-value" aria-hidden="true">0</span>
    <span id="soir-ancv-nb-50" class="hidden-value" aria-hidden="true">0</span>
  </form>
`;