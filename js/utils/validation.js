// Utilitaires de validation des saisies de caisse.
// Utilisables par le Midi et le Soir.

/**
 * Convertit une valeur saisie en nombre.
 * Retourne null si la valeur est vide ou invalide.
 */
export function parseAmount(value) {
  if (value === null || value === undefined) return null;

  const cleaned = String(value).trim().replace(',', '.');

  if (cleaned === '') return null;

  const number = Number(cleaned);

  if (Number.isNaN(number)) return null;

  return number;
}

/**
 * Vérifie qu'une valeur est un montant valide :
 * - non vide
- - nombre
- - positif ou nul
 */
export function isValidAmount(value) {
  const number = parseAmount(value);
  return number !== null && number >= 0;
}

/**
 * Vérifie qu'un champ contient une valeur.
 */
export function isFilled(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * Affiche une erreur sur un champ.
 * Ajoute une classe CSS et un message sous le champ.
 */
export function showFieldError(input, message) {
  if (!input) return;

  input.classList.add('input-error');

  let errorElement = input.nextElementSibling;

  if (!errorElement || !errorElement.classList.contains('field-error')) {
    errorElement = document.createElement('div');
    errorElement.classList.add('field-error');
    input.insertAdjacentElement('afterend', errorElement);
  }

  errorElement.textContent = message;
}

/**
 * Retire l'erreur d'un champ.
 */
export function clearFieldError(input) {
  if (!input) return;

  input.classList.remove('input-error');

  const errorElement = input.nextElementSibling;

  if (errorElement && errorElement.classList.contains('field-error')) {
    errorElement.remove();
  }
}

/**
 * Valide une liste de champs montants.
 * fields : tableau d'objets { input, label }
 * Retourne true si tout est valide, false sinon.
 */
export function validateAmountFields(fields) {
  let isValid = true;

  fields.forEach(({ input, label }) => {
    clearFieldError(input);

    if (!isValidAmount(input.value)) {
      showFieldError(input, `${label} : saisir un montant valide.`);
      isValid = false;
    }
  });

  return isValid;
}