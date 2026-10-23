/**
 * Fichier : js/validation/midiValidation.js
 * Rôle : valider les données du service Midi et construire les données à enregistrer.
 *
 * Ce module est réutilisable et ne dépend ni du DOM ni de Supabase.
 *
 * Inputs :
 *  - Valeurs brutes saisies dans le formulaire Midi.
 *
 * Outputs :
 *  - Résultat structuré : validité, données normalisées et erreurs par champ.
 *
 * Dépendances :
 *  - js/utils/calculations.js
 */

import {
  parseAmount,
  roundToTwoDecimals,
} from '../utils/calculations.js';

const AMOUNT_FIELDS = [
  'cbClassic',
  'cbTicketResto',
  'cashAdipos',
  'ancvPaper',
  'ancvConnect',
  'checks',
  'vat55',
  'vat10',
  'vat20',
];

const INTEGER_FIELDS = [
  'pizzasDineIn',
  'pizzasTakeaway',
];

const FIELD_LABELS = {
  myPosTotal: 'CB MyPos',
  cbClassic: 'CB classique',
  cbTicketResto: 'CB Ticket Restaurant',
  cashAdipos: 'Espèces Adipos',
  ancvPaper: 'ANCV papier',
  ancvConnect: 'ANCV dématérialisé',
  checks: 'Chèques',
  vat55: 'TVA 5,5 %',
  vat10: 'TVA 10 %',
  vat20: 'TVA 20 %',
  pizzasDineIn: 'Pizzas sur place',
  pizzasTakeaway: 'Pizzas à emporter',
};

/**
 * Valide un montant positif ou nul.
 *
 * @param {string|number} rawValue - Valeur brute saisie.
 * @param {string} fieldLabel - Nom du champ pour le message d’erreur.
 * @returns {{value: number|null, error: string|null}} Résultat de validation.
 */
function validateAmount(rawValue, fieldLabel) {
  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return {
      value: 0,
      error: null,
    };
  }

  const parsedValue = parseAmount(rawValue);

  if (parsedValue === null) {
    return {
      value: null,
      error: `${fieldLabel} : veuillez saisir un montant valide.`,
    };
  }

  if (parsedValue < 0) {
    return {
      value: null,
      error: `${fieldLabel} : le montant ne peut pas être négatif.`,
    };
  }

  return {
    value: roundToTwoDecimals(parsedValue),
    error: null,
  };
}

/**
 * Valide un nombre entier positif ou nul.
 *
 * @param {string|number} rawValue - Valeur brute saisie.
 * @param {string} fieldLabel - Nom du champ pour le message d’erreur.
 * @returns {{value: number|null, error: string|null}} Résultat de validation.
 */
function validateInteger(rawValue, fieldLabel) {
  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return {
      value: 0,
      error: null,
    };
  }

  const parsedValue = parseAmount(rawValue);

  if (parsedValue === null) {
    return {
      value: null,
      error: `${fieldLabel} : veuillez saisir un nombre valide.`,
    };
  }

  if (!Number.isInteger(parsedValue)) {
    return {
      value: null,
      error: `${fieldLabel} : la valeur doit être un nombre entier.`,
    };
  }

  if (parsedValue < 0) {
    return {
      value: null,
      error: `${fieldLabel} : la valeur ne peut pas être négative.`,
    };
  }

  return {
    value: parsedValue,
    error: null,
  };
}

/**
 * Valide les données brutes du service Midi.
 *
 * @param {Object} rawData - Valeurs brutes du formulaire.
 * @param {number} rawData.myPosTotal - Total déjà calculé des paiements MyPos.
 * @param {string|number} rawData.cbClassic - CB classique.
 * @param {string|number} rawData.cbTicketResto - CB Ticket Restaurant.
 * @param {string|number} rawData.cashAdipos - Espèces Adipos.
 * @param {string|number} rawData.ancvPaper - ANCV papier.
 * @param {string|number} rawData.ancvConnect - ANCV dématérialisé.
 * @param {string|number} rawData.checks - Chèques.
 * @param {string|number} rawData.vat55 - TVA 5,5 %.
 * @param {string|number} rawData.vat10 - TVA 10 %.
 * @param {string|number} rawData.vat20 - TVA 20 %.
 * @param {string|number} rawData.pizzasDineIn - Pizzas sur place.
 * @param {string|number} rawData.pizzasTakeaway - Pizzas à emporter.
 * @returns {{
 *   isValid: boolean,
 *   data: Object|null,
 *   errors: Object
 * }} Résultat de validation.
 */
export function validateMidiRawData(rawData) {
  const errors = {};
  const normalizedData = {};

  const myPosTotal = Number(rawData.myPosTotal);

  if (!Number.isFinite(myPosTotal) || myPosTotal < 0) {
    errors.myPosTotal =
      'CB MyPos : le total des paiements est invalide.';
  } else {
    normalizedData.myPosTotal = roundToTwoDecimals(myPosTotal);
  }

  AMOUNT_FIELDS.forEach((field) => {
    const result = validateAmount(
      rawData[field],
      FIELD_LABELS[field],
    );

    if (result.error) {
      errors[field] = result.error;
    } else {
      normalizedData[field] = result.value;
    }
  });

  INTEGER_FIELDS.forEach((field) => {
    const result = validateInteger(
      rawData[field],
      FIELD_LABELS[field],
    );

    if (result.error) {
      errors[field] = result.error;
    } else {
      normalizedData[field] = result.value;
    }
  });

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    data: isValid ? normalizedData : null,
    errors,
  };
}

/**
 * Construit les données à enregistrer dans Supabase.
 *
 * @param {Object} validatedData - Données déjà validées par validateMidiRawData.
 * @returns {Object} Données au format de la table daily_closings.
 */
export function buildMidiClosingData(validatedData) {
  return {
    mypos_total: validatedData.myPosTotal,
    cb_classic: validatedData.cbClassic,
    cb_ticket_resto: validatedData.cbTicketResto,
    cash_adipos: validatedData.cashAdipos,
    ancv_paper: validatedData.ancvPaper,
    ancv_connect: validatedData.ancvConnect,
    checks: validatedData.checks,
    vat_5_5: validatedData.vat55,
    vat_10: validatedData.vat10,
    vat_20: validatedData.vat20,
    pizzas_dine_in: validatedData.pizzasDineIn,
    pizzas_takeaway: validatedData.pizzasTakeaway,
  };
}