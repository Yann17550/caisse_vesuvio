/**
 * Fichier : clotures-vesuvio/soir/pageJS/pageCheques.js
 * Rôle : page Chèques du Soir.
 *
 * Les chèques sont conservés lors d’un rafraîchissement.
 *
 * Le HTML est fourni par pageChequesTemplate.js.
 */


import { pageChequesTemplate } from '../templates/pageChequesTemplate.js';


import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../../core/montants/conversionMontants.js';



import { formaterEuro } from '../../../core/interface/formatageEuro.js';


import {
  sauvegarderSection,
  lireSection,
} from '../../../core/interface/persistanceBrouillon.js';


const CLE_BROUILLON = 'caisse-vesuvio:brouillon-soir';


let cheques = [];


/**
 * Sauvegarde la liste des chèques dans le brouillon.
 *
 * @returns {void}
 */
function sauvegarderCheques() {
  sauvegarderSection(
    CLE_BROUILLON,
    'cheques-liste',
    cheques,
  );
}


function appliquerComportementChamp(champ) {
  champ.addEventListener('focus', () => {
    champ.dataset.previousValue = champ.value;
    champ.value = '';
  });



  champ.addEventListener('blur', () => {
    if (champ.value === '') {
      champ.value = champ.dataset.previousValue || '';
    }
  });
}



function mettreAJourTotaux(conteneur) {
  const total = arrondirADeuxDecimales(
    cheques.reduce((total, cheque) => total + cheque.montant, 0),
  );



  conteneur.querySelector('#soir-checks-count').textContent =
    String(cheques.length);



  conteneur.querySelector('#soir-checks-total-value').textContent =
    formaterEuro(total);
}



function afficherListe(conteneur) {
  const liste = conteneur.querySelector('#soir-checks-list');



  liste.innerHTML = '';



  cheques.forEach((cheque, index) => {
    const element = document.createElement('li');
    element.className = 'payment-item';



    const texte = document.createElement('span');
    texte.textContent = formaterEuro(cheque.montant);



    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'payment-delete';
    bouton.textContent = 'Supprimer';



    bouton.addEventListener('click', () => {
      cheques.splice(index, 1);
      afficherListe(conteneur);
      mettreAJourTotaux(conteneur);
      sauvegarderCheques();
    });



    element.appendChild(texte);
    element.appendChild(bouton);
    liste.appendChild(element);
  });
}



export function initialiserPageCheques(conteneur) {
  conteneur.innerHTML = pageChequesTemplate;


  const brouillonCheques = lireSection(
    CLE_BROUILLON,
    'cheques-liste',
  );


  cheques = Array.isArray(brouillonCheques)
    ? brouillonCheques
    : [];



  const champMontant = conteneur.querySelector('#soir-checks-amount');
  const boutonAjouter = conteneur.querySelector('#soir-checks-add');



  appliquerComportementChamp(champMontant);



  function ajouter() {
    const montant = convertirEnMontant(champMontant.value);



    if (montant === null || montant <= 0) {
      return;
    }



    cheques.push({ montant: arrondirADeuxDecimales(montant) });
    champMontant.value = '';



    afficherListe(conteneur);
    mettreAJourTotaux(conteneur);
    sauvegarderCheques();
  }



  boutonAjouter.addEventListener('click', ajouter);



  champMontant.addEventListener('keydown', (evenement) => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouter();
    }
  });



  afficherListe(conteneur);
  mettreAJourTotaux(conteneur);
}