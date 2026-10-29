/**
 * Fichier : accueil/vueAccueil.js
 * Rôle : manipuler l’interface de la page d’accueil.
 *
 * Ce module contient uniquement l’accès au DOM.
 * Il ne contient aucune règle métier, aucun calcul
 * et aucun accès à Supabase.
 *
 * Il permet à la page d’accueil de :
 * - sélectionner les éléments de l’interface ;
 * - afficher ou masquer les écrans ;
 * - afficher les établissements ;
 * - afficher ou effacer un message ;
 * - attacher les événements des boutons.
 *
 * Dépendances :
 * - Aucune.
 */

/**
 * Références des éléments DOM de la page d’accueil.
 *
 * @type {{
 *   section: HTMLElement|null,
 *   boutonClotures: HTMLButtonElement|null,
 *   choixEtablissement: HTMLElement|null,
 *   listeEtablissements: HTMLElement|null,
 *   message: HTMLElement|null,
 *   boutonRetourAccueil: HTMLButtonElement|null
 * }}
 */
const elements = {
  section: null,
  boutonClotures: null,
  choixEtablissement: null,
  listeEtablissements: null,
  message: null,
  boutonRetourAccueil: null,
};

/**
 * Sélectionne les éléments DOM de la page d’accueil.
 *
 * @returns {boolean} True si la section d’accueil existe, false sinon.
 */
export function initialiserVueAccueil() {
  elements.section = document.getElementById('accueil-section');
  elements.boutonClotures = document.getElementById(
    'accueil-bouton-clotures',
  );
  elements.choixEtablissement = document.getElementById(
    'accueil-choix-etablissement',
  );
  elements.listeEtablissements = document.getElementById(
    'accueil-liste-etablissements',
  );
  elements.message = document.getElementById('accueil-message');
  elements.boutonRetourAccueil = document.getElementById(
    'accueil-bouton-retour',
  );

  return elements.section !== null;
}

/**
 * Indique si la page d’accueil est présente dans le DOM.
 *
 * @returns {boolean} True si la page d’accueil est disponible.
 */
export function estVueAccueilDisponible() {
  return elements.section !== null;
}

/**
 * Affiche l’écran d’accueil.
 *
 * @returns {void}
 */
export function afficherAccueil() {
  if (!elements.section) {
    return;
  }

  elements.section.classList.remove('is-hidden');
}

/**
 * Masque l’écran d’accueil.
 *
 * @returns {void}
 */
export function masquerAccueil() {
  if (!elements.section) {
    return;
  }

  elements.section.classList.add('is-hidden');
}

/**
 * Affiche l’écran de choix de l’établissement.
 *
 * @returns {void}
 */
export function afficherChoixEtablissement() {
  if (!elements.choixEtablissement || !elements.boutonClotures) {
    return;
  }

  elements.choixEtablissement.classList.remove('is-hidden');
  elements.boutonClotures.classList.add('is-hidden');
}

/**
 * Masque l’écran de choix de l’établissement.
 *
 * @returns {void}
 */
export function masquerChoixEtablissement() {
  if (!elements.choixEtablissement || !elements.boutonClotures) {
    return;
  }

  elements.choixEtablissement.classList.add('is-hidden');
  elements.boutonClotures.classList.remove('is-hidden');
}

/**
 * Affiche la liste des établissements dans l’interface.
 *
 * @param {ReadonlyArray<object>} etablissements - Établissements à afficher.
 * @param {Function} auClicEtablissement - Fonction appelée avec l’identifiant.
 * @returns {void}
 */
export function afficherEtablissements(
  etablissements,
  auClicEtablissement,
) {
  if (!elements.listeEtablissements) {
    return;
  }

  elements.listeEtablissements.innerHTML = '';

  etablissements.forEach((etablissement) => {
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'accueil-bouton-etablissement';
    bouton.textContent = etablissement.nom;
    bouton.dataset.etablissementId = String(etablissement.id);

    bouton.addEventListener('click', () => {
      auClicEtablissement(etablissement.id);
    });

    elements.listeEtablissements.appendChild(bouton);
  });
}

/**
 * Affiche un message dans la page d’accueil.
 *
 * @param {string} message - Message à afficher.
 * @param {'info'|'erreur'} type - Type de message.
 * @returns {void}
 */
export function afficherMessage(message, type = 'info') {
  if (!elements.message) {
    return;
  }

  elements.message.textContent = message;
  elements.message.classList.remove('is-hidden');
  elements.message.classList.toggle(
    'accueil-message-erreur',
    type === 'erreur',
  );
}

/**
 * Efface le message affiché dans la page d’accueil.
 *
 * @returns {void}
 */
export function effacerMessage() {
  if (!elements.message) {
    return;
  }

  elements.message.textContent = '';
  elements.message.classList.add('is-hidden');
  elements.message.classList.remove('accueil-message-erreur');
}

/**
 * Attache l’événement du bouton « Clôtures ».
 *
 * @param {Function} auClic - Fonction appelée lors du clic.
 * @returns {void}
 */
export function attacherEvenementBoutonClotures(auClic) {
  if (!elements.boutonClotures) {
    return;
  }

  elements.boutonClotures.addEventListener('click', auClic);
}

/**
 * Attache l’événement du bouton « Retour à l’accueil ».
 *
 * @param {Function} auClic - Fonction appelée lors du clic.
 * @returns {void}
 */
export function attacherEvenementBoutonRetour(auClic) {
  if (!elements.boutonRetourAccueil) {
    return;
  }

  elements.boutonRetourAccueil.addEventListener('click', auClic);
}

/**
 * Affiche la section des clôtures Vesuvio.
 *
 * @returns {void}
 */
export function afficherCloturesVesuvio() {
  const cloturesSection = document.getElementById(
    'clotures-vesuvio-section',
  );

  if (!cloturesSection) {
    return;
  }

  cloturesSection.classList.remove('is-hidden');
}

/**
 * Masque la section des clôtures Vesuvio.
 *
 * @returns {void}
 */
export function masquerCloturesVesuvio() {
  const cloturesSection = document.getElementById(
    'clotures-vesuvio-section',
  );

  if (!cloturesSection) {
    return;
  }

  cloturesSection.classList.add('is-hidden');
}