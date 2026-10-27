/**
 * Fichier : js/features/soir/pages/ancvPage.js
 * Rôle : logique de la page ANCV du service Soir.
 *
 * Cette page gère les ANCV papier :
 * - sélection de la valeur (10, 20, 25 ou 50 €) ;
 * - saisie du nombre de titres dans un input commun ;
 * - ajout des saisies dans une liste ;
 * - nombre total d'ANCV affiché en bas ;
 * - total général affiché dans le titre de page :
 *   « ANCV — X,XX € » (géré par soirController.js).
 *
 * Au focus, le 0 par défaut s'efface ; au blur, s'il est vide,
 * le 0 revient.
 *
 * La touche →| du clavier téléphone ajoute la saisie à la liste.
 */

import { formatEuro } from '../../../utils/format.js';
import { getQuantityFromInput } from '../../../utils/amounts.js';
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
  const countElement = document.getElementById('soir-ancv-count');

  let selectedValue = 10;
  const entries = [];

  function getGrandTotalElement() {
    return document.getElementById('soir-ancv-grand-total');
  }

  function updateTotals() {
    const grandTotalElement = getGrandTotalElement();

    if (!grandTotalElement) {
      return;
    }

    const grandTotal = entries.reduce(
      (sum, entry) => sum + entry.value * entry.quantity,
      0,
    );

    const totalCount = entries.reduce(
      (sum, entry) => sum + entry.quantity,
      0,
    );

    grandTotalElement.textContent = formatEuro(grandTotal);
    countElement.textContent = String(totalCount);
  }

  function renderList() {
    listElement.innerHTML = '';

    entries.forEach((entry) => {
      const item = document.createElement('li');
      item.textContent =
        entry.quantity + ' × ' + entry.value + ' € — ' +
        formatEuro(entry.value * entry.quantity);

      listElement.appendChild(item);
    });
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

  nbInput.value = '0';
  renderList();
  updateTotals();
  nbInput.focus();
}

  valueButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedValue = Number(button.dataset.ancvValue);

      valueButtons.forEach((other) => {
        other.classList.toggle('is-active', other === button);
      });

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

  updateTotals();
}