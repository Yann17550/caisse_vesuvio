/**
 * Fichier : js/features/soir/pages/templates/ancvPageTemplate.js
 * Rôle : template HTML de la page ANCV du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 * Le total général est affiché dans le titre de page (h2),
 * géré par soirController.js.
 */

export const ancvPageTemplate = `
  <form id="soir-ancv-form" class="card" novalidate>
    <div class="soir-ancv-values">
      <button
        type="button"
        class="soir-ancv-value-button is-active"
        data-ancv-value="10"
      >
        10 €
      </button>

      <button
        type="button"
        class="soir-ancv-value-button"
        data-ancv-value="20"
      >
        20 €
      </button>

      <button
        type="button"
        class="soir-ancv-value-button"
        data-ancv-value="25"
      >
        25 €
      </button>

      <button
        type="button"
        class="soir-ancv-value-button"
        data-ancv-value="50"
      >
        50 €
      </button>
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

      <button
        type="button"
        id="soir-ancv-add"
        class="button"
      >
        Ajouter
      </button>
    </div>

    <ul id="soir-ancv-list"></ul>

    <div class="recap-line">
      <span>Nombre d'ANCV</span>
      <strong id="soir-ancv-total-value" hidden>0,00 €</strong>
    </div>
  </form>
`;