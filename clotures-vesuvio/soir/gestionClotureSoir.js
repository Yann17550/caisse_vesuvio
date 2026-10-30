/**
 * Fichier : clotures-vesuvio/soir/gestionClotureSoir.js
 * Rôle : coordonner la clôture du Soir.
 *
 * Ce module assemble l’état, la vue, la navigation, les pages,
 * la validation et l’enregistrement Supabase.
 * Il ne contient aucune règle de validation métier.
 */

import {
  creerEtatSoir,
  recalculerTotauxSoir,
  reinitialiserEtatSoir,
} from './etatClotureSoir.js';

import {
  initialiserVueSoir,
  obtenirElementsSoir,
  afficherPageSoir,
  obtenirPageActive,
  obtenirConteneurPage,
} from './vueSoir.js';

import {
  initialiserNavigationSoir,
} from './navigationServiceSoir.js';

import {
  validerClotureSoir,
  obtenirPremiereErreur,
} from './validationClotureSoir.js';

import {
  preparerClotureSoir,
} from './collecteDonneesClotureSoir.js';

import {
  enregistrerClotureVesuvio,
  validerClotureVesuvio,
} from '../services/serviceClotureJournaliere.js';

import {
  initialiserPageCartes,
} from './pages/pageCartesBancaires.js';

import {
  initialiserPageEspeces,
} from './pages/pageEspeces.js';

import {
  initialiserPageAncv,
} from './pages/pageAncv.js';

import {
  initialiserPageCheques,
} from './pages/pageCheques.js';

import {
  initialiserPageRecapitulatif,
} from './pages/pageRecapitulatif.js';

let etatSoir = null;
let etablissementActif = null;
let boutonValidation = null;

/**
 * Affiche un message dans la page Récapitulatif.
 *
 * @param {string} texte - Message à afficher.
 * @param {'info'|'succes'|'erreur'} type - Type de message.
 */
function afficherMessage(texte, type = 'info') {
  const conteneurRecap = obtenirConteneurPage('recapitulatif');

  if (!conteneurRecap) {
    return;
  }

  let elementMessage = conteneurRecap.querySelector('#soir-message');

  if (!elementMessage) {
    elementMessage = document.createElement('p');
    elementMessage.id = 'soir-message';
    conteneurRecap.appendChild(elementMessage);
  }

  elementMessage.textContent = texte;
  elementMessage.className = `message message-${type}`;
}

/**
 * Efface le message affiché dans le Récapitulatif.
 */
function effacerMessage() {
  const conteneurRecap = obtenirConteneurPage('recapitulatif');
  const elementMessage = conteneurRecap?.querySelector('#soir-message');

  if (elementMessage) {
    elementMessage.textContent = '';
    elementMessage.className = 'message';
  }
}

/**
 * Contrôle la sortie de la page Espèces.
 *
 * @param {Object} parametres - Paramètres de navigation.
 * @param {string} parametres.pageDepart - Page quittée.
 * @param {string} parametres.pageArrivee - Page ciblée.
 * @returns {boolean} true si la navigation est autorisée.
 */
function controlerSortiePage({ pageDepart, pageArrivee }) {
  if (pageDepart !== 'especes' || pageArrivee === 'especes') {
    return true;
  }

  const validation = validerClotureSoir(etatSoir);
  const erreursEspeces = [
    'fondCaisse',
    'totalCompte',
    'adipos',
    'ecartEspeces',
  ].some((cle) => Boolean(validation.erreurs[cle]));

  if (erreursEspeces) {
    afficherMessage(
      'Espèces : corriger les erreurs avant de quitter la page.',
      'erreur',
    );
    return false;
  }

  return true;
}

/**
 * Crée le bouton de validation dans le Récapitulatif.
 */
function creerBoutonValidation() {
  const conteneurRecap = obtenirConteneurPage('recapitulatif');

  if (!conteneurRecap || boutonValidation) {
    return;
  }

  boutonValidation = document.createElement('button');
  boutonValidation.type = 'button';
  boutonValidation.id = 'soir-valider';
  boutonValidation.textContent = 'Valider le Soir';

  boutonValidation.addEventListener('click', validerEtEnregistrer);

  conteneurRecap.appendChild(boutonValidation);
}

/**
 * Valide puis enregistre la clôture du Soir.
 */
async function validerEtEnregistrer() {
  effacerMessage();

  recalculerTotauxSoir(etatSoir);

  const validation = validerClotureSoir(etatSoir);

  if (!validation.estValide) {
    afficherMessage(obtenirPremiereErreur(validation), 'erreur');
    return;
  }

  try {
    afficherMessage('Enregistrement du Soir en cours…', 'info');

    const clôture = preparerClotureSoir(
      etatSoir,
      etablissementActif,
    );

    await enregistrerClotureVesuvio(clôture);

    await validerClotureVesuvio({
      dateActivite: clôture.dateActivite,
      service: 'soir',
      etablissementId: etablissementActif,
    });

    reinitialiserEtatSoir(etatSoir);
    recalculerTotauxSoir(etatSoir);

    afficherPageSoir('cartes');

    afficherMessage(
      'Soir enregistré et validé dans Supabase.',
      'succes',
    );
  } catch (erreur) {
    afficherMessage(erreur.message, 'erreur');
  }
}

/**
 * Initialise les pages du Soir.
 */
function initialiserPages() {
  initialiserPageCartes(
    obtenirConteneurPage('cartes'),
    etatSoir,
  );

  initialiserPageEspeces(
    obtenirConteneurPage('especes'),
    etatSoir,
  );

  initialiserPageAncv(
    obtenirConteneurPage('ancv'),
    etatSoir,
  );

  initialiserPageCheques(
    obtenirConteneurPage('cheques'),
    etatSoir,
  );

  initialiserPageRecapitulatif(
    obtenirConteneurPage('recapitulatif'),
    etatSoir,
  );

  creerBoutonValidation();
}

/**
 * Initialise le module Soir.
 *
 * @param {Object} parametres - Paramètres d’initialisation.
 * @param {HTMLElement} parametres.conteneur - Conteneur du Soir.
 * @param {number} parametres.etablissementId - Identifiant du Vesuvio.
 */
export function initialiserSoir({ conteneur, etablissementId }) {
  etablissementActif = etablissementId;
  etatSoir = creerEtatSoir();

  initialiserVueSoir(conteneur);
  initialiserPages();

  initialiserNavigationSoir({
    gardeSortie: controlerSortiePage,
  });

  afficherPageSoir('cartes');
}

/**
 * Retourne l’état courant du Soir.
 *
 * @returns {Object|null} État courant.
 */
export function obtenirEtatSoir() {
  return etatSoir;
}

/**
 * Retourne la page actuellement affichée.
 *
 * @returns {string|null} Page active.
 */
export function obtenirPageSoirActive() {
  return obtenirPageActive();
}