/**
 * Fichier : clotures-vesuvio/soir/modeleVueSoir.js
 * Rôle : décrire la structure HTML du service Soir.
 *
 * Ce module ne manipule pas le DOM.
 */

const PAGES = [
  { id: 'cartes', libelle: 'CB' },
  { id: 'especes', libelle: 'Espèces' },
  { id: 'ancv', libelle: 'ANCV' },
  { id: 'cheques', libelle: 'Chèques' },
  { id: 'recapitulatif', libelle: 'Récap' },
];

/**
 * Retourne la liste des pages du Soir.
 *
 * @returns {Array} Pages disponibles.
 */
export function obtenirPagesSoir() {
  return PAGES;
}

/**
 * Génère la navigation du Soir.
 *
 * @returns {string} HTML de navigation.
 */
export function genererNavigationSoir() {
  const boutons = PAGES.map((page, index) => `
    <button
      type="button"
      class="soir-nav-button${index === 0 ? ' is-active' : ''}"
      data-soir-page="${page.id}"
    >
      ${page.libelle}
    </button>
  `).join('');

  return `
    <nav class="soir-navigation" aria-label="Pages du service Soir">
      ${boutons}
    </nav>
  `;
}

/**
 * Génère les conteneurs des pages du Soir.
 *
 * @returns {string} HTML des conteneurs.
 */
export function genererConteneursPages() {
  const sections = PAGES.map((page, index) => `
    <section
      id="soir-page-${page.id}"
      class="soir-page${index === 0 ? '' : ' is-hidden'}"
      data-soir-page="${page.id}"
    ></section>
  `).join('');

  return `<div id="soir-pages" class="soir-pages">${sections}</div>`;
}

/**
 * Génère la structure complète du Soir.
 *
 * @returns {string} HTML du Soir.
 */
export function genererStructureSoir() {
  return `
    <h2 id="soir-titre-page">CB</h2>
    ${genererNavigationSoir()}
    ${genererConteneursPages()}
  `;
}