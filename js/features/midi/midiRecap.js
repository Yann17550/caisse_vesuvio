/**
 * Fichier : js/features/midi/midiRecap.js
 * Rôle : afficher le récapitulatif du service Midi.
 *
 * Seules les valeurs supérieures à zéro sont affichées.
 *
 * Chaque entrée associe :
 * - un élément du DOM ;
 * - la clé correspondante dans les données validées ;
 * - le type d’affichage.
 */

import { formatEuro, formatInteger } from '../../utils/format.js';

export function createMidiRecap(recapItems) {
  function update(data) {
    recapItems.forEach((item) => {
      const value = data[item.dataKey];
      const isVisible = Number(value) > 0;

      const row = item.element.closest('.recap-list > div');

      if (row) {
        row.classList.toggle('is-hidden', !isVisible);
      }

      if (!isVisible) {
        return;
      }

      item.element.textContent = item.type === 'integer'
        ? formatInteger(value)
        : formatEuro(value);
    });
  }

  return {
    update,
  };
}