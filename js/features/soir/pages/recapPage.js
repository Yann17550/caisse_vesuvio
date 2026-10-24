/**
 * Fichier : js/features/soir/pages/recapPage.js
 * Rôle : logique de la page Récapitulatif du service Soir.
 *
 * Cette page affiche les totaux (source : soirTotals.js),
 * contrôle la cohérence TVA / encaissements (closingValidation.js)
 * et enregistre la clôture du Soir dans Supabase.
 *
 * La validation est impossible si le contrôle de cohérence échoue.
 * Après un enregistrement réussi, l’interface est remise à zéro.
 *
 * Le Soir correspond à la clôture de la journée entière :
 * les montants saisis dans les autres pages sont déjà les
 * totaux absolus de la journée.
 */



import { formatEuro } from '../../../utils/format.js';
import { validateClosingTotals } from '../../../utils/closingValidation.js';
import { getSoirTotals } from '../soirTotals.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';
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
  const validateButton = document.getElementById('soir-recap-validate-button');




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



  function updateRecap() {
    const totals = getSoirTotals();




    recapAdiposElement.textContent = formatEuro(totals.cash.adipos);




    recapCbClassicAmexElement.textContent = formatEuro(
      totals.cardClassic.total + totals.cardAmex.total,
    );




    recapCbTrElement.textContent = formatEuro(totals.cardTr.total);




    recapCbAncvElement.textContent = formatEuro(totals.cardAncv.total);




    recapMyPosElement.textContent = formatEuro(totals.myPos.total);




    recapAncvPaperElement.textContent = formatEuro(totals.ancvPaper.total);




    recapChecksElement.textContent = formatEuro(totals.checks.total);




    recapChecksCountElement.textContent = String(totals.checks.count);




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




    if (result.isValid) {
      recapCoherenceElement.textContent = 'OK';
      recapCoherenceElement.classList.remove('coherence-error');
    } else {
      recapCoherenceElement.textContent = `Écart : ${formatEuro(
        result.difference,
      )}`;
      recapCoherenceElement.classList.add('coherence-error');
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



      // Toutes les données sont en base : remise à zéro de l’interface.
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
    'soir-ancv-nb-10',
    'soir-ancv-nb-20',
    'soir-ancv-nb-25',
    'soir-ancv-nb-50',
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




  formElement.addEventListener('submit', handleValidate);




  setupEnterNavigation(formElement);




  updateRecap();
}