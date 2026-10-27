/**
 * Fichier : js/features/soir/pages/cashPage.js
 * Rôle : logique de la page Espèces du service Soir.
 *
 * Cette page gère :
 * - le décompte des billets et pièces ;
 * - le CA espèces : (billets + pièces comptés, FDC inclus) - FDC ;
 * - les espèces Adipos ;
 * - le fond de caisse (134,00 € par défaut).
 *
 * Le CA espèces peut être négatif : par exemple, un pourboire réglé
 * par CB et rendu en espèces peut faire descendre le comptage
 * en dessous du fond de caisse.
 *
 * Le CA espèces est affiché dans le titre de page :
 * « Espèces — X,XX € » (géré par soirController.js).
 *
 * La navigation clavier suit cet ordre :
 * billets (100 à 5), pièces (2 à 0,10), espèces Adipos, fond de caisse.
 *
 * Au focus : efface le contenu du champ, quelle que soit sa valeur.
 * Au blur : restaure la valeur initiale si rien n'a été saisi,
 * puis recalcule le CA espèces.
 */

import {
  isFilled,
  showFieldError,
  clearFieldError,
} from '../../../utils/validation.js';
import { formatEuro } from '../../../utils/format.js';
import { getInputAmount } from '../../../utils/amounts.js';
import { cashPageTemplate } from './templates/cashPageTemplate.js';

export function initCashPage(container) {
  container.innerHTML = cashPageTemplate;

  const formElement = document.getElementById('soir-cash-form');

  // Champs de comptage, espèces Adipos et fond de caisse.
  const inputs = {
    bill100: document.getElementById('soir-bill-100'),
    bill50: document.getElementById('soir-bill-50'),
    bill20: document.getElementById('soir-bill-20'),
    bill10: document.getElementById('soir-bill-10'),
    bill5: document.getElementById('soir-bill-5'),
    coin2: document.getElementById('soir-coin-2'),
    coin1: document.getElementById('soir-coin-1'),
    coin050: document.getElementById('soir-coin-050'),
    coin020: document.getElementById('soir-coin-020'),
    coin010: document.getElementById('soir-coin-010'),
    adipos: document.getElementById('soir-cash-adipos'),
    fund: document.getElementById('soir-cash-fund'),
  };

  // Calcule le CA espèces et actualise ses deux affichages.
  function updateCountedTotal() {
    const cashOnHand =
      getInputAmount(inputs.bill100) * 100 +
      getInputAmount(inputs.bill50) * 50 +
      getInputAmount(inputs.bill20) * 20 +
      getInputAmount(inputs.bill10) * 10 +
      getInputAmount(inputs.bill5) * 5 +
      getInputAmount(inputs.coin2) * 2 +
      getInputAmount(inputs.coin1) * 1 +
      getInputAmount(inputs.coin050) * 0.5 +
      getInputAmount(inputs.coin020) * 0.2 +
      getInputAmount(inputs.coin010) * 0.1;

    // CA espèces = comptage total, FDC inclus, moins le FDC.
    // À l'ouverture : 134 - 134 = 0. Le résultat peut être négatif.
    const countedTotal = cashOnHand - getInputAmount(inputs.fund);

    // Titre visible, recréé par le contrôleur à chaque affichage.
    const titleElement = document.getElementById('soir-cash-counted-total');

    if (titleElement) {
      titleElement.textContent = formatEuro(countedTotal);
    }

    // Valeur cachée utilisée comme source par soirTotals.js.
    const hiddenElement = document.getElementById('soir-cash-counted-value');

    if (hiddenElement) {
      hiddenElement.textContent = formatEuro(countedTotal);
    }
  }

  // Effacement à l'entrée et restauration si le champ est laissé vide.
  Object.values(inputs).forEach((input) => {
    // Mémorise la valeur avant de vider le champ.
    input.addEventListener('focus', () => {
      input.dataset.previousValue = input.value;
      input.value = '';
    });

    // Restaure si nécessaire, puis recalcule le CA espèces.
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.value = input.dataset.previousValue || '0';
      }

      updateCountedTotal();
    });
  });

  // Ordre de passage : billets, pièces, Adipos, puis fond de caisse.
  const navigationOrder = [
    inputs.bill100,
    inputs.bill50,
    inputs.bill20,
    inputs.bill10,
    inputs.bill5,
    inputs.coin2,
    inputs.coin1,
    inputs.coin050,
    inputs.coin020,
    inputs.coin010,
    inputs.adipos,
    inputs.fund,
  ];

  // Empêche la soumission du formulaire et le rechargement de page.
  formElement.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  // Navigation avec Entrée, Tab et les touches équivalentes sur mobile.
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

    const currentIndex = navigationOrder.indexOf(event.target);

    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();

    const nextInput = navigationOrder[currentIndex + 1];

    if (nextInput) {
      nextInput.focus();
    }
  });

  // Actualise le titre lorsqu'on revient sur la page Espèces.
  document.addEventListener('soir:page-shown', (event) => {
    if (event.detail.page === 'cash') {
      updateCountedTotal();
    }
  });

  // Calcul initial au chargement de la page.
  updateCountedTotal();
}

/**
 * Valide la page Espèces du Soir.
 * Le champ Espèces Adipos est obligatoire, même s'il vaut 0.
 *
 * @returns {boolean} true si la page est valide, false sinon.
 */
export function validateCashPage() {
  const adiposInput = document.getElementById('soir-cash-adipos');

  clearFieldError(adiposInput);

  if (!isFilled(adiposInput.value)) {
    showFieldError(
      adiposInput,
      'Espèces Adipos obligatoire (0 autorisé).',
    );

    adiposInput.focus();

    return false;
  }

  return true;
}