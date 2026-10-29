/**
 * Fichier : core/configuration/configurationEtablissements.js
 * Rôle : centraliser la configuration des établissements de l’EIRL.
 *
 * Cette configuration est la source unique des établissements
 * disponibles dans l’application.
 *
 * Elle ne décide pas quelle application ouvrir.
 * Elle fournit uniquement les données nécessaires à la page d’accueil
 * et aux applications de clôture.
 *
 * Règles importantes :
 * - Aucun identifiant d’établissement ne doit être codé en dur
 *   dans une page de clôture.
 * - L’établissement actif est sélectionné depuis la page d’accueil.
 * - `id` est la clé technique utilisée par Supabase.
 * - `siret` est l’identifiant administratif de l’établissement.
 * - `nom` est le libellé affiché dans l’interface.
 *
 * Dépendances :
 * - Aucune.
 */

/**
 * Liste des établissements de l’EIRL.
 *
 * Chaque établissement contient :
 * - un identifiant technique stable, utilisé par Supabase ;
 * - un SIRET, identifiant administratif de l’établissement ;
 * - un nom affichable dans l’interface ;
 * - la liste des applications disponibles.
 *
 * @type {ReadonlyArray<{
 *   id: number,
 *   siret: string|null,
 *   nom: string,
 *   applicationsDisponibles: ReadonlyArray<string>
 * }>}
 */
export const ETABLISSEMENTS = Object.freeze([
  Object.freeze({
    id: 2,
    siret: 75369804200045,
    nom: 'Le Vesuvio',
    applicationsDisponibles: Object.freeze([
      'clotures-vesuvio',
    ]),
  }),
  Object.freeze({
    id: 1,
    siret: 75369804200029,
    nom: 'Pizza d’Oléron',
    applicationsDisponibles: Object.freeze([
      'clotures-pizz-doleron',
    ]),
  }),
]);

/**
 * Vérifie qu’un identifiant d’établissement est connu.
 *
 * @param {number|string} etablissementId - Identifiant à vérifier.
 * @returns {boolean} True si l’établissement existe, false sinon.
 */
export function estEtablissementConnu(etablissementId) {
  const identifiantNormalise = Number(etablissementId);

  if (!Number.isInteger(identifiantNormalise)) {
    return false;
  }

  return ETABLISSEMENTS.some(
    (etablissement) => etablissement.id === identifiantNormalise,
  );
}

/**
 * Recherche un établissement à partir de son identifiant technique.
 *
 * @param {number|string} etablissementId - Identifiant recherché.
 * @returns {object|null} Établissement trouvé, ou null si inconnu.
 */
export function trouverEtablissementParId(etablissementId) {
  const identifiantNormalise = Number(etablissementId);

  if (!Number.isInteger(identifiantNormalise)) {
    return null;
  }

  return ETABLISSEMENTS.find(
    (etablissement) => etablissement.id === identifiantNormalise,
  ) ?? null;
}

/**
 * Recherche un établissement à partir de son SIRET.
 *
 * Le SIRET doit contenir exactement 14 chiffres.
 * Les espaces éventuellement saisis sont ignorés.
 *
 * @param {string} siret - SIRET recherché.
 * @returns {object|null} Établissement trouvé, ou null si inconnu.
 */
export function trouverEtablissementParSiret(siret) {
  if (typeof siret !== 'string') {
    return null;
  }

  const siretNormalise = siret.replace(/\s/g, '');

  if (!/^\d{14}$/.test(siretNormalise)) {
    return null;
  }

  return ETABLISSEMENTS.find(
    (etablissement) => etablissement.siret === siretNormalise,
  ) ?? null;
}

/**
 * Recherche un établissement à partir de son nom exact.
 *
 * @param {string} nom - Nom de l’établissement recherché.
 * @returns {object|null} Établissement trouvé, ou null si inconnu.
 */
export function trouverEtablissementParNom(nom) {
  if (typeof nom !== 'string') {
    return null;
  }

  const nomNormalise = nom.trim().toLowerCase();

  if (nomNormalise === '') {
    return null;
  }

  return ETABLISSEMENTS.find(
    (etablissement) =>
      etablissement.nom.trim().toLowerCase() === nomNormalise,
  ) ?? null;
}

/**
 * Retourne les applications disponibles pour un établissement.
 *
 * @param {number|string} etablissementId - Identifiant de l’établissement.
 * @returns {ReadonlyArray<string>} Liste des applications disponibles.
 */
export function obtenirApplicationsDisponibles(etablissementId) {
  const etablissement = trouverEtablissementParId(etablissementId);

  if (!etablissement) {
    return Object.freeze([]);
  }

  return etablissement.applicationsDisponibles;
}