/**
 * Fichier : clotures-vesuvio/midi/gestionClotureMidi.js
 * Rôle : coordonner la saisie, la validation et l’enregistrement du Midi.
 *
 * Ce module utilise les briques core/ et le service Vesuvio.
 * Il ne contient aucune règle de validation métier.
 */

import {
  initialiserVueMidi,
  obtenirElements,
  afficherMessage,
  effacerMessage,
  lireValeur,
  definirVerrouillage,
  reinitialiserVue,
} from './vueMidi.js';

import {
  validerDonneesMidi,
  construireDonneesClotureMidi,
} from './validationClotureMidi.js';

import {
  enregistrerClotureVesuvio,
  validerClotureVesuvio,
} from '../services/serviceClotureJournaliere.js';

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../core/montants/conversionMontants.js';

let paiementsMyPos = [];
let etablissementActif = null;

/**
 * Ajoute un paiement MyPos à la liste.
 */
function ajouterPaiementMyPos() {
  const elements = obtenirElements();
  const montant = convertirEnMontant(elements.myPosSaisie.value);

  if (montant === null || montant <= 0) {
    afficherMessage(
      'MyPos : saisir un montant valide et positif.',
      'erreur',
    );
    return;
  }

  paiementsMyPos.push(arrondirADeuxDecimales(montant));
  elements.myPosSaisie.value = '';

  const element = document.createElement('li');

  element.textContent = `${arrondirADeuxDecimales(montant).toFixed(2)} €`;
  elements.myPosListe.appendChild(element);

  const total = arrondirADeuxDecimales(
    paiementsMyPos.reduce((total, valeur) => total + valeur, 0),
  );

  elements.myPosTotal.textContent = `Total MyPos : ${total.toFixed(2)} €`;
  elements.myPos.value = total.toFixed(2);
}

/**
 * Vide la liste des paiements MyPos.
 */
function viderPaiementsMyPos() {
  paiementsMyPos = [];

  const elements = obtenirElements();

  elements.myPosListe.innerHTML = '';
  elements.myPosTotal.textContent = '';
  elements.myPos.value = '';
}

/**
 * Retourne la date du jour au format ISO.
 *
 * @returns {string} Date au format YYYY-MM-DD.
 */
function obtenirDateActivite() {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
  const jour = String(maintenant.getDate()).padStart(2, '0');

  return `${annee}-${mois}-${jour}`;
}

/**
 * Collecte les données brutes du formulaire.
 *
 * @returns {Object} Données brutes.
 */
function collecterDonneesBrutes() {
  const elements = obtenirElements();

  return {
    myPos: lireValeur(elements.myPosTotal),
    cbClassique: lireValeur(elements.champs.cbClassique),
    cbTicketRestaurant: lireValeur(elements.champs.cbTicketRestaurant),
    cashAdipos: lireValeur(elements.champs.cashAdipos),
    ancvPapier: lireValeur(elements.champs.ancvPapier),
    ancvDematerialise: lireValeur(elements.champs.ancvDematerialise),
    cheques: lireValeur(elements.champs.cheques),
    tva55: lireValeur(elements.champs.tva55),
    tva10: lireValeur(elements.champs.tva10),
    tva20: lireValeur(elements.champs.tva20),
    pizzasSurPlace: lireValeur(elements.champs.pizzasSurPlace),
    pizzasEmporter: lireValeur(elements.champs.pizzasEmporter),
  };
}

/**
 * Valide et enregistre la clôture du Midi.
 */
async function validerCloture() {
  effacerMessage();

  const validation = validerDonneesMidi(collecterDonneesBrutes());

  if (!validation.estValide) {
    const premierErreur = Object.values(validation.erreurs)[0];

    afficherMessage(premierErreur, 'erreur');
    return;
  }

  try {
    afficherMessage('Enregistrement du Midi en cours…', 'info');

    const dateActivite = obtenirDateActivite();
    const donnees = construireDonneesClotureMidi(validation.donnees);

    await enregistrerClotureVesuvio({
      dateActivite,
      service: 'midi',
      donnees,
      etablissementId: etablissementActif,
    });

    await validerClotureVesuvio({
      dateActivite,
      service: 'midi',
      etablissementId: etablissementActif,
    });

    viderPaiementsMyPos();
    reinitialiserVue();
    definirVerrouillage(true);

    afficherMessage(
      'Midi enregistré et validé dans Supabase.',
      'succes',
    );
  } catch (erreur) {
    definirVerrouillage(false);
    afficherMessage(erreur.message, 'erreur');
  }
}

/**
 * Initialise le module Midi.
 *
 * @param {Object} parametres - Paramètres d’initialisation.
 * @param {HTMLElement} parametres.conteneur - Conteneur du Midi.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 */
export function initialiserMidi({ conteneur, etablissementId }) {
  etablissementActif = etablissementId;

  initialiserVueMidi(conteneur);

  const elements = obtenirElements();

  elements.myPosAjouter.addEventListener('click', ajouterPaiementMyPos);
  elements.formulaire.addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    validerCloture();
  });

  definirVerrouillage(false);
}