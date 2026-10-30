/**
 * Fichier : clotures-vesuvio/soir/collecteDonneesClotureSoir.js
 * Rôle : transformer l’état du Soir en données prêtes pour Supabase.
 *
 * Ce module ne lit pas le DOM et ne contient pas de règle de validation.
 */

import { arrondirADeuxDecimales } from '../../core/montants/conversionMontants.js';

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
 * Construit les données de clôture du Soir.
 *
 * @param {Object} etat - État du Soir.
 * @returns {Object} Données prêtes pour l’enregistrement.
 */
export function construireDonneesClotureSoir(etat) {
  return {
    especes: {
      fondCaisse: arrondirADeuxDecimales(etat.especes.fondCaisse),
      totalCompte: arrondirADeuxDecimales(etat.especes.totalCompte),
      adipos: arrondirADeuxDecimales(etat.especes.adipos),
      ecart: arrondirADeuxDecimales(etat.especes.ecart),
    },

    cartes: {
      cbClassique: {
        contact: arrondirADeuxDecimales(etat.cartes.cbClassique.contact),
        sansContact: arrondirADeuxDecimales(
          etat.cartes.cbClassique.sansContact,
        ),
        total: arrondirADeuxDecimales(etat.cartes.cbClassique.total),
      },
      cbTicketRestaurant: {
        contact: arrondirADeuxDecimales(
          etat.cartes.cbTicketRestaurant.contact,
        ),
        sansContact: arrondirADeuxDecimales(
          etat.cartes.cbTicketRestaurant.sansContact,
        ),
        total: arrondirADeuxDecimales(
          etat.cartes.cbTicketRestaurant.total,
        ),
      },
      ancvConnecte: {
        contact: arrondirADeuxDecimales(
          etat.cartes.ancvConnecte.contact,
        ),
        sansContact: arrondirADeuxDecimales(
          etat.cartes.ancvConnecte.sansContact,
        ),
        total: arrondirADeuxDecimales(etat.cartes.ancvConnecte.total),
      },
      amex: {
        contact: arrondirADeuxDecimales(etat.cartes.amex.contact),
        sansContact: arrondirADeuxDecimales(etat.cartes.amex.sansContact),
        total: arrondirADeuxDecimales(etat.cartes.amex.total),
      },
    },

    myPos: {
      paiements: etat.myPos.paiements.map((montant) =>
        arrondirADeuxDecimales(montant),
      ),
      total: arrondirADeuxDecimales(etat.myPos.total),
      nombre: etat.myPos.nombre,
    },

    ancvPapier: {
      nombre10: etat.ancvPapier.nombre10,
      nombre20: etat.ancvPapier.nombre20,
      nombre25: etat.ancvPapier.nombre25,
      nombre50: etat.ancvPapier.nombre50,
      total: arrondirADeuxDecimales(etat.ancvPapier.total),
    },

    cheques: {
      paiements: etat.cheques.paiements.map((montant) =>
        arrondirADeuxDecimales(montant),
      ),
      total: arrondirADeuxDecimales(etat.cheques.total),
      nombre: etat.cheques.nombre,
    },

    frequentation: {
      pizzasSurPlace: etat.frequentation.pizzasSurPlace,
      pizzasEmporter: etat.frequentation.pizzasEmporter,
    },

    tva: {
      ttc55: arrondirADeuxDecimales(etat.tva.ttc55),
      ttc10: arrondirADeuxDecimales(etat.tva.ttc10),
      ttc20: arrondirADeuxDecimales(etat.tva.ttc20),
      total: arrondirADeuxDecimales(etat.tva.total),
    },

    totaux: {
      encaissements: arrondirADeuxDecimales(
        etat.totaux.encaissements,
      ),
      ecartTotal: arrondirADeuxDecimales(etat.totaux.ecartTotal),
    },
  };
}

/**
 * Prépare une clôture complète pour le service Vesuvio.
 *
 * @param {Object} etat - État du Soir.
 * @param {number} etablissementId - Identifiant du Vesuvio.
 * @returns {Object} Clôture prête pour Supabase.
 */
export function preparerClotureSoir(etat, etablissementId) {
  return {
    dateActivite: obtenirDateActivite(),
    service: 'soir',
    etablissementId,
    donnees: construireDonneesClotureSoir(etat),
  };
}