/**
 * Fichier : clotures-vesuvio/soir/pageJS/pageANCV.js
 * Rôle : page ANCV papier du Soir.
 *
 * Les coupons sont affichés par cumul de dénomination.
 * Le bouton Supprimer retire tous les coupons d’une dénomination.
 * Les coupons sont conservés lors d’un rafraîchissement.
 *
 * Le HTML est fourni par pageANCVTemplate.js.
 */

import { pageAncvTemplate } from '../templates/pageANCVTemplate.js';

import {
  arrondirADeuxDecimales,
} from '../../../core/montants/conversionMontants.js';


import { formaterEuro } from '../../../core/interface/formatageEuro.js';

import {
  sauvegarderSection,
  lireSection,
} from '../../../core/interface/persistanceBrouillon.js';

const CLE_BROUILLON = 'caisse-vesuvio:brouillon-soir';

let denominationActive = 10;
let coupons = [];


/**
 * Sauvegarde la liste des coupons dans le brouillon.
 *
 * @returns {void}
 */
function sauvegarderCoupons() {
  sauvegarderSection(
    CLE_BROUILLON,
    'ancv-coupons',
    coupons,
  );
}

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
 * Met à jour les compteurs et le total ANCV.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
function mettreAJourTotaux(conteneur) {
  const totaux = { 10: 0, 20: 0, 25: 0, 50: 0 };


  coupons.forEach((coupon) => {
    totaux[coupon.denomination] += 1;
  });


  const total = arrondirADeuxDecimales(
    totaux[10] * 10 +
      totaux[20] * 20 +
      totaux[25] * 25 +
      totaux[50] * 50,
  );


  conteneur.querySelector('#soir-ancv-count-value').textContent =
    String(coupons.length);


  conteneur.querySelector('#soir-ancv-paper-total-value').textContent =
    formaterEuro(total);


  conteneur.querySelector('#soir-ancv-nb-10').textContent =
    String(totaux[10]);
  conteneur.querySelector('#soir-ancv-nb-20').textContent =
    String(totaux[20]);
  conteneur.querySelector('#soir-ancv-nb-25').textContent =
    String(totaux[25]);
  conteneur.querySelector('#soir-ancv-nb-50').textContent =
    String(totaux[50]);
}


/**
 * Affiche les coupons par cumul de dénomination.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
function afficherListe(conteneur) {
  const liste = conteneur.querySelector('#soir-ancv-list');


  liste.innerHTML = '';

  const cumuls = {};

  coupons.forEach((coupon) => {
    cumuls[coupon.denomination] =
      (cumuls[coupon.denomination] || 0) + 1;
  });

  Object.keys(cumuls)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((denomination) => {
      const nombre = cumuls[denomination];

      const element = document.createElement('li');
      element.className = 'payment-item';

      const texte = document.createElement('span');
      texte.textContent =
        `${nombre} × ${formaterEuro(Number(denomination))}`;

      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'payment-delete';
      bouton.textContent = 'Supprimer';

      bouton.addEventListener('click', () => {
        coupons = coupons.filter(
          (coupon) =>
            coupon.denomination !== Number(denomination),
        );

        afficherListe(conteneur);
        mettreAJourTotaux(conteneur);
        sauvegarderCoupons();
      });

      element.appendChild(texte);
      element.appendChild(bouton);
      liste.appendChild(element);
    });
}

/**
 * Initialise la page ANCV.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
export function initialiserPageANCV(conteneur) {
  conteneur.innerHTML = pageAncvTemplate;


  const brouillonCoupons = lireSection(
    CLE_BROUILLON,
    'ancv-coupons',
  );


  coupons = Array.isArray(brouillonCoupons)
    ? brouillonCoupons
    : [];



  const champNombre = conteneur.querySelector('#soir-ancv-nb');
  const boutonAjouter = conteneur.querySelector('#soir-ancv-add');



  appliquerComportementChamp(champNombre);



  conteneur
    .querySelectorAll('.soir-ancv-value-button')
    .forEach((bouton) => {
      bouton.addEventListener('click', () => {
        conteneur
          .querySelectorAll('.soir-ancv-value-button')
          .forEach((element) => element.classList.remove('is-active'));



        bouton.classList.add('is-active');
        denominationActive = Number(bouton.dataset.ancvValue);
      });
    });



  function ajouter() {
    const nombre = Number(champNombre.value);



    if (!Number.isInteger(nombre) || nombre <= 0) {
      return;
    }



    for (let index = 0; index < nombre; index += 1) {
      coupons.push({ denomination: denominationActive });
    }


    champNombre.value = '0';
    afficherListe(conteneur);
    mettreAJourTotaux(conteneur);
    sauvegarderCoupons();
  }


  boutonAjouter.addEventListener('click', ajouter);


  champNombre.addEventListener('keydown', (evenement) => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouter();
    }
  });


  afficherListe(conteneur);
  mettreAJourTotaux(conteneur);
}