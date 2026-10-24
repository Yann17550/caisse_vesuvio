/**
 * Fichier : js/features/soir/pages/recapPage.js
 * Rôle : fournir et afficher la page Récapitulatif du service Soir.
 *
 * Le Soir correspond à la clôture de la journée entière :
 * les montants saisis dans les autres pages sont déjà les
 * totaux absolus de la journée.
 *
 * Écart espèces = total des espèces comptées (sans fond de caisse)
 *                 - espèces Adipos.
 * Écart myPOS = total myPOS.
 * Écart total = écart espèces + écart myPOS.
 */

import { formatEuro } from '../../../utils/format.js';

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
    </fieldset>
  </form>
`;

export function initRecapPage(container) {
  container.innerHTML = recapPageTemplate;

  const recapAdiposElement = document.getElementById('soir-recap-adipos');
  const recapCbClassicAmexElement = document.getElementById(
    'soir-recap-cb-classic-amex',
  );
  const recapCbTrElement = document.getElementById('soir-recap-cb-tr');
  const recapCbAncvElement = document.getElementById('soir-recap-cb-ancv');
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

  function getAmountFromText(element) {
    const value = Number(
      element.textContent.replace('€', '').replace(/\s/g, '').replace(',', '.'),
    );

    return Number.isFinite(value) ? value : 0;
  }

  function getAmountFromInput(input) {
    const value = Number(input.value.replace(',', '.'));

    return Number.isFinite(value) ? value : 0;
  }

  function updateRecap() {
    const adiposTotal = getAmountFromInput(
      document.getElementById('soir-cash-adipos'),
    );

    const countedTotal = getAmountFromText(
      document.getElementById('soir-cash-counted-total'),
    );

    const classicTotal = getAmountFromText(
      document.getElementById('soir-card-classic-total'),
    );

    const amexTotal = getAmountFromText(
      document.getElementById('soir-card-amex-total'),
    );

    const trTotal = getAmountFromText(
      document.getElementById('soir-card-tr-total'),
    );

    const cbAncvTotal = getAmountFromText(
      document.getElementById('soir-card-ancv-total'),
    );

    const ancvPaperTotal = getAmountFromText(
      document.getElementById('soir-ancv-grand-total'),
    );

    const checksTotal = getAmountFromText(
      document.getElementById('soir-checks-total'),
    );

    const checksCount = Number(
      document.getElementById('soir-checks-count').textContent,
    );

    const myPosTotal = getAmountFromText(
      document.getElementById('soir-card-mypos-total'),
    );

    const cashDifference = countedTotal - adiposTotal;
    const totalDifference = cashDifference + myPosTotal;

    recapAdiposElement.textContent = formatEuro(adiposTotal);

    recapCbClassicAmexElement.textContent = formatEuro(
      classicTotal + amexTotal,
    );

    recapCbTrElement.textContent = formatEuro(trTotal);
    recapCbAncvElement.textContent = formatEuro(cbAncvTotal);
    recapAncvPaperElement.textContent = formatEuro(ancvPaperTotal);
    recapChecksElement.textContent = formatEuro(checksTotal);

    recapChecksCountElement.textContent = Number.isFinite(checksCount)
      ? String(checksCount)
      : '0';

    recapCashDifferenceElement.textContent = formatEuro(cashDifference);
    recapMyPosDifferenceElement.textContent = formatEuro(myPosTotal);
    recapTotalDifferenceElement.textContent = formatEuro(totalDifference);
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


  updateRecap();
}