/**
 * Fichier : js/features/soir/pages/ancvPage.js
 * Rôle : logique de la page ANCV du service Soir.
 *
 * Cette page gère les ANCV papier :
 * - sélection de la valeur (10, 20, 25 ou 50 €) ;
 * - saisie du nombre de titres dans un input commun ;
 * - ajout des saisies dans une liste ;
 * - suppression d’une ligne de la liste ;
 * - nombre total d'ANCV affiché en bas ;
 * - total général affiché dans le titre de page :
 *   « ANCV — X,XX € » (géré par soirController.js).
 *
 * Les éléments de total et de comptage peuvent être recréés par le
 * contrôleur à chaque affichage : ils sont donc recherchés dynamiquement.
 *
 * La valeur sélectionnée et les titres ajoutés sont conservés
 * localement afin de survivre à un rafraîchissement accidentel.
 */

import { formatEuro } from '../../../utils/format.js';
import { getQuantityFromInput } from '../../../utils/amounts.js';
import {
  restoreFormDraft,
  saveFormDraft,
  saveDraftSection,
  getDraftSection,
  setupDraftAutosave,
} from '../../../utils/draftStorage.js';
import { ancvPageTemplate } from './templates/ancvPageTemplate.js';

export function initAncvPage(container) {
  container.innerHTML = ancvPageTemplate;

  const formElement = document.getElementById('soir-ancv-form');

  const valueButtons = Array.from(
    formElement.querySelectorAll('.soir-ancv-value-button'),
  );

  const nbInput = document.getElementById('soir-ancv-nb');
  const addButton = document.getElementById('soir-ancv-add');
  const listElement = document.getElementById('soir-ancv-list');

  // Restaure la valeur sélectionnée et les titres déjà ajoutés.
  const savedSelectedValue = getDraftSection('soir-ancv-selected-value');
  const savedEntries = getDraftSection('soir-ancv-entries');

  let selectedValue =
    typeof savedSelectedValue === 'number' ? savedSelectedValue : 10;

  const entries = Array.isArray(savedEntries)
    ? savedEntries.filter(
        (entry) =>
          entry &&
          Number.isFinite(Number(entry.value)) &&
          Number.isFinite(Number(entry.quantity)) &&
          Number(entry.value) > 0 &&
          Number(entry.quantity) > 0,
      )
    : [];

  // Restaure également les éventuels champs simples du formulaire.
  restoreFormDraft(formElement);

  // Le total général peut être recréé par le contrôleur :
  // il est donc recherché à chaque mise à jour.
  function getGrandTotalElement() {
    return document.getElementById('soir-ancv-grand-total');
  }

  // Le compteur peut également être recréé par le contrôleur.
  function getCountElement() {
    return document.getElementById('soir-ancv-count');
  }

  function updateTotals() {
    const grandTotal = entries.reduce(
      (sum, entry) => sum + entry.value * entry.quantity,
      0,
    );

    const totalCount = entries.reduce(
      (sum, entry) => sum + entry.quantity,
      0,
    );

    const grandTotalElement = getGrandTotalElement();

    if (grandTotalElement) {
      grandTotalElement.textContent = formatEuro(grandTotal);
    }

    const countElement = getCountElement();

    if (countElement) {
      countElement.textContent = String(totalCount);
    }
  }

  function renderList() {
    listElement.innerHTML = '';

    entries.forEach((entry, index) => {
      const item = document.createElement('li');

      const text = document.createElement('span');
      text.textContent =
        entry.quantity + ' × ' + entry.value + ' € — ' +
        formatEuro(entry.value * entry.quantity);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'payment-remove-button';
      removeButton.textContent = 'Supprimer';

      removeButton.addEventListener('click', () => {
        removeEntry(index);
      });

      item.append(text, removeButton);
      listElement.appendChild(item);
    });
  }

  /**
   * Enregistre la valeur sélectionnée et les titres ajoutés.
   *
   * Cette fonction est appelée avant la mise à jour de l’affichage :
   * un problème d’affichage ne doit jamais empêcher la sauvegarde.
   *
   * @returns {void}
   */
  function saveDraft() {
    saveDraftSection('soir-ancv-selected-value', selectedValue);
    saveDraftSection('soir-ancv-entries', entries);
  }

  /**
   * Met en évidence le bouton correspondant à la valeur sélectionnée.
   *
   * @returns {void}
   */
  function renderSelectedValue() {
    valueButtons.forEach((button) => {
      const buttonValue = Number(button.dataset.ancvValue);

      button.classList.toggle('is-active', buttonValue === selectedValue);
    });
  }

  /**
   * Supprime une ligne d’ANCV papier.
   *
   * @param {number} index - Position de la ligne dans la liste.
   * @returns {void}
   */
  function removeEntry(index) {
    if (index < 0 || index >= entries.length) {
      return;
    }

    entries.splice(index, 1);

    saveDraft();
    renderList();
    updateTotals();
  }

  function addEntry() {
    const quantity = getQuantityFromInput(nbInput);

    if (quantity <= 0) {
      return;
    }

    // Si une entrée existe déjà pour cette valeur,
    // on ajoute la quantité à celle-ci au lieu de créer une nouvelle ligne.
    const existingEntry = entries.find(
      (entry) => entry.value === selectedValue,
    );

    if (existingEntry) {
      existingEntry.quantity += quantity;
    } else {
      entries.push({
        value: selectedValue,
        quantity: quantity,
      });
    }

    // Le brouillon est mis à jour avant toute action d’affichage.
    saveDraft();

    nbInput.value = '0';

    // La remise à zéro de l’input doit aussi être enregistrée :
    // sinon, après rafraîchissement, l’ancienne quantité revient.
    saveFormDraft(formElement);

    renderList();
    updateTotals();
    nbInput.focus();
  }

  valueButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedValue = Number(button.dataset.ancvValue);

      saveDraft();
      renderSelectedValue();
      nbInput.focus();
    });
  });

  addButton.addEventListener('click', addEntry);

  nbInput.addEventListener('focus', () => {
    if (nbInput.value === '0') {
      nbInput.value = '';
    }
  });

  nbInput.addEventListener('blur', () => {
    if (nbInput.value === '') {
      nbInput.value = '0';
    }
  });

  // La touche →| du clavier téléphone ajoute la saisie.
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  formElement.addEventListener('keydown', (event) => {
    const isNavigationKey =
      event.key === 'Enter' ||
      event.key === 'Tab' ||
      event.key === 'Go' ||
      event.keyCode === 13 ||
      event.keyCode === 9;

    if (!isNavigationKey) {
      return;
    }

    if (event.target !== nbInput) {
      return;
    }

    event.preventDefault();
    addEntry();
  });

  // Sauvegarde automatique des champs simples du formulaire.
  setupDraftAutosave(formElement);

  // Restaure l’affichage initial : valeur choisie, liste et totaux.
  renderSelectedValue();
  renderList();
  updateTotals();
}