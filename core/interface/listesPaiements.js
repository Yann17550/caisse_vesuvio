/**
 * Fichier : core/interface/listesPaiements.js
 * Rôle : fournir des briques réutilisables pour les listes de paiements.
 *
 * Ces fonctions permettent de créer, lire et vider des lignes
 * de paiement dans le DOM.
 *
 * Elles ne contiennent aucune règle métier de clôture
 * et aucun accès à Supabase.
 */

/**
 * Crée une ligne de paiement.
 *
 * @param {Object} configuration - Configuration de la ligne.
 * @param {string} configuration.nom - Nom du paiement.
 * @param {string} configuration.libelle - Libellé affiché.
 * @param {string} configuration.placeholder - Texte indicatif du champ.
 * @returns {HTMLElement} Élément DOM représentant la ligne.
 */
export function creerLignePaiement(configuration) {
  const { nom, libelle, placeholder } = configuration;

  const ligne = document.createElement('div');

  ligne.className = 'ligne-paiement';
  ligne.dataset.paiement = nom;

  const etiquette = document.createElement('label');

  etiquette.textContent = libelle;
  etiquette.setAttribute('for', `paiement-${nom}`);

  const champ = document.createElement('input');

  champ.type = 'text';
  champ.id = `paiement-${nom}`;
  champ.name = nom;
  champ.placeholder = placeholder || '';
  champ.inputMode = 'decimal';
  champ.className = 'champ-montant';

  ligne.appendChild(etiquette);
  ligne.appendChild(champ);

  return ligne;
}

/**
 * Ajoute une ligne de paiement dans un conteneur.
 *
 * @param {HTMLElement|null} conteneur - Conteneur des lignes.
 * @param {Object} configuration - Configuration de la ligne.
 * @returns {HTMLElement|null} Ligne créée, ou null si le conteneur est absent.
 */
export function ajouterLignePaiement(conteneur, configuration) {
  if (!conteneur) {
    return null;
  }

  const ligne = creerLignePaiement(configuration);

  conteneur.appendChild(ligne);

  return ligne;
}

/**
 * Lit la valeur d’un champ de paiement.
 *
 * @param {HTMLElement|null} conteneur - Conteneur des lignes.
 * @param {string} nom - Nom du paiement.
 * @returns {string} Valeur saisie, ou chaîne vide si la ligne est absente.
 */
export function lireValeurPaiement(conteneur, nom) {
  if (!conteneur) {
    return '';
  }

  const champ = conteneur.querySelector(`[data-paiement="${nom}"] input`);

  return champ ? champ.value : '';
}

/**
 * Vide toutes les lignes de paiement d’un conteneur.
 *
 * @param {HTMLElement|null} conteneur - Conteneur des lignes.
 */
export function viderListePaiements(conteneur) {
  if (!conteneur) {
    return;
  }

  const champs = conteneur.querySelectorAll('input');

  champs.forEach((champ) => {
    champ.value = '';
  });
}