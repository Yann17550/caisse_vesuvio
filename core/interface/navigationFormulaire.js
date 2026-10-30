/**
 * Fichier : core/interface/navigationFormulaire.js
 * Rôle : gérer la navigation au clavier dans les formulaires.
 *
 * Ces fonctions permettent de passer au champ suivant avec la touche
 * Entrée, comme avec la touche Tab, sans modifier le comportement
 * des boutons.
 *
 * Elles ne contiennent aucune règle métier de clôture
 * et aucun accès à Supabase.
 */

/**
 * Ajoute la navigation par Entrée dans un formulaire.
 *
 * Lorsque l’utilisateur appuie sur Entrée dans un champ texte,
 * le focus passe au champ suivant.
 *
 * @param {HTMLFormElement|null} formulaire - Formulaire concerné.
 */
export function ajouterNavigationEntree(formulaire) {
  if (!formulaire) {
    return;
  }

  formulaire.addEventListener('keydown', (evenement) => {
    if (evenement.key !== 'Enter') {
      return;
    }

    const champActif = evenement.target;

    if (!champActif || champActif.tagName !== 'INPUT') {
      return;
    }

    if (champActif.type === 'submit' || champActif.type === 'button') {
      return;
    }

    evenement.preventDefault();

    const champs = Array.from(
      formulaire.querySelectorAll(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])',
      ),
    );

    const indexActuel = champs.indexOf(champActif);

    if (indexActuel === -1) {
      return;
    }

    const champSuivant = champs[indexActuel + 1];

    if (champSuivant) {
      champSuivant.focus();
    }
  });
}

/**
 * Donne le focus au premier champ d’un formulaire.
 *
 * @param {HTMLFormElement|null} formulaire - Formulaire concerné.
 */
export function focusPremierChamp(formulaire) {
  if (!formulaire) {
    return;
  }

  const premierChamp = formulaire.querySelector(
    'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])',
  );

  if (premierChamp) {
    premierChamp.focus();
  }
}