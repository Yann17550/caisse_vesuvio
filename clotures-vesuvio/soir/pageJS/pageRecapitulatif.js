/**
 * Fichier : clotures-vesuvio/soir/pageRecapitulatif.js
 * Rôle : page Récapitulatif du Soir.
 *
 * Reprend l’ancien récapitulatif : lignes à zéro masquées,
 * contrôle TVA et bouton Valider.
 * Les lignes d’écart à zéro sont également masquées.
 *
 * Le HTML est fourni par pageRecapitulatifTemplate.js.
 */


import { pageRecapitulatifTemplate } from '../templates/pageRecapitulatifTemplate.js';

import { formaterEuro } from '../../../core/interface/formatageEuro.js';


import {
  collecterTotauxSoir,
} from '../logique/calculSoir.js';


/**
 * Applique l’UX « effacer au focus, restaurer au blur ».
 *
 * @param {HTMLInputElement} champ - Champ concerné.
 */
function appliquerComportementChamp(champ) {
  champ.addEventListener('focus', () => {
    champ.dataset.previousValue = champ.value;
    champ.value = '';
  });


  champ.addEventListener('blur', () => {
    if (champ.value === '') {
      champ.value = champ.dataset.previousValue || '0';
    }
  });
}


/**
 * Masque ou affiche une ligne selon sa valeur.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {string} id - Identifiant de la ligne.
 * @param {boolean} visible - true pour afficher.
 */
function basculerLigne(conteneur, id, visible) {
  const element = conteneur.querySelector(`#${id}`);


  if (element) {
    element.hidden = !visible;
  }
}


/**
 * Initialise la page Récapitulatif.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} parametres - Paramètres.
 * @param {Function} parametres.onValider - Action de validation.
 * @returns {Object} Fonction de mise à jour du récapitulatif.
 */
export function initialiserPageRecapitulatif(
  conteneur,
  { onValider } = {},
) {
  conteneur.innerHTML = pageRecapitulatifTemplate;


  const formulaire = conteneur.querySelector('#soir-recap-form');
  const message = conteneur.querySelector('#soir-recap-message');


  /**
   * Met à jour l’ensemble du récapitulatif.
   */
  function mettreAJourRecap() {
    const totaux = collecterTotauxSoir();


    // --- Encaissements : masqués si 0 ---
    const lignesEncaissements = [
      {
        ligne: 'soir-recap-line-adipos',
        valeur: totaux.cash.adipos,
        cible: 'soir-recap-adipos',
        texte: formaterEuro(totaux.cash.adipos),
      },
      {
        ligne: 'soir-recap-line-cb-classic-amex',
        valeur: totaux.cardClassic.total + totaux.cardAmex.total,
        cible: 'soir-recap-cb-classic-amex',
        texte: formaterEuro(
          totaux.cardClassic.total + totaux.cardAmex.total,
        ),
      },
      {
        ligne: 'soir-recap-line-cb-tr',
        valeur: totaux.cardTr.total,
        cible: 'soir-recap-cb-tr',
        texte: formaterEuro(totaux.cardTr.total),
      },
      {
        ligne: 'soir-recap-line-cb-ancv',
        valeur: totaux.cardAncv.total,
        cible: 'soir-recap-cb-ancv',
        texte: formaterEuro(totaux.cardAncv.total),
      },
      {
        ligne: 'soir-recap-line-mypos',
        valeur: totaux.myPos.total,
        cible: 'soir-recap-mypos',
        texte: formaterEuro(totaux.myPos.total),
      },
      {
        ligne: 'soir-recap-line-ancv-paper',
        valeur: totaux.ancvPaper.total,
        cible: 'soir-recap-ancv-paper',
        texte: formaterEuro(totaux.ancvPaper.total),
      },
      {
        ligne: 'soir-recap-line-checks',
        valeur: totaux.checks.total,
        cible: 'soir-recap-checks',
        texte: formaterEuro(totaux.checks.total),
      },
    ];


    lignesEncaissements.forEach((ligne) => {
      const visible = ligne.valeur !== 0;


      basculerLigne(conteneur, ligne.ligne, visible);


      if (visible) {
        conteneur.querySelector(`#${ligne.cible}`).textContent =
          ligne.texte;
      }
    });


    // --- Compteurs : masqués si 0 ---
    basculerLigne(
      conteneur,
      'soir-recap-line-ancv-count',
      totaux.ancvPaper.count !== 0,
    );


    if (totaux.ancvPaper.count !== 0) {
      conteneur.querySelector('#soir-recap-ancv-count').textContent =
        String(totaux.ancvPaper.count);
    }


    basculerLigne(
      conteneur,
      'soir-recap-line-checks-count',
      totaux.checks.count !== 0,
    );


    if (totaux.checks.count !== 0) {
      conteneur.querySelector('#soir-recap-checks-count').textContent =
        String(totaux.checks.count);
    }


    // --- Écarts : masqués si 0, visibles si négatifs ou positifs ---
    const ecarts = [
      {
        ligne: 'soir-recap-line-cash-difference',
        valeur: totaux.cash.difference,
        cible: 'soir-recap-cash-difference',
      },
      {
        ligne: 'soir-recap-line-mypos-difference',
        valeur: totaux.myPos.total,
        cible: 'soir-recap-mypos-difference',
      },
      {
        ligne: 'soir-recap-line-total-difference',
        valeur: totaux.totalDifference,
        cible: 'soir-recap-total-difference',
      },
    ];


    ecarts.forEach((ecart) => {
      const visible = ecart.valeur !== 0;


      basculerLigne(conteneur, ecart.ligne, visible);


      if (visible) {
        conteneur.querySelector(`#${ecart.cible}`).textContent =
          formaterEuro(ecart.valeur);
      }
    });


    // --- Contrôle TVA ---
    const coherent = totaux.vatTotal === totaux.paymentsTotal;
    const ecartTva = arrondir(totaux.vatTotal - totaux.paymentsTotal);


    conteneur.querySelector('#soir-recap-vat-total').textContent =
      formaterEuro(totaux.vatTotal);


    const coherence = conteneur.querySelector('#soir-recap-coherence');
    const fieldsetTva = conteneur.querySelector(
      '#soir-recap-tva-fieldset',
    );


    if (coherent) {
      coherence.textContent = 'OK';
      coherence.classList.remove('coherence-error');
      fieldsetTva.classList.add('tva-ok');
      fieldsetTva.classList.remove('tva-error');
    } else {
      coherence.textContent = `Écart : ${formaterEuro(ecartTva)}`;
      coherence.classList.add('coherence-error');
      fieldsetTva.classList.remove('tva-ok');
      fieldsetTva.classList.add('tva-error');
    }
  }


  function arrondir(valeur) {
    return Math.round((Number(valeur) + Number.EPSILON) * 100) / 100;
  }


  formulaire.addEventListener('input', mettreAJourRecap);


  formulaire.querySelectorAll('input').forEach((champ) => {
    appliquerComportementChamp(champ);
  });


  formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();


    const totaux = collecterTotauxSoir();


    if (totaux.vatTotal !== totaux.paymentsTotal) {
      message.textContent =
        'Validation impossible : écart entre les encaissements et la TVA.';
      message.classList.add('is-error');
      return;
    }


    if (onValider) {
      onValider({ totaux });
    }
  });


  mettreAJourRecap();


  return {
    mettreAJourRecap,
  };
}