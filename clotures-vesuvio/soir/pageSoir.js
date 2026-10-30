/**
 * Fichier : clotures-vesuvio/soir/pageSoir.js
 * Rôle : orchestrer les cinq pages du service Soir.
 *
 * Reprend la navigation et les couleurs de l’ancien Soir,
 * puis branche le bouton Valider à clotureSoir.js.
 */

import { initialiserPageCB } from './pageCB.js';
import { initialiserPageEspeces } from './pageEspeces.js';
import { initialiserPageANCV } from './pageANCV.js';
import { initialiserPageCheques } from './pageCheques.js';
import { initialiserPageRecapitulatif } from './pageRecapitulatif.js';

import {
  validerEtEnregistrerSoir,
} from './clotureSoir.js';

const PAGES = [
  { id: 'cartes', libelle: 'CB' },
  { id: 'especes', libelle: 'Espèces' },
  { id: 'ancv', libelle: 'ANCV' },
  { id: 'cheques', libelle: 'Chèques' },
  { id: 'recapitulatif', libelle: 'Récap' },
];

/**
 * Génère la navigation du Soir.
 *
 * @returns {string} HTML de navigation.
 */
function genererNavigation() {
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
 * Génère les conteneurs de pages.
 *
 * @returns {string} HTML des conteneurs.
 */
function genererConteneurs() {
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
 * Affiche une page du Soir.
 *
 * @param {HTMLElement} conteneur - Conteneur du Soir.
 * @param {string} page - Identifiant de la page.
 */
function afficherPage(conteneur, page) {
  conteneur
    .querySelectorAll('.soir-page')
    .forEach((section) => {
      section.classList.toggle(
        'is-hidden',
        section.dataset.soirPage !== page,
      );
    });

  conteneur
    .querySelectorAll('.soir-nav-button')
    .forEach((bouton) => {
      bouton.classList.toggle(
        'is-active',
        bouton.dataset.soirPage === page,
      );
    });

  const pageTrouvee = PAGES.find(
    (pageDefinition) => pageDefinition.id === page,
  );

  const titre = conteneur.querySelector('#soir-titre-page');

  if (titre && pageTrouvee) {
    titre.textContent = pageTrouvee.libelle;
  }
}

/**
 * Initialise le service Soir.
 *
 * @param {Object} parametres - Paramètres.
 * @param {HTMLElement} parametres.conteneur - Conteneur du Soir.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 */
export function initialiserPageSoir({ conteneur, etablissementId }) {
  conteneur.innerHTML = `
    <h2 id="soir-titre-page">CB</h2>
    ${genererNavigation()}
    ${genererConteneurs()}
  `;

  const pageCartes = conteneur.querySelector('#soir-page-cartes');
  const pageEspeces = conteneur.querySelector('#soir-page-especes');
  const pageAncv = conteneur.querySelector('#soir-page-ancv');
  const pageCheques = conteneur.querySelector('#soir-page-cheques');
  const pageRecap = conteneur.querySelector('#soir-page-recapitulatif');

  initialiserPageCB(pageCartes);
  initialiserPageEspeces(pageEspeces);
  initialiserPageANCV(pageAncv);
  initialiserPageCheques(pageCheques);

  initialiserPageRecapitulatif(pageRecap, {
    onValider: async ({ totaux }) => {
      const message = pageRecap.querySelector('#soir-recap-message');

      message.textContent = 'Enregistrement du Soir en cours…';
      message.classList.remove('is-error');
      message.classList.add('is-success');

      try {
        const resultat = await validerEtEnregistrerSoir({
          totaux,
          etablissementId,
        });

        if (!resultat.succes) {
          message.textContent = resultat.message;
          message.classList.add('is-error');
          message.classList.remove('is-success');
          return;
        }

        message.textContent = resultat.message;
        message.classList.add('is-success');
        message.classList.remove('is-error');

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (erreur) {
        message.textContent = erreur.message;
        message.classList.add('is-error');
        message.classList.remove('is-success');
      }
    },
  });

  conteneur
    .querySelectorAll('.soir-nav-button')
    .forEach((bouton) => {
      bouton.addEventListener('click', () => {
        afficherPage(conteneur, bouton.dataset.soirPage);
      });
    });

  afficherPage(conteneur, 'cartes');
}