/**
 * Fichier : js/features/soir/soirTemplate.js
 * Rôle : fournir la structure HTML du service Soir.
 *
 * Ce fichier ne contient aucune logique JavaScript,
 * aucune lecture de données et aucun accès au DOM.
 *
 * Les pages CB, Espèces, ANCV, Chèques et Récapitulatif
 * seront injectées dans leurs conteneurs respectifs.
 */


export const soirTemplate = `
  <h2 id="soir-page-title">CB</h2>

  <nav class="soir-navigation" aria-label="Pages du service Soir">
    <button
      type="button"
      class="soir-nav-button is-active"
      data-soir-page="card"
    >
      CB
    </button>

    <button
      type="button"
      class="soir-nav-button"
      data-soir-page="cash"
    >
      Espèces
    </button>

    <button
      type="button"
      class="soir-nav-button"
      data-soir-page="ancv"
    >
      ANCV
    </button>

    <button
      type="button"
      class="soir-nav-button"
      data-soir-page="checks"
    >
      Chèques
    </button>

    <button
      type="button"
      class="soir-nav-button"
      data-soir-page="recap"
    >
      Récap
    </button>
  </nav>

  <div id="soir-pages" class="soir-pages">
    <section
      id="soir-card-page"
      class="soir-page"
      data-soir-page="card"
    ></section>

    <section
      id="soir-cash-page"
      class="soir-page is-hidden"
      data-soir-page="cash"
    ></section>

    <section
      id="soir-ancv-page"
      class="soir-page is-hidden"
      data-soir-page="ancv"
    ></section>

    <section
      id="soir-checks-page"
      class="soir-page is-hidden"
      data-soir-page="checks"
    ></section>

    <section
      id="soir-recap-page"
      class="soir-page is-hidden"
      data-soir-page="recap"
    ></section>
  </div>
`;