/**
 * Fichier : js/features/soir/pages/recapPage.js
 * Rôle : logique de la page Récapitulatif du service Soir.
 *
 * Cette page ne contient aucun calcul métier :
 * - les totaux viennent de soirTotals.js (source de vérité) ;
 * - la cohérence TVA / encaissements vient de closingValidation.js.
 *
 * Le Soir correspond à la clôture de la journée entière :
 * les montants saisis dans les autres pages sont déjà les
 * totaux absolus de la journée.
 *
 * Écart espèces = total des espèces comptées (sans fond de caisse)
 *                 - espèces Adipos.
 * Écart myPOS = total myPOS.
 * Écart total = écart espèces + écart myPOS.
 *
 * Contrôle de cohérence (myPOS exclu) :
 * Total TVA TTC = Adipos + CB classique + AMEX + CB TR + CB ANCV
 *                 + ANCV papier + Chèques.
 *
 * UX : la touche Entrée fait passer au champ suivant
 * (Fréquentation puis TVA).
 */


import { formatEuro } from '../../../utils/format.js';
import { validateClosingTotals } from '../../../utils/closingValidation.js';
import { getSoirTotals } from '../soirTotals.js';
import { setupEnterNavigation } from '../../../utils/formNavigation.js';
import { recapPageTemplate } from './templates/recapPageTemplate.js';


export function initRecapPage(container) {
  container.innerHTML = recapPageTemplate;


  const formElement = document.getElementById('soir-recap-form');


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


  setupEnterNavigation(formElement);


  updateRecap();
}