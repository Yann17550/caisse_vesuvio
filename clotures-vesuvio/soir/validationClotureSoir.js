/**
 * Fichier : clotures-vesuvio/soir/validationClotureSoir.js
 * Rôle : valider les données de la clôture du Soir.
 *
 * Toutes les règles métier sont centralisées ici.
 * Ce module ne lit pas le DOM.
 */

import { convertirEnMontant } from '../../core/montants/conversionMontants.js';

/**
 * Vérifie qu’un montant est valide.
 *
 * @param {*} valeur - Valeur à vérifier.
 * @returns {boolean} true si le montant est valide.
 */
function estMontantValide(valeur) {
  return typeof valeur === 'number' && Number.isFinite(valeur) && valeur >= 0;
}

/**
 * Vérifie qu’un entier est valide.
 *
 * @param {*} valeur - Valeur à vérifier.
 * @returns {boolean} true si l’entier est valide.
 */
function estEntierValide(valeur) {
  return (
    typeof valeur === 'number' &&
    Number.isInteger(valeur) &&
    valeur >= 0
  );
}

/**
 * Valide les données de la clôture du Soir.
 *
 * @param {Object} etat - État du Soir.
 * @returns {Object} Résultat de validation.
 */
export function validerClotureSoir(etat) {
  const erreurs = {};

  if (!estMontantValide(etat.especes.fondCaisse)) {
    erreurs.fondCaisse = 'Espèces : le fond de caisse doit être un montant positif.';
  }

  if (!estMontantValide(etat.especes.totalCompte)) {
    erreurs.totalCompte = 'Espèces : le total compté doit être un montant positif.';
  }

  if (!estMontantValide(etat.especes.adipos)) {
    erreurs.adipos = 'Espèces : le montant Adipos doit être un montant positif.';
  }

  if (
    estMontantValide(etat.especes.totalCompte) &&
    estMontantValide(etat.especes.adipos) &&
    etat.especes.totalCompte < etat.especes.adipos
  ) {
    erreurs.ecartEspeces =
      'Espèces : le total compté ne peut pas être inférieur au montant Adipos.';
  }

  const cartes = [
    'cbClassique',
    'cbTicketRestaurant',
    'ancvConnecte',
    'amex',
  ];

  cartes.forEach((carte) => {
    const donneesCarte = etat.cartes[carte];

    if (!estMontantValide(donneesCarte.contact)) {
      erreurs[`${carte}-contact`] =
        'CB : les montants contact doivent être positifs.';
    }

    if (!estMontantValide(donneesCarte.sansContact)) {
      erreurs[`${carte}-sansContact`] =
        'CB : les montants sans contact doivent être positifs.';
    }
  });

  if (!Array.isArray(etat.myPos.paiements)) {
    erreurs.myPos = 'MyPos : la liste des paiements est invalide.';
  } else {
    const paiementInvalide = etat.myPos.paiements.some(
      (montant) => !estMontantValide(montant) || montant <= 0,
    );

    if (paiementInvalide) {
      erreurs.myPos =
        'MyPos : chaque paiement doit être un montant positif.';
    }
  }

  const denominations = [
    'nombre10',
    'nombre20',
    'nombre25',
    'nombre50',
  ];

  denominations.forEach((denomination) => {
    if (!estEntierValide(etat.ancvPapier[denomination])) {
      erreurs[denomination] =
        'ANCV papier : les nombres de coupons doivent être des entiers positifs.';
    }
  });

  if (!Array.isArray(etat.cheques.paiements)) {
    erreurs.cheques = 'Chèques : la liste des chèques est invalide.';
  } else {
    const chequeInvalide = etat.cheques.paiements.some(
      (montant) => !estMontantValide(montant) || montant <= 0,
    );

    if (chequeInvalide) {
      erreurs.cheques =
        'Chèques : chaque chèque doit être un montant positif.';
    }
  }

  if (!estEntierValide(etat.frequentation.pizzasSurPlace)) {
    erreurs.pizzasSurPlace =
      'Pizzas : le nombre sur place doit être un entier positif.';
  }

  if (!estEntierValide(etat.frequentation.pizzasEmporter)) {
    erreurs.pizzasEmporter =
      'Pizzas : le nombre à emporter doit être un entier positif.';
  }

  const tvas = ['ttc55', 'ttc10', 'ttc20'];

  tvas.forEach((tva) => {
    if (!estMontantValide(etat.tva[tva])) {
      erreurs[tva] = 'TVA : les montants doivent être positifs.';
    }
  });

  return {
    estValide: Object.keys(erreurs).length === 0,
    erreurs,
  };
}

/**
 * Retourne la première erreur de validation.
 *
 * @param {Object} resultat - Résultat de validation.
 * @returns {string|null} Premier message d’erreur.
 */
export function obtenirPremiereErreur(resultat) {
  const messages = Object.values(resultat.erreurs);

  return messages.length > 0 ? messages[0] : null;
}

/**
 * Vérifie qu’une valeur peut être convertie en montant.
 *
 * @param {*} valeur - Valeur à vérifier.
 * @returns {boolean} true si convertible.
 */
export function estConvertibleEnMontant(valeur) {
  return convertirEnMontant(valeur) !== null;
}