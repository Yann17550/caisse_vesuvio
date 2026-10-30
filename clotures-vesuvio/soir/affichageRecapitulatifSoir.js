/**
 * Fichier : clotures-vesuvio/soir/affichageRecapitulatifSoir.js
 * Rôle : afficher le récapitulatif du Soir.
 *
 * Ce module lit l’état du Soir, pas le DOM.
 */

import { formaterEuro } from '../../core/interface/formatageEuro.js';

/**
 * Retourne les lignes du récapitulatif.
 *
 * @param {Object} etat - État du Soir.
 * @returns {Array} Lignes à afficher.
 */
export function construireLignesRecapitulatif(etat) {
  return [
    {
      libelle: 'Espèces Adipos',
      valeur: etat.especes.adipos,
    },
    {
      libelle: 'CB classique',
      valeur: etat.cartes.cbClassique.total,
    },
    {
      libelle: 'CB Ticket Restaurant',
      valeur: etat.cartes.cbTicketRestaurant.total,
    },
    {
      libelle: 'ANCV connecté',
      valeur: etat.cartes.ancvConnecte.total,
    },
    {
      libelle: 'AMEX',
      valeur: etat.cartes.amex.total,
    },
    {
      libelle: 'ANCV papier',
      valeur: etat.ancvPapier.total,
    },
    {
      libelle: 'Chèques',
      valeur: etat.cheques.total,
    },
    {
      libelle: 'MyPOS',
      valeur: etat.myPos.total,
    },
  ];
}

/**
 * Affiche le récapitulatif dans un conteneur.
 *
 * @param {HTMLElement|null} conteneur - Conteneur du récapitulatif.
 * @param {Object} etat - État du Soir.
 */
export function afficherRecapitulatifSoir(conteneur, etat) {
  if (!conteneur) {
    return;
  }

  const lignes = construireLignesRecapitulatif(etat);

  const lignesHtml = lignes
    .map(
      (ligne) => `
        <div class="recap-ligne">
          <span>${ligne.libelle}</span>
          <strong>${formaterEuro(ligne.valeur)}</strong>
        </div>
      `,
    )
    .join('');

  conteneur.innerHTML = `
    <div class="recap-bloc">
      ${lignesHtml}
    </div>

    <div class="recap-bloc">
      <div class="recap-ligne">
        <span>Total encaissements hors MyPOS</span>
        <strong>${formaterEuro(etat.totaux.encaissements)}</strong>
      </div>

      <div class="recap-ligne">
        <span>TVA TTC totale</span>
        <strong>${formaterEuro(etat.tva.total)}</strong>
      </div>

      <div class="recap-ligne">
        <span>Écart total</span>
        <strong>${formaterEuro(etat.totaux.ecartTotal)}</strong>
      </div>
    </div>
  `;
}

/**
 * Met à jour les indicateurs du titre du récapitulatif.
 *
 * @param {Object} etat - État du Soir.
 */
export function mettreAJourTitreRecapitulatif(etat) {
  const titre = document.getElementById('soir-titre-page');

  if (!titre) {
    return;
  }

  titre.innerHTML = `
    Récapitulatif — TVA TTC :
    <strong>${formaterEuro(etat.tva.total)}</strong>
    — Écart :
    <strong>${formaterEuro(etat.totaux.ecartTotal)}</strong>
  `;
}