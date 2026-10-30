/**
 * Fichier : core/interface/affichageLignesNonNulles.js
 * Rôle : masquer ou afficher les lignes selon leur valeur.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture.
 */

/**
 * Masque une ligne si sa valeur est nulle ou vide.
 *
 * @param {HTMLElement|null} ligne - Ligne à contrôler.
 * @param {string|number|null} valeur - Valeur associée à la ligne.
 */
export function masquerLigneSiNulle(ligne, valeur) {
  if (!ligne) {
    return;
  }

  const valeurNumerique = Number(valeur);

  const estNulle =
    valeur === null ||
    valeur === undefined ||
    valeur === '' ||
    !Number.isFinite(valeurNumerique) ||
    valeurNumerique === 0;

  ligne.classList.toggle('ligne-masquee', estNulle);
}

/**
 * Applique le masquage à plusieurs lignes.
 *
 * @param {NodeList|Array} lignes - Lignes à contrôler.
 * @param {Array<string|number|null>} valeurs - Valeurs associées.
 */
export function masquerLignesSiNulles(lignes, valeurs) {
  if (!lignes || !valeurs) {
    return;
  }

  lignes.forEach((ligne, index) => {
    masquerLigneSiNulle(ligne, valeurs[index]);
  });
}

/**
 * Affiche toutes les lignes d’un conteneur.
 *
 * @param {HTMLElement|null} conteneur - Conteneur des lignes.
 */
export function afficherToutesLesLignes(conteneur) {
  if (!conteneur) {
    return;
  }

  const lignes = conteneur.querySelectorAll('.ligne-masquee');

  lignes.forEach((ligne) => {
    ligne.classList.remove('ligne-masquee');
  });
}