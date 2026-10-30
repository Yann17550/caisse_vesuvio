/**
 * Fichier : clotures-vesuvio/midi/validationClotureMidi.js
 * Rôle : valider les données du service Midi du Vesuvio
 * et construire les données à enregistrer dans Supabase.
 *
 * Règle métier :
 * - Tous les montants sont positifs ou nuls,
 *   sauf Espèces Adipos, qui peut être négatif
 *   pour permettre une correction d’espèces.
 * - Les quantités de pizzas sont des entiers positifs ou nuls.
 * - CA encaissé hors MyPOS = somme des TVA TTC.
 *
 * Ce module ne dépend ni du DOM ni de Supabase.
 *
 * Dépendances :
 * - core/montants/conversionMontants.js
 */

import {
  convertirEnMontant,
  arrondirADeuxDecimales,
} from '../../core/montants/conversionMontants.js';

const CHAMPS_MONTANTS_POSITIFS = [
  'cbClassique',
  'cbTicketRestaurant',
  'ancvPapier',
  'ancvDematerialise',
  'cheques',
  'tva55',
  'tva10',
  'tva20',
];

const CHAMPS_ENTIERS = [
  'pizzasSurPlace',
  'pizzasEmporter',
];

const LIBELLES = {
  myPos: 'CB MyPos',
  cbClassique: 'CB classique',
  cbTicketRestaurant: 'CB Ticket Restaurant',
  cashAdipos: 'Espèces Adipos',
  ancvPapier: 'ANCV papier',
  ancvDematerialise: 'ANCV dématérialisé',
  cheques: 'Chèques',
  tva55: 'TVA 5,5 %',
  tva10: 'TVA 10 %',
  tva20: 'TVA 20 %',
  pizzasSurPlace: 'Pizzas sur place',
  pizzasEmporter: 'Pizzas à emporter',
};

const TOLERANCE_COHERENCE = 0.005;

/**
 * Valide un montant positif ou nul.
 *
 * @param {string|number|null} valeur - Valeur saisie.
 * @param {string} libelle - Libellé du champ.
 * @returns {{valeur: number|null, erreur: string|null}} Résultat.
 */
function validerMontantPositifOuNul(valeur, libelle) {
  if (valeur === '' || valeur === null || valeur === undefined) {
    return { valeur: 0, erreur: null };
  }

  const montant = convertirEnMontant(valeur);

  if (montant === null) {
    return {
      valeur: null,
      erreur: `${libelle} : veuillez saisir un montant valide.`,
    };
  }

  if (montant < 0) {
    return {
      valeur: null,
      erreur: `${libelle} : le montant ne peut pas être négatif.`,
    };
  }

  return {
    valeur: arrondirADeuxDecimales(montant),
    erreur: null,
  };
}

/**
 * Valide un montant qui peut être négatif.
 *
 * @param {string|number|null} valeur - Valeur saisie.
 * @param {string} libelle - Libellé du champ.
 * @returns {{valeur: number|null, erreur: string|null}} Résultat.
 */
function validerMontantCorrection(valeur, libelle) {
  if (valeur === '' || valeur === null || valeur === undefined) {
    return { valeur: 0, erreur: null };
  }

  const montant = convertirEnMontant(valeur);

  if (montant === null) {
    return {
      valeur: null,
      erreur: `${libelle} : veuillez saisir un montant valide.`,
    };
  }

  return {
    valeur: arrondirADeuxDecimales(montant),
    erreur: null,
  };
}

/**
 * Valide un entier positif ou nul.
 *
 * @param {string|number|null} valeur - Valeur saisie.
 * @param {string} libelle - Libellé du champ.
 * @returns {{valeur: number|null, erreur: string|null}} Résultat.
 */
function validerEntierPositifOuNul(valeur, libelle) {
  if (valeur === '' || valeur === null || valeur === undefined) {
    return { valeur: 0, erreur: null };
  }

  const nombre = convertirEnMontant(valeur);

  if (nombre === null) {
    return {
      valeur: null,
      erreur: `${libelle} : veuillez saisir un nombre valide.`,
    };
  }

  if (!Number.isInteger(nombre)) {
    return {
      valeur: null,
      erreur: `${libelle} : la valeur doit être un nombre entier.`,
    };
  }

  if (nombre < 0) {
    return {
      valeur: null,
      erreur: `${libelle} : la valeur ne peut pas être négative.`,
    };
  }

  return { valeur: nombre, erreur: null };
}

/**
 * Valide les données brutes du service Midi.
 *
 * @param {Object} donneesBrutes - Valeurs brutes du formulaire.
 * @returns {{
 *   estValide: boolean,
 *   donnees: Object|null,
 *   erreurs: Object
 * }} Résultat de validation.
 */
export function validerDonneesMidi(donneesBrutes) {
  const erreurs = {};
  const donnees = {};

  const myPos = convertirEnMontant(donneesBrutes.myPos);

  if (myPos === null || myPos < 0) {
    erreurs.myPos = `${LIBELLES.myPos} : le total des paiements est invalide.`;
  } else {
    donnees.myPos = arrondirADeuxDecimales(myPos);
  }

  CHAMPS_MONTANTS_POSITIFS.forEach((champ) => {
    const resultat = validerMontantPositifOuNul(
      donneesBrutes[champ],
      LIBELLES[champ],
    );

    if (resultat.erreur) {
      erreurs[champ] = resultat.erreur;
    } else {
      donnees[champ] = resultat.valeur;
    }
  });

  const resultatAdipos = validerMontantCorrection(
    donneesBrutes.cashAdipos,
    LIBELLES.cashAdipos,
  );

  if (resultatAdipos.erreur) {
    erreurs.cashAdipos = resultatAdipos.erreur;
  } else {
    donnees.cashAdipos = resultatAdipos.valeur;
  }

  CHAMPS_ENTIERS.forEach((champ) => {
    const resultat = validerEntierPositifOuNul(
      donneesBrutes[champ],
      LIBELLES[champ],
    );

    if (resultat.erreur) {
      erreurs[champ] = resultat.erreur;
    } else {
      donnees[champ] = resultat.valeur;
    }
  });

  if (Object.keys(erreurs).length === 0) {
    const totalEncaisse =
      donnees.cbClassique +
      donnees.cbTicketRestaurant +
      donnees.cashAdipos +
      donnees.ancvPapier +
      donnees.ancvDematerialise +
      donnees.cheques;

    const totalTva =
      donnees.tva55 +
      donnees.tva10 +
      donnees.tva20;

    const ecart = totalEncaisse - totalTva;

    if (Math.abs(ecart) > TOLERANCE_COHERENCE) {
      erreurs.coherenceTva =
        `Incohérence : CA encaissé ${arrondirADeuxDecimales(totalEncaisse).toFixed(2)} € ` +
        `≠ TVA TTC ${arrondirADeuxDecimales(totalTva).toFixed(2)} € ` +
        `(écart ${arrondirADeuxDecimales(ecart).toFixed(2)} €).`;
    }
  }

  const estValide = Object.keys(erreurs).length === 0;

  return {
    estValide,
    donnees: estValide ? donnees : null,
    erreurs,
  };
}

/**
 * Construit les données à enregistrer dans Supabase.
 *
 * @param {Object} donneesValidees - Données validées.
 * @returns {Object} Données au format de la table daily_closings.
 */
export function construireDonneesClotureMidi(donneesValidees) {
  return {
    mypos: donneesValidees.myPos,
    cb_classic: donneesValidees.cbClassique,
    cb_ticket_resto: donneesValidees.cbTicketRestaurant,
    cash_adipos: donneesValidees.cashAdipos,
    ancv_paper: donneesValidees.ancvPapier,
    ancv_connect: donneesValidees.ancvDematerialise,
    checks_total: donneesValidees.cheques,
    vat_5_5: donneesValidees.tva55,
    vat_10: donneesValidees.tva10,
    vat_20: donneesValidees.tva20,
    pizzas_dine_in: donneesValidees.pizzasSurPlace,
    pizzas_takeaway: donneesValidees.pizzasEmporter,
  };
}