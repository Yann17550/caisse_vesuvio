/**
 * Fichier : core/interface/remiseAZeroFormulaire.js
 * Rôle : réinitialiser les champs d’un formulaire après une validation réussie.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture
 * et aucun accès à Supabase.
 */

/**
 * Réinitialise un champ texte avec une valeur par défaut.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|null} champ - Champ à réinitialiser.
 * @param {string} [valeurParDefaut=''] - Valeur à restaurer.
 */
export function reinitialiserChampTexte(champ, valeurParDefaut = '') {
  if (!champ) {
    return;
  }

  champ.value = valeurParDefaut;
}

/**
 * Réinitialise un champ numérique avec une valeur par défaut.
 *
 * @param {HTMLInputElement|null} champ - Champ à réinitialiser.
 * @param {string|number} [valeurParDefaut=''] - Valeur à restaurer.
 */
export function reinitialiserChampNumerique(champ, valeurParDefaut = '') {
  if (!champ) {
    return;
  }

  champ.value = valeurParDefaut;
}

/**
 * Réinitialise tous les champs d’un formulaire.
 *
 * Les champs `hidden`, `submit` et `button` ne sont pas modifiés.
 *
 * @param {HTMLFormElement|null} formulaire - Formulaire à réinitialiser.
 * @param {string|number} [valeurParDefaut=''] - Valeur à restaurer.
 */
export function reinitialiserFormulaire(formulaire, valeurParDefaut = '') {
  if (!formulaire) {
    return;
  }

  const champs = formulaire.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea',
  );

  champs.forEach((champ) => {
    champ.value = valeurParDefaut;
  });
}

/**
 * Réinitialise un formulaire et efface ses erreurs.
 *
 * @param {HTMLFormElement|null} formulaire - Formulaire à réinitialiser.
 * @param {string|number} [valeurParDefaut=''] - Valeur à restaurer.
 */
export function reinitialiserFormulaireAvecErreurs(
  formulaire,
  valeurParDefaut = '',
) {
  if (!formulaire) {
    return;
  }

  reinitialiserFormulaire(formulaire, valeurParDefaut);

  const champs = formulaire.querySelectorAll('input, select, textarea');

  champs.forEach((champ) => {
    champ.classList.remove('input-error');
    champ.classList.remove('champ-invalide');

    const conteneur = champ.closest('.champ-formulaire');

    if (conteneur) {
      const erreur = conteneur.querySelector('.erreur-champ');

      if (erreur) {
        erreur.remove();
      }
    }

    const erreurAdjacente = champ.nextElementSibling;

    if (
      erreurAdjacente &&
      erreurAdjacente.classList.contains('field-error')
    ) {
      erreurAdjacente.remove();
    }
  });
}