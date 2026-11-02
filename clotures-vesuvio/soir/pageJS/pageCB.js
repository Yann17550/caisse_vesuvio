/**
 * Fichier : clotures-vesuvio/soir/pageJS/pageCB.js
 * Rôle : page CB du service Soir.
 *
 * CB classique, MyPOS, CB Ticket Restaurant, CB ANCV et AMEX.
 * Chaque paiement MyPOS peut être supprimé.
 * Les saisies sont conservées lors d’un rafraîchissement.
 */


import { pageCBTemplate } from '../templates/pageCBTemplate.js';
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


let paiementsMyPos = [];


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
      champ.value = champ.dataset.previousValue || '';
    }
  });
}


/**
 * Relie un couple contact / sans contact à son total.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {string} prefixe - Préfixe commun des identifiants.
 */
function relierPaireContact(conteneur, prefixe) {
  const champContact = conteneur.querySelector(`#${prefixe}-contact`);
  const champSansContact = conteneur.querySelector(
    `#${prefixe}-no-contact`,
  );
  const elementTotal = conteneur.querySelector(`#${prefixe}-total`);


  function mettreAJourTotal() {
    const total =
      convertirEnMontant(champContact.value) +
      convertirEnMontant(champSansContact.value);


    elementTotal.textContent = formaterEuro(
      arrondirADeuxDecimales(total || 0),
    );
  }


  champContact.addEventListener('input', mettreAJourTotal);
  champSansContact.addEventListener('input', mettreAJourTotal);


  appliquerComportementChamp(champContact);
  appliquerComportementChamp(champSansContact);


  mettreAJourTotal();
}


/**
 * Collecte les valeurs des champs de la page CB.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @returns {Object} Valeurs par identifiant de champ.
 */
function collecterChamps(conteneur) {
  const valeurs = {};


  conteneur.querySelectorAll('input').forEach((champ) => {
    if (champ.id) {
      valeurs[champ.id] = champ.value;
    }
  });


  return valeurs;
}


/**
 * Restaure les valeurs des champs de la page CB.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @param {Object} valeurs - Valeurs par identifiant de champ.
 * @returns {void}
 */
function restaurerChamps(conteneur, valeurs) {
  Object.entries(valeurs).forEach(([idChamp, valeur]) => {
    const champ = conteneur.querySelector(`#${idChamp}`);


    if (champ && typeof valeur === 'string') {
      champ.value = valeur;
    }
  });
}


/**
 * Sauvegarde les champs et la liste MyPos.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 * @returns {void}
 */
function sauvegarderPage(conteneur) {
  sauvegarderSection(
    CLE_BROUILLON,
    'cb-champs',
    collecterChamps(conteneur),
  );


  sauvegarderSection(
    CLE_BROUILLON,
    'cb-mypos',
    paiementsMyPos,
  );
}


/**
 * Affiche la liste des paiements MyPos.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
function afficherListeMyPos(conteneur) {
  const liste = conteneur.querySelector('#soir-card-mypos-list');
  const total = conteneur.querySelector('#soir-card-mypos-total');
  const totalCache = conteneur.querySelector(
    '#soir-card-mypos-total-value',
  );


  liste.innerHTML = '';


  paiementsMyPos.forEach((paiement, index) => {
    const element = document.createElement('li');
    element.className = 'payment-item';


    const montant = document.createElement('span');
    montant.textContent = formaterEuro(paiement.montant);


    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.type = 'button';
    boutonSupprimer.className = 'payment-delete';
    boutonSupprimer.textContent = 'Supprimer';


    boutonSupprimer.addEventListener('click', () => {
      paiementsMyPos.splice(index, 1);
      afficherListeMyPos(conteneur);
      sauvegarderPage(conteneur);
    });


    element.appendChild(montant);
    element.appendChild(boutonSupprimer);
    liste.appendChild(element);
  });


  const totalMontant = arrondirADeuxDecimales(
    paiementsMyPos.reduce(
      (total, paiement) => total + paiement.montant,
      0,
    ),
  );


  total.textContent = formaterEuro(totalMontant);
  totalCache.textContent = formaterEuro(totalMontant);
}


/**
 * Ajoute un paiement MyPos.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
function ajouterPaiementMyPos(conteneur) {
  const champMontant = conteneur.querySelector(
    '#soir-card-mypos-amount',
  );


  const montant = convertirEnMontant(champMontant.value);


  if (montant === null || montant <= 0) {
    return;
  }


  paiementsMyPos.push({
    montant: arrondirADeuxDecimales(montant),
  });


  champMontant.value = '';
  afficherListeMyPos(conteneur);
  sauvegarderPage(conteneur);
}


/**
 * Initialise la page CB.
 *
 * @param {HTMLElement} conteneur - Conteneur de la page.
 */
export function initialiserPageCB(conteneur) {
  conteneur.innerHTML = pageCBTemplate;


  const brouillonChamps = lireSection(
    CLE_BROUILLON,
    'cb-champs',
  );
  const brouillonMyPos = lireSection(
    CLE_BROUILLON,
    'cb-mypos',
  );


  paiementsMyPos = Array.isArray(brouillonMyPos)
    ? brouillonMyPos
    : [];


  if (brouillonChamps && typeof brouillonChamps === 'object') {
    restaurerChamps(conteneur, brouillonChamps);
  }


  relierPaireContact(conteneur, 'soir-card-classic');
  relierPaireContact(conteneur, 'soir-card-tr');
  relierPaireContact(conteneur, 'soir-card-ancv');
  relierPaireContact(conteneur, 'soir-card-amex');


  const champMyPos = conteneur.querySelector(
    '#soir-card-mypos-amount',
  );
  const boutonMyPos = conteneur.querySelector('#soir-card-mypos-add');


  appliquerComportementChamp(champMyPos);


  boutonMyPos.addEventListener('click', () => {
    ajouterPaiementMyPos(conteneur);
  });


  champMyPos.addEventListener('keydown', (evenement) => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouterPaiementMyPos(conteneur);
    }
  });


  conteneur.addEventListener('input', () => {
    sauvegarderPage(conteneur);
  });


  afficherListeMyPos(conteneur);
  sauvegarderPage(conteneur);
}