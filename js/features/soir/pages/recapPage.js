/**
 * Fichier : js/features/soir/pages/recapPage.js
 * Rôle : logique de la page Récapitulatif du service Soir.
 *
 * Cette page affiche les totaux (source : soirTotals.js),
 * contrôle la cohérence TVA / encaissements (closingValidation.js)
 * et enregistre la clôture du Soir dans Supabase.
 *
 * Les lignes d'encaissements et les compteurs sont masquées
 * lorsque leur valeur est à 0. Les lignes d'écart restent
 * toujours visibles (un écart peut être négatif).
 *
 * Le titre de page affiche la TVA TTC totale et l'écart total.
 * Il est recréé par soirController.js à chaque affichage :
 * les valeurs du titre sont donc recherchées dans le DOM
 * à chaque mise à jour.
 *
 * La validation est impossible si le contrôle de cohérence échoue.
 * Après un enregistrement réussi, l'interface est remise à zéro.
 */




import { formatEuro } from '../../../utils/format.js';
import { validateClosingTotals } from '../../../utils/closingValidation.js';
import { getSoirTotals } from '../soirTotals.js';
import {
  setupEnterNavigation,
  setupSelectOnFocus,
} from '../../../utils/formNavigation.js';
import { buildSoirClosingData } from '../../../validation/soirValidation.js';
import {
  saveDailyClosing,
  closeDailyClosing,
} from '../../../services/dailyClosingService.js';
import { recapPageTemplate } from './templates/recapPageTemplate.js';

export function initRecapPage(container) {
  container.innerHTML = recapPageTemplate;

  const formElement = document.getElementById('soir-recap-form');
  const messageElement = document.getElementById('soir-recap-message');

  const recapAdiposElement = document.getElementById('soir-recap-adipos');
  const recapCbClassicAmexElement = document.getElementById(
    'soir-recap-cb-classic-amex',
  );
  const recapCbTrElement = document.getElementById('soir-recap-cb-tr');
  const recapCbAncvElement = document.getElementById('soir-recap-cb-ancv');
  const recapMyPosElement = document.getElementById('soir-recap-mypos');
  const recapAncvPaperElement = document.getElementById(
    'soir-recap-ancv-paper',
  );
  const recapAncvCountElement = document.getElementById(
    'soir-recap-ancv-count',
  );
  const recapChecksElement = document.getElementById('soir-recap-checks');
  const recapChecksCountElement = document.getElementById(
    'soir-recap-checks-count',
  );

  const recapCashDifferenceElement = document.getElementById(
    'soir-recap-cash-difference',
  );
  const recapMyPosDifferenceElement = document.getElementById(
    'soir-recap-mypos-difference',
  );
  const recapTotalDifferenceElement = document.getElementById(
    'soir-recap-total-difference',
  );

  const tvaFieldsetElement = document.getElementById(
    'soir-recap-tva-fieldset',
  );
  
  const recapVatTotalElement = document.getElementById(
    'soir-recap-vat-total',
  );
  const recapCoherenceElement = document.getElementById(
    'soir-recap-coherence',
  );

  function showMessage(text, type = 'info') {
    messageElement.textContent = text;
    messageElement.classList.remove('is-error', 'is-success');

    if (type === 'error') {
      messageElement.classList.add('is-error');
    }

    if (type === 'success') {
      messageElement.classList.add('is-success');
    }
  }

  function clearMessage() {
    messageElement.textContent = '';
    messageElement.classList.remove('is-error', 'is-success');
  }

  function getBusinessDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Masque ou affiche une ligne selon la valeur à 0 ou non.
  function toggleLine(lineId, isVisible) {
    const lineElement = document.getElementById(lineId);

    if (lineElement) {
      lineElement.hidden = !isVisible;
    }
  }

  // Écrit une valeur dans le titre de page, recréé à chaque affichage.
  function setTitleValue(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
      element.textContent = value;
    }
  }

  function updateRecap() {
    const totals = getSoirTotals();


    // --- Encaissements (masqués si 0) ---
    const encaissementLines = [
      {
        lineId: 'soir-recap-line-adipos',
        element: recapAdiposElement,
        value: totals.cash.adipos,
      },
      {
        lineId: 'soir-recap-line-cb-classic-amex',
        element: recapCbClassicAmexElement,
        value: totals.cardClassic.total + totals.cardAmex.total,
      },
      {
        lineId: 'soir-recap-line-cb-tr',
        element: recapCbTrElement,
        value: totals.cardTr.total,
      },
      {
        lineId: 'soir-recap-line-cb-ancv',
        element: recapCbAncvElement,
        value: totals.cardAncv.total,
      },
      {
        lineId: 'soir-recap-line-mypos',
        element: recapMyPosElement,
        value: totals.myPos.total,
      },
      {
        lineId: 'soir-recap-line-ancv-paper',
        element: recapAncvPaperElement,
        value: totals.ancvPaper.total,
      },
      {
        lineId: 'soir-recap-line-checks',
        element: recapChecksElement,
        value: totals.checks.total,
      },
    ];

    encaissementLines.forEach((line) => {
      const isVisible = line.value !== 0;

      toggleLine(line.lineId, isVisible);

      if (isVisible) {
        line.element.textContent = formatEuro(line.value);
      }
    });


    // --- Compteurs (masqués si 0) ---
    const ancvCountVisible = totals.ancvPaper.count !== 0;

    toggleLine('soir-recap-line-ancv-count', ancvCountVisible);

    if (ancvCountVisible) {
      recapAncvCountElement.textContent = String(totals.ancvPaper.count);
    }

    const checksCountVisible = totals.checks.count !== 0;

    toggleLine('soir-recap-line-checks-count', checksCountVisible);

    if (checksCountVisible) {
      recapChecksCountElement.textContent = String(totals.checks.count);
    }

    // --- Écarts (toujours visibles, peuvent être négatifs) ---
    recapCashDifferenceElement.textContent = formatEuro(
      totals.cash.difference,
    );

    recapMyPosDifferenceElement.textContent = formatEuro(
      totals.myPos.total,
    );

    recapTotalDifferenceElement.textContent = formatEuro(
      totals.totalDifference,
    );

    updateCoherence(totals);
  }

  function updateCoherence(totals) {
    const result = validateClosingTotals({
      expectedTotal: totals.vatTotal,
      actualTotal: totals.paymentsTotal,
    });

    recapVatTotalElement.textContent = formatEuro(totals.vatTotal);





    // Titre de page : TVA TTC + écart total.
    setTitleValue('soir-recap-title-vat', formatEuro(totals.vatTotal));
    setTitleValue(
      'soir-recap-title-ecart',
      formatEuro(totals.totalDifference),
    );





    if (result.isValid) {
      recapCoherenceElement.textContent = 'OK';
      recapCoherenceElement.classList.remove('coherence-error');
      tvaFieldsetElement.classList.add('tva-ok');
      tvaFieldsetElement.classList.remove('tva-error');
    } else {
      recapCoherenceElement.textContent = `Écart : ${formatEuro(
        result.difference,
      )}`;
      recapCoherenceElement.classList.add('coherence-error');
      tvaFieldsetElement.classList.remove('tva-ok');
      tvaFieldsetElement.classList.add('tva-error');
    }
  }





  async function handleValidate(event) {
    event.preventDefault();
    clearMessage();




    const totals = getSoirTotals();




    // La validation est impossible si le contrôle de cohérence échoue.
    const coherence = validateClosingTotals({
      expectedTotal: totals.vatTotal,
      actualTotal: totals.paymentsTotal,
    });

    if (!coherence.isValid) {
      showMessage(
        `Validation impossible : écart de ${formatEuro(
          coherence.difference,
        )} entre les encaissements et la TVA.`,
        'error',
      );

      return;
    }

    const closingData = buildSoirClosingData(totals);

    try {
      showMessage('Enregistrement du Soir en cours…', 'info');

      await saveDailyClosing(getBusinessDate(), 'soir', closingData);
      await closeDailyClosing(getBusinessDate(), 'soir');

      showMessage(
        'Soir enregistré et validé dans Supabase.',
        'success',
      );

      // Toutes les données sont en base : remise à zéro de l'interface.
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }

  const watchedInputIds = [
    'soir-cash-adipos',
    'soir-bill-100',
    'soir-bill-50',
    'soir-bill-20',
    'soir-bill-10',
    'soir-bill-5',
    'soir-coin-2',
    'soir-coin-1',
    'soir-coin-050',
    'soir-coin-020',
    'soir-coin-010',
    'soir-card-classic-contact',
    'soir-card-classic-no-contact',
    'soir-card-tr-contact',
    'soir-card-tr-no-contact',
    'soir-card-ancv-contact',
    'soir-card-ancv-no-contact',
    'soir-card-amex-contact',
    'soir-card-amex-no-contact',
    'soir-recap-dine-in',
    'soir-recap-takeaway',
    'soir-recap-vat-55',
    'soir-recap-vat-10',
    'soir-recap-vat-20',
  ];

  watchedInputIds.forEach((inputId) => {
    const input = document.getElementById(inputId);

    if (input) {
      input.addEventListener('input', updateRecap);
    }
  });

  const myPosListElement = document.getElementById('soir-card-mypos-list');
  const checksListElement = document.getElementById('soir-checks-list');

  if (myPosListElement) {
    myPosListElement.addEventListener('input', updateRecap);
    myPosListElement.addEventListener('click', updateRecap);
  }

  if (checksListElement) {
    checksListElement.addEventListener('input', updateRecap);
    checksListElement.addEventListener('click', updateRecap);
  }

  document.addEventListener(
    'soir:payments-changed',
    updateRecap,
  );

  // Le titre de page est recréé à chaque affichage :
  // on recalcule pour remplir TVA TTC et écart dans le titre.
  document.addEventListener('soir:page-shown', (event) => {
    if (event.detail.page === 'recap') {
      updateRecap();
    }
  });

  // Touche Entrée : passe au champ suivant.
  setupEnterNavigation(formElement);

  // Fréquentation et TVA : même comportement que la page Espèces.
  const recapInputs = formElement.querySelectorAll('input');

  recapInputs.forEach((input) => {
    // Au focus : mémorise la valeur et vide réellement le champ.
    input.addEventListener('focus', () => {
      input.dataset.previousValue = input.value;
      input.value = '';
    });

    // Au blur : restaure si aucune saisie, puis actualise le Récap.
    input.addEventListener('blur', () => {
      if (input.value === '') {
        input.value = input.dataset.previousValue || '0';
      }

      updateRecap();
    });
  });

  // Touche Entrée : passe au champ suivant.
  setupEnterNavigation(formElement);

  updateRecap();
}
