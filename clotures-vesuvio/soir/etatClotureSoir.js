/**
 * Fichier : clotures-vesuvio/soir/etatClotureSoir.js
 * Rôle : source de vérité des données de la clôture du Soir.
 *
 * Ce module ne lit pas le DOM et ne connaît pas Supabase.
 * Les pages du Soir mettent à jour cet état.
 */

import { arrondirADeuxDecimales } from '../../core/montants/conversionMontants.js';

/**
 * Crée l’état initial du Soir.
 *
 * @returns {Object} État initial.
 */
export function creerEtatSoir() {
  return {
    especes: {
      fondCaisse: 0,
      totalCompte: 0,
      adipos: 0,
      ecart: 0,
    },

    cartes: {
      cbClassique: {
        contact: 0,
        sansContact: 0,
        total: 0,
      },
      cbTicketRestaurant: {
        contact: 0,
        sansContact: 0,
        total: 0,
      },
      ancvConnecte: {
        contact: 0,
        sansContact: 0,
        total: 0,
      },
      amex: {
        contact: 0,
        sansContact: 0,
        total: 0,
      },
    },

    myPos: {
      paiements: [],
      total: 0,
      nombre: 0,
    },

    ancvPapier: {
      nombre10: 0,
      nombre20: 0,
      nombre25: 0,
      nombre50: 0,
      total: 0,
    },

    cheques: {
      paiements: [],
      total: 0,
      nombre: 0,
    },

    frequentation: {
      pizzasSurPlace: 0,
      pizzasEmporter: 0,
    },

    tva: {
      ttc55: 0,
      ttc10: 0,
      ttc20: 0,
      total: 0,
    },

    totaux: {
      encaissements: 0,
      ecartTotal: 0,
    },
  };
}

/**
 * Met à jour une valeur numérique de l’état.
 *
 * @param {Object} etat - État du Soir.
 * @param {string} chemin - Chemin de la valeur, par exemple "especes.adipos".
 * @param {number} valeur - Nouvelle valeur.
 */
export function definirValeur(etat, chemin, valeur) {
  const parties = chemin.split('.');
  let cible = etat;

  for (let index = 0; index < parties.length - 1; index += 1) {
    cible = cible[parties[index]];

    if (!cible) {
      return;
    }
  }

  const derniereCle = parties[parties.length - 1];

  cible[derniereCle] = arrondirADeuxDecimales(valeur);
}

/**
 * Recalcule les totaux dérivés du Soir.
 *
 * Règle métier : MyPOS est exclu du total des encaissements.
 *
 * @param {Object} etat - État du Soir.
 */
export function recalculerTotauxSoir(etat) {
  etat.especes.ecart = arrondirADeuxDecimales(
    etat.especes.totalCompte - etat.especes.adipos,
  );

  etat.cartes.cbClassique.total = arrondirADeuxDecimales(
    etat.cartes.cbClassique.contact + etat.cartes.cbClassique.sansContact,
  );

  etat.cartes.cbTicketRestaurant.total = arrondirADeuxDecimales(
    etat.cartes.cbTicketRestaurant.contact +
      etat.cartes.cbTicketRestaurant.sansContact,
  );

  etat.cartes.ancvConnecte.total = arrondirADeuxDecimales(
    etat.cartes.ancvConnecte.contact +
      etat.cartes.ancvConnecte.sansContact,
  );

  etat.cartes.amex.total = arrondirADeuxDecimales(
    etat.cartes.amex.contact + etat.cartes.amex.sansContact,
  );

  etat.myPos.total = arrondirADeuxDecimales(
    etat.myPos.paiements.reduce((total, montant) => total + montant, 0),
  );
  etat.myPos.nombre = etat.myPos.paiements.length;

  etat.ancvPapier.total = arrondirADeuxDecimales(
    etat.ancvPapier.nombre10 * 10 +
      etat.ancvPapier.nombre20 * 20 +
      etat.ancvPapier.nombre25 * 25 +
      etat.ancvPapier.nombre50 * 50,
  );

  etat.cheques.total = arrondirADeuxDecimales(
    etat.cheques.paiements.reduce((total, montant) => total + montant, 0),
  );
  etat.cheques.nombre = etat.cheques.paiements.length;

  etat.tva.total = arrondirADeuxDecimales(
    etat.tva.ttc55 + etat.tva.ttc10 + etat.tva.ttc20,
  );

  etat.totaux.encaissements = arrondirADeuxDecimales(
    etat.especes.adipos +
      etat.cartes.cbClassique.total +
      etat.cartes.cbTicketRestaurant.total +
      etat.cartes.ancvConnecte.total +
      etat.cartes.amex.total +
      etat.ancvPapier.total +
      etat.cheques.total,
  );

  etat.totaux.ecartTotal = arrondirADeuxDecimales(
    etat.especes.ecart + etat.myPos.total,
  );
}

/**
 * Ajoute un paiement MyPos.
 *
 * @param {Object} etat - État du Soir.
 * @param {number} montant - Montant du paiement.
 */
export function ajouterPaiementMyPos(etat, montant) {
  etat.myPos.paiements.push(arrondirADeuxDecimales(montant));
  recalculerTotauxSoir(etat);
}

/**
 * Ajoute un chèque.
 *
 * @param {Object} etat - État du Soir.
 * @param {number} montant - Montant du chèque.
 */
export function ajouterCheque(etat, montant) {
  etat.cheques.paiements.push(arrondirADeuxDecimales(montant));
  recalculerTotauxSoir(etat);
}

/**
 * Réinitialise l’état du Soir.
 *
 * @param {Object} etat - État à réinitialiser.
 */
export function reinitialiserEtatSoir(etat) {
  Object.assign(etat, creerEtatSoir());
}