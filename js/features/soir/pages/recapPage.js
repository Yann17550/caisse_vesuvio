/**
 * Fichier : js/features/soir/pages/recapPage.js
 * Rôle : afficher la page Récapitulatif du service Soir.
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


export const recapPageTemplate = `
  <h3>Récapitulatif</h3>


  <form id="soir-recap-form" class="card" novalidate>
    <fieldset>
      <legend>Encaissements</legend>


      <div class="recap-line">
        <span>Espèces Adipos</span>
        <strong id="soir-recap-adipos">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>CB classique + AMEX</span>
        <strong id="soir-recap-cb-classic-amex">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>CB Ticket Restaurant</span>
        <strong id="soir-recap-cb-tr">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>CB ANCV</span>
        <strong id="soir-recap-cb-ancv">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>myPOS</span>
        <strong id="soir-recap-mypos">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>ANCV papier</span>
        <strong id="soir-recap-ancv-paper">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>Chèques</span>
        <strong id="soir-recap-checks">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>Nombre de chèques</span>
        <strong id="soir-recap-checks-count">0</strong>
      </div>
    </fieldset>


    <fieldset>
      <legend>Écart</legend>


      <div class="recap-line">
        <span>Écart espèces</span>
        <strong id="soir-recap-cash-difference">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>myPOS</span>
        <strong id="soir-recap-mypos-difference">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>Écart total</span>
        <strong id="soir-recap-total-difference">0,00 €</strong>
      </div>
    </fieldset>


    <fieldset>
      <legend>Fréquentation</legend>


      <div class="form-field">
        <label for="soir-recap-dine-in">Nombre de couverts sur place</label>
        <input
          type="text"
          id="soir-recap-dine-in"
          inputmode="numeric"
          value="0"
        />
      </div>


      <div class="form-field">
        <label for="soir-recap-takeaway">Nombre de pizzas à emporter</label>
        <input
          type="text"
          id="soir-recap-takeaway"
          inputmode="numeric"
          value="0"
        />
      </div>
    </fieldset>


    <fieldset>
      <legend>TVA</legend>


      <div class="form-field">
        <label for="soir-recap-vat-55">Montant TTC 5,5 %</label>
        <input
          type="text"
          id="soir-recap-vat-55"
          inputmode="decimal"
          placeholder="Montant TTC 5,5 %"
        />
      </div>


      <div class="form-field">
        <label for="soir-recap-vat-10">Montant TTC 10 %</label>
        <input
          type="text"
          id="soir-recap-vat-10"
          inputmode="decimal"
          placeholder="Montant TTC 10 %"
        />
      </div>


      <div class="form-field">
        <label for="soir-recap-vat-20">Montant TTC 20 %</label>
        <input
          type="text"
          id="soir-recap-vat-20"
          inputmode="decimal"
          placeholder="Montant TTC 20 %"
        />
      </div>


      <div class="recap-line">
        <span>Total TVA TTC</span>
        <strong id="soir-recap-vat-total">0,00 €</strong>
      </div>


      <div class="recap-line">
        <span>Contrôle TVA</span>
        <strong id="soir-recap-coherence">—</strong>
      </div>
    </fieldset>
  </form>
`;


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