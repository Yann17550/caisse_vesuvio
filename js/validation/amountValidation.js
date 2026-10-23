/**
 * Fichier : js/validation/amountValidation.js
 * Rôle : valider les montants et nombres saisis dans Caisse Vesuvio.
 *
 * Ces fonctions ne modifient jamais le DOM.
 * Elles renvoient toujours un résultat structuré.
 *
 * Inputs :
 *  - Valeurs textuelles ou numériques saisies par l’utilisateur.
 *
 * Outputs :
 *  - Résultats de validation : validité, valeur convertie et message d’erreur.
 *
 * Dépendances :
 *  - js/utils/calculations.js
 */

import {
  parseAmount,
  roundToTwoDecimals,
} from '../utils/calculations.js';

/**
 * Valide un montant positif strictement supérieur à zéro.
 *
 * @param {string|number} rawValue - Valeur saisie.
 * @returns {{isValid: boolean, value: number|null, errorMessage: string|null}} Résultat.
 */
export function validatePositiveAmount(rawValue) {
  const parsedValue = parseAmount(rawValue);

  if (parsedValue === null) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'Veuillez saisir un montant valide.',
    };
  }

  if (parsedValue <= 0) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'Le montant doit être supérieur à zéro.',
    };
  }

  return {
    isValid: true,
    value: roundToTwoDecimals(parsedValue),
    errorMessage: null,
  };
}

/**
 * Valide un montant positif ou nul.
 *
 * @param {string|number} rawValue - Valeur saisie.
 * @returns {{isValid: boolean, value: number|null, errorMessage: string|null}} Résultat.
 */
export function validateNonNegativeAmount(rawValue) {
  const parsedValue = parseAmount(rawValue);

  if (parsedValue === null) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'Veuillez saisir un montant valide.',
    };
  }

  if (parsedValue < 0) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'Le montant ne peut pas être négatif.',
    };
  }

  return {
    isValid: true,
    value: roundToTwoDecimals(parsedValue),
    errorMessage: null,
  };
}

/**
 * Valide un nombre entier positif ou nul.
 *
 * @param {string|number} rawValue - Valeur saisie.
 * @returns {{isValid: boolean, value: number|null, errorMessage: string|null}} Résultat.
 */
export function validateNonNegativeInteger(rawValue) {
  const parsedValue = parseAmount(rawValue);

  if (parsedValue === null) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'Veuillez saisir un nombre valide.',
    };
  }

  if (!Number.isInteger(parsedValue)) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'La valeur doit être un nombre entier.',
    };
  }

  if (parsedValue < 0) {
    return {
      isValid: false,
      value: null,
      errorMessage: 'La valeur ne peut pas être négative.',
    };
  }

  return {
    isValid: true,
    value: parsedValue,
    errorMessage: null,
  };
}