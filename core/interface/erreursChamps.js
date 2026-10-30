/**
 * Fichier : core/interface/erreursChamps.js
 * Rôle : afficher et effacer les erreurs associées aux champs.
 *
 * Ces fonctions sont réutilisables par toutes les applications.
 * Elles ne contiennent aucune règle métier de clôture
 * et aucun accès à Supabase.
 */

/**
 * Affiche un message d’erreur sous un champ.
 *
 * @param {HTMLElement|null} champ - Champ concerné par l’erreur.
 * @param {string|null} message - Message d’erreur à afficher.
 */
export function afficherErreurChamp(champ, message) {
  if (!champ) {
    return;
  }

  effacerErreurChamp(champ);

  if (!message) {
    return;
  }

  const conteneur = champ.closest('.champ-formulaire');

  if (!conteneur) {
    return;
  }

  const elementErreur = document.createElement('p');

  elementErreur.className = 'erreur-champ';
  elementErreur.textContent = message;

  conteneur.appendChild(elementErreur);
  champ.classList.add('champ-invalide');
}

/**
 * Efface le message d’erreur associé à un champ.
 *
 * @param {HTMLElement|null} champ - Champ concerné.
 */
export function effacerErreurChamp(champ) {
  if (!champ) {
    return;
  }

  const conteneur = champ.closest('.champ-formulaire');

  if (conteneur) {
    const erreurExistante = conteneur.querySelector('.erreur-champ');

    if (erreurExistante) {
      erreurExistante.remove();
    }
  }

  champ.classList.remove('champ-invalide');
}

/**
 * Efface les erreurs de tous les champs d’un formulaire.
 *
 * @param {HTMLFormElement|null} formulaire - Formulaire concerné.
 */
export function effacerErreursFormulaire(formulaire) {
  if (!formulaire) {
    return;
  }

  const champs = formulaire.querySelectorAll('input, select, textarea');

  champs.forEach((champ) => {
    effacerErreurChamp(champ);
  });
}