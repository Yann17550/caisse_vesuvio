/**
 * Fichier : clotures-vesuvio/soir/pageEspeces.js
 * Rôle : page Espèces du Soir.
 *
 * Mise en page : billets à gauche, pièces à droite.
 * Navigation : billets (100 à 5), pièces (2 à 0,10),
 * Adipos, fond de caisse.
 * Adipos est obligatoire, même à 0.
 *
 * Le HTML est fourni par pageEspecesTemplate.js.
 */


import { pageEspecesTemplate } from '../templates/pageEspecesTemplate.js';

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../../core/montants/conversionMontants.js';


import { formaterEuro } from '../../../core/interface/formatageEuro.js';


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
 * Vérifie que le champ Adipos est renseigné avant de quitter la page.
 *
 * @returns {boolean} true si la page peut être quittée.
 */
export function validerPageEspeces() {
  const champAdipos = document.getElementById('soir-cash-adipos');


  if (!champAdipos || champAdipos.value.trim() === '') {
    champAdipos.focus();
    return false;
  }


  return true;
}


/**
 * Initialise la page Espèces.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
export function initialiserPageEspeces(conteneur) {
  conteneur.innerHTML = pageEspecesTemplate;


  const champAdipos = conteneur.querySelector('#soir-cash-adipos');
  const champFond = conteneur.querySelector('#soir-cash-fund');
  const valeurComptee = conteneur.querySelector(
    '#soir-cash-counted-value',
  );


  function mettreAJour() {
    const totalCompte =
      (Number(conteneur.querySelector('#soir-bill-100').value) || 0) * 100 +
      (Number(conteneur.querySelector('#soir-bill-50').value) || 0) * 50 +
      (Number(conteneur.querySelector('#soir-bill-20').value) || 0) * 20 +
      (Number(conteneur.querySelector('#soir-bill-10').value) || 0) * 10 +
      (Number(conteneur.querySelector('#soir-bill-5').value) || 0) * 5 +
      (Number(conteneur.querySelector('#soir-coin-2').value) || 0) * 2 +
      (Number(conteneur.querySelector('#soir-coin-1').value) || 0) * 1 +
      (Number(conteneur.querySelector('#soir-coin-050').value) || 0) * 0.5 +
      (Number(conteneur.querySelector('#soir-coin-020').value) || 0) * 0.2 +
      (Number(conteneur.querySelector('#soir-coin-010').value) || 0) * 0.1;


    const fond = convertirEnMontant(champFond.value) || 0;
    const caEspeces = arrondirADeuxDecimales(totalCompte - fond);


    valeurComptee.textContent = formaterEuro(caEspeces);
  }


  // Ordre de navigation : billets, pièces, Adipos, fond de caisse.
  const ordreNavigation = [
    conteneur.querySelector('#soir-bill-100'),
    conteneur.querySelector('#soir-bill-50'),
    conteneur.querySelector('#soir-bill-20'),
    conteneur.querySelector('#soir-bill-10'),
    conteneur.querySelector('#soir-bill-5'),
    conteneur.querySelector('#soir-coin-2'),
    conteneur.querySelector('#soir-coin-1'),
    conteneur.querySelector('#soir-coin-050'),
    conteneur.querySelector('#soir-coin-020'),
    conteneur.querySelector('#soir-coin-010'),
    champAdipos,
    champFond,
  ];


  ordreNavigation.forEach((champ) => {
    appliquerComportementChamp(champ);
    champ.addEventListener('input', mettreAJour);


    champ.addEventListener('keydown', (evenement) => {
      const estNavigation =
        evenement.key === 'Enter' ||
        evenement.key === 'Tab' ||
        evenement.key === 'Go';


      if (!estNavigation) {
        return;
      }


      const index = ordreNavigation.indexOf(evenement.target);


      if (index === -1) {
        return;
      }


      evenement.preventDefault();


      const suivant = ordreNavigation[index + 1];


      if (suivant) {
        suivant.focus();
      }
    });
  });


  mettreAJour();
}