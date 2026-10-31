/**
 * Fichier : clotures-vesuvio/midi/pageMidi.js
 * Rôle : page unique du service Midi.
 *
 * Reprend la physionomie et l’UX de l’ancien Midi :
 * saisie en deux colonnes, MyPOS paiement par paiement,
 * effacement au focus et restauration au blur.
 */

import { pageMidiTemplate } from './templates/pageMidiTemplate.js';
import {
  ajouterComportementEffacerRestaurer,
} from '../../core/interface/comportementChampTexte.js';

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../core/montants/conversionMontants.js';

import { formaterEuro } from '../../core/interface/formatageEuro.js';

import {
  calculerTotauxMidi,
} from './calculMidi.js';

import {
  afficherMessageMidi,
  effacerMessageMidi,
} from './recapMidi.js';

import {
  validerEtEnregistrerMidi,
} from './clotureMidi.js';

let paiementsMyPos = [];
let etablissementActif = null;


/**
 * Retourne les éléments du formulaire.
 *
 * @param {HTMLElement} conteneur - Conteneur du Midi.
 * @returns {Object} Éléments DOM.
 */
function obtenirElements(conteneur) {
  return {
    formulaire: conteneur.querySelector('#midi-form'),
    message: conteneur.querySelector('#midi-form-message'),
    boutonValider: conteneur.querySelector('#midi-validate-button'),

    champCbClassique: conteneur.querySelector('#midi-cb-classic'),
    champCbTicketResto: conteneur.querySelector('#midi-cb-ticket-resto'),
    champCashAdipos: conteneur.querySelector('#midi-cash-adipos'),
    champAncvPaper: conteneur.querySelector('#midi-ancv-paper'),
    champAncvConnect: conteneur.querySelector('#midi-ancv-connect'),
    champChecks: conteneur.querySelector('#midi-checks'),

    champMyPos: conteneur.querySelector('#midi-mypos-amount'),
    boutonMyPos: conteneur.querySelector('#midi-mypos-add-button'),
    listeMyPos: conteneur.querySelector('#midi-mypos-list'),
    totalMyPos: conteneur.querySelector('#midi-mypos-total'),

    champTva55: conteneur.querySelector('#midi-vat-5-5'),
    champTva10: conteneur.querySelector('#midi-vat-10'),
    champTva20: conteneur.querySelector('#midi-vat-20'),

    champPizzasEmporter: conteneur.querySelector('#midi-pizzas-takeaway'),
    champCouverts: conteneur.querySelector('#midi-pizzas-dine-in'),
  };
}

/**
 * Ajoute le comportement UX à tous les champs.
 *
 * @param {Object} elements - Éléments du formulaire.
 */
function appliquerComportementChamps(elements) {
  const champsMontants = [
    elements.champCbClassique,
    elements.champCbTicketResto,
    elements.champCashAdipos,
    elements.champAncvPaper,
    elements.champAncvConnect,
    elements.champChecks,
    elements.champTva55,
    elements.champTva10,
    elements.champTva20,
  ];

  champsMontants.forEach((champ) => {
    ajouterComportementEffacerRestaurer(champ, '0,00');
  });

  ajouterComportementEffacerRestaurer(
    elements.champPizzasEmporter,
    '0',
  );

  ajouterComportementEffacerRestaurer(
    elements.champCouverts,
    '0',
  );
}

/**
 * Affiche la liste des paiements MyPos.
 *
 * @param {Object} elements - Éléments du formulaire.
 */
function afficherListeMyPos(elements) {
  elements.listeMyPos.innerHTML = '';

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
      afficherListeMyPos(elements);
      mettreAJourTotalMyPos(elements);
    });

    element.appendChild(montant);
    element.appendChild(boutonSupprimer);
    elements.listeMyPos.appendChild(element);
  });
}

/**
 * Met à jour le total MyPos.
 *
 * @param {Object} elements - Éléments du formulaire.
 */
function mettreAJourTotalMyPos(elements) {
  const total = paiementsMyPos.reduce(
    (total, paiement) => total + paiement.montant,
    0,
  );

  elements.totalMyPos.textContent = formaterEuro(
    arrondirADeuxDecimales(total),
  );
}

/**
 * Ajoute un paiement MyPos.
 *
 * @param {Object} elements - Éléments du formulaire.
 */
function ajouterPaiementMyPos(elements) {
  const montant = convertirEnMontant(elements.champMyPos.value);

  if (montant === null || montant <= 0) {
    afficherMessageMidi(
      'MyPos : saisir un montant valide et positif.',
      'erreur',
    );
    return;
  }

  paiementsMyPos.push({
    montant: arrondirADeuxDecimales(montant),
  });

  elements.champMyPos.value = '';
  afficherListeMyPos(elements);
  mettreAJourTotalMyPos(elements);
  effacerMessageMidi();
}

/**
 * Collecte les données du formulaire.
 *
 * @param {Object} elements - Éléments du formulaire.
 * @returns {Object} Données brutes.
 */
function collecterDonnees(elements) {
  return {
    myPosTotal: paiementsMyPos.reduce(
      (total, paiement) => total + paiement.montant,
      0,
    ),
    cbClassique: elements.champCbClassique.value,
    cbTicketResto: elements.champCbTicketResto.value,
    cashAdipos: elements.champCashAdipos.value,
    ancvPaper: elements.champAncvPaper.value,
    ancvConnect: elements.champAncvConnect.value,
    checks: elements.champChecks.value,
    vat55: elements.champTva55.value,
    vat10: elements.champTva10.value,
    vat20: elements.champTva20.value,
    pizzasDineIn: elements.champCouverts.value,
    pizzasTakeaway: elements.champPizzasEmporter.value,
  };
}

/**
 * Verrouille ou déverrouille le formulaire.
 *
 * @param {Object} elements - Éléments du formulaire.
 * @param {boolean} verrouille - true pour verrouiller.
 */
function definirVerrouillage(elements, verrouille) {
  elements.formulaire
    .querySelectorAll('input, button')
    .forEach((element) => {
      if (element.id !== 'midi-mypos-amount') {
        element.disabled = verrouille;
      }
    });
}

/**
 * Remet le formulaire à zéro.
 *
 * @param {Object} elements - Éléments du formulaire.
 */
function reinitialiserPage(elements) {
  paiementsMyPos = [];
  afficherListeMyPos(elements);
  mettreAJourTotalMyPos(elements);

  elements.formulaire.reset();

  elements.champCbClassique.value = '0,00';
  elements.champCbTicketResto.value = '0,00';
  elements.champCashAdipos.value = '0,00';
  elements.champAncvPaper.value = '0,00';
  elements.champAncvConnect.value = '0,00';
  elements.champChecks.value = '0,00';
  elements.champTva55.value = '0,00';
  elements.champTva10.value = '0,00';
  elements.champTva20.value = '0,00';
  elements.champPizzasEmporter.value = '0';
  elements.champCouverts.value = '0';
}

/**
 * Valide puis enregistre le Midi.
 *
 * @param {Object} elements - Éléments du formulaire.
 */
async function validerMidi(elements) {
  effacerMessageMidi();

  const donnees = collecterDonnees(elements);
  const totaux = calculerTotauxMidi(donnees);

  const resultat = await validerEtEnregistrerMidi({
    donnees,
    totaux,
    etablissementId: etablissementActif,
  });

  if (!resultat.succes) {
    afficherMessageMidi(resultat.message, 'erreur');
    return;
  }

  reinitialiserPage(elements);
  definirVerrouillage(elements, true);

  afficherMessageMidi(
    'Midi enregistré et validé dans Supabase.',
    'succes',
  );
}

/**
 * Initialise la page Midi.
 *
 * @param {Object} parametres - Paramètres.
 * @param {HTMLElement} parametres.conteneur - Conteneur du Midi.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 */
export function initialiserPageMidi({ conteneur, etablissementId }) {
  etablissementActif = etablissementId;
  paiementsMyPos = [];

  conteneur.innerHTML = pageMidiTemplate;

  const elements = obtenirElements(conteneur);

  appliquerComportementChamps(elements);

  elements.boutonMyPos.addEventListener('click', () => {
    ajouterPaiementMyPos(elements);
  });

  elements.champMyPos.addEventListener('keydown', (evenement) => {
    if (evenement.key === 'Enter') {
      evenement.preventDefault();
      ajouterPaiementMyPos(elements);
    }
  });

  elements.formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    validerMidi(elements);
  });

  afficherListeMyPos(elements);
  mettreAJourTotalMyPos(elements);
  definirVerrouillage(elements, false);
}