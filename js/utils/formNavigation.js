/**
 * Fichier : js/utils/formNavigation.js
 * Rôle : permettre à la touche Entrée de passer au champ suivant.
 *
 * Cet utilitaire est partagé par :
 * - le service Midi ;
 * - le service Soir.
 */

export function setupEnterNavigation(formElement, excludedInput) {
  formElement.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    const target = event.target;

    if (target === excludedInput) {
      return;
    }

    if (target.tagName !== 'INPUT') {
      return;
    }

    event.preventDefault();

    const inputs = Array.from(
      formElement.querySelectorAll('input:not([disabled])'),
    );

    const currentIndex = inputs.indexOf(target);

    if (currentIndex === -1) {
      return;
    }

    const nextInput = inputs[currentIndex + 1];

    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  });
}