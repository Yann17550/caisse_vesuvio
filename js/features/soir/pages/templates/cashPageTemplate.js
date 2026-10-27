/**
 * Fichier : js/features/soir/pages/templates/cashPageTemplate.js
 * Rôle : template HTML de la page Espèces du service Soir.
 *
 * Ce fichier ne contient que du HTML. Aucune logique.
 *
 * À l'ouverture, les coupures contiennent la répartition du fond
 * de caisse habituel (134,00 €) : le CA espèces démarre donc à 0.
 * Le CA espèces est calculé par cashPage.js :
 * (coupures comptées, FDC inclus) - FDC.
 */


export const cashPageTemplate = `
  <form id="soir-cash-form" class="card" novalidate>
    <fieldset>
      <legend>Billets et pièces</legend>


      <div class="soir-cash-grid">
        <span class="soir-cash-label">100 €</span>
        <input
          type="text"
          id="soir-bill-100"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="0"
        />


        <span class="soir-cash-label">2,00 €</span>
        <input
          type="text"
          id="soir-coin-2"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="10"
        />


        <span class="soir-cash-label">50 €</span>
        <input
          type="text"
          id="soir-bill-50"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="0"
        />


        <span class="soir-cash-label">1,00 €</span>
        <input
          type="text"
          id="soir-coin-1"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="10"
        />


        <span class="soir-cash-label">20 €</span>
        <input
          type="text"
          id="soir-bill-20"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="2"
        />


        <span class="soir-cash-label">0,50 €</span>
        <input
          type="text"
          id="soir-coin-050"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="5"
        />


        <span class="soir-cash-label">10 €</span>
        <input
          type="text"
          id="soir-bill-10"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="4"
        />


        <span class="soir-cash-label">0,20 €</span>
        <input
          type="text"
          id="soir-coin-020"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="5"
        />


        <span class="soir-cash-label">5 €</span>
        <input
          type="text"
          id="soir-bill-5"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="4"
        />


        <span class="soir-cash-label">0,10 €</span>
        <input
          type="text"
          id="soir-coin-010"
          class="soir-cash-input"
          inputmode="numeric"
          maxlength="2"
          enterkeyhint="next"
          value="5"
        />
      </div>
    </fieldset>


    <fieldset>
      <legend>Espèces Adipos</legend>


      <div class="form-field">
        <input
          type="text"
          id="soir-cash-adipos"
          inputmode="decimal"
          placeholder="Montant Adipos"
          aria-label="Espèces Adipos"
        />
      </div>
    </fieldset>


    <fieldset>
      <legend>Fond de caisse</legend>


      <div class="form-field">
        <input
          type="text"
          id="soir-cash-fund"
          inputmode="decimal"
          value="134"
          aria-label="Fond de caisse"
        />
      </div>
    </fieldset>

    <strong id="soir-cash-counted-value" hidden>0,00 €</strong>
  </form>
`;