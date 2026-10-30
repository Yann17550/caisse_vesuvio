/**
 * Fichier : core/interface/comportementChampTexte.js
 * Rôle : gérer le comportement réutilisable des champs texte.
 *
 * Ces fonctions permettent d’effacer la valeur d’un champ au focus
 * lorsqu’elle correspond à une valeur par défaut, puis de la
 * restaurer au blur si l’utilisateur n’a rien saisi.
 *
 * Elles ne contiennent aucune règle métier de clôture
 * et aucun accès à Supabase.
 */

/**
 * Ajoute le comportement « effacer au focus, restaurer au blur »
 * à un champ texte.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|null} champ - Champ concerné.
 * @param {string} valeurParDefaut - Valeur affichée par défaut.
 */
export function ajouterComportementEffacerRestaurer(champ, valeurParDefaut) {
  if (!champ) {
    return;
  }

  champ.addEventListener('focus', () => {
    if (champ.value === valeurParDefaut) {
      champ.value = '';
    }
  });

  champ.addEventListener('blur', () => {
    if (champ.value.trim() === '') {
      champ.value = valeurParDefaut;
    }
  });
}

/**
 * Applique le comportement à plusieurs champs.
 *
 * @param {NodeList|Array} champs - Liste de champs concernés.
 * @param {string} valeurParDefaut - Valeur affichée par défaut.
 */
export function appliquerComportementAuxChamps(champs, valeurParDefaut) {
  if (!champs) {
    return;
  }

  champs.forEach((champ) => {
    ajouterComportementEffacerRestaurer(champ, valeurParDefaut);
  });
}

/**
 * Réinitialise un champ avec sa valeur par défaut.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement|null} champ - Champ concerné.
 * @param {string} valeurParDefaut - Valeur par défaut à restaurer.
 */
export function reinitialiserChampTexte(champ, valeurParDefaut) {
  if (!champ) {
    return;
  }

  champ.value = valeurParDefaut;
}
