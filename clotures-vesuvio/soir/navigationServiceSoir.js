/**
 * Fichier : clotures-vesuvio/soir/navigationServiceSoir.js
 * Rôle : gérer la navigation entre les pages du Soir.
 *
 * Ce module ne contient aucune règle métier de validation.
 * Il délègue le contrôle de sortie de page à un garde fourni.
 */

import {
  obtenirElementsSoir,
  afficherPageSoir,
  obtenirPageActive,
} from './vueSoir.js';

/**
 * Initialise la navigation du Soir.
 *
 * @param {Object} parametres - Paramètres.
 * @param {Function} parametres.gardeSortie - Fonction appelée avant de quitter une page.
 */
export function initialiserNavigationSoir({ gardeSortie }) {
  const elements = obtenirElementsSoir();

  elements.boutonsNavigation.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const pageCible = bouton.dataset.soirPage;
      const pageActuelle = obtenirPageActive();

      if (pageCible === pageActuelle) {
        return;
      }

      if (gardeSortie) {
        const autorise = gardeSortie({
          pageDepart: pageActuelle,
          pageArrivee: pageCible,
        });

        if (!autorise) {
          return;
        }
      }

      afficherPageSoir(pageCible);
    });
  });
}