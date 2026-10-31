/**
 * Fichier : clotures-vesuvio/midi/recapMidi.js
 * Rôle : messages et affichage du récapitulatif minimal du Midi.
 *
 * Comme dans l’ancienne version, le Midi n’affiche pas
 * de récapitulatif détaillé : la saisie est directe.
 */

/**
 * Affiche un message dans le formulaire Midi.
 *
 * @param {string} texte - Message à afficher.
 * @param {'info'|'succes'|'erreur'} type - Type de message.
 */
export function afficherMessageMidi(texte, type = 'info') {
  const element = document.getElementById('midi-form-message');

  if (!element) {
    return;
  }

  element.textContent = texte;
  element.className = `form-message form-message-${type}`;
}

/**
 * Efface le message du formulaire Midi.
 */
export function effacerMessageMidi() {
  const element = document.getElementById('midi-form-message');

  if (!element) {
    return;
  }

  element.textContent = '';
  element.className = 'form-message';
}