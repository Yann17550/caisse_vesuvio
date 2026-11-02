/**
 * Fichier : accueil/vueAccueil.js
 * Rôle : manipuler l’interface de sélection des applications
 * et des établissements.
 *
 * Page 1 : Sélection d’application.
 * Page A : Clôture établissement.
 * Page A1 : Vesuvio.
 *
 * Ce module contient uniquement la gestion de l’interface.
 * Aucune règle métier, aucun calcul et aucun accès à Supabase.
 */

const elements = {
  section: null,
  titre: null,
  boutonClotures: null,
  choixEtablissement: null,
  listeEtablissements: null,
  message: null,
  boutonRetourAccueil: null,
  boutonAccueilHeader: null,
};

/**
 * Met à jour le titre principal.
 *
 * @param {string} texte - Titre à afficher.
 */
function definirTitre(texte) {
  if (elements.titre) {
    elements.titre.textContent = texte;
  }
}

/**
 * Sélectionne les éléments de l’interface.
 *
 * @returns {boolean} True si la section d’accueil existe.
 */
export function initialiserVueAccueil() {
  elements.section = document.getElementById('accueil-section');
  elements.titre = document.querySelector(
    '.app-header .header-ligne-permanente h1',
  );
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
  elements.boutonAccueilHeader = document.getElementById(
    'service-accueil-button',
  );

  return elements.section !== null;
}

/**
 * Indique si la vue est disponible.
 *
 * @returns {boolean} True si la section existe.
 */
export function estVueAccueilDisponible() {
  return elements.section !== null;
}

/**
 * Affiche la page 1 : sélection de l’application.
 */
export function afficherAccueil() {
  if (!elements.section) {
    return;
  }

  elements.section.classList.remove('is-hidden');
  definirTitre('Sélection d’application');
}

/**
 * Masque la section contenant les pages 1 et A.
 */
export function masquerAccueil() {
  if (elements.section) {
    elements.section.classList.add('is-hidden');
  }
}

/**
 * Affiche la page A : sélection de l’établissement.
 */
export function afficherChoixEtablissement() {
  if (!elements.choixEtablissement || !elements.boutonClotures) {
    return;
  }

  elements.choixEtablissement.classList.remove('is-hidden');
  elements.boutonClotures.classList.add('is-hidden');
  definirTitre('Clôture établissement');
}

/**
 * Masque le choix de l’établissement.
 */
export function masquerChoixEtablissement() {
  if (!elements.choixEtablissement || !elements.boutonClotures) {
    return;
  }

  elements.choixEtablissement.classList.add('is-hidden');
  elements.boutonClotures.classList.remove('is-hidden');
}

/**
 * Affiche les boutons de sélection des établissements.
 *
 * @param {ReadonlyArray<object>} etablissements - Liste à afficher.
 * @param {Function} auClicEtablissement - Action de sélection.
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
 * Affiche un message.
 *
 * @param {string} message - Texte à afficher.
 * @param {'info'|'erreur'} type - Type de message.
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
 * Efface le message.
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
 * Attache le clic sur l’application Clôtures.
 *
 * @param {Function} auClic - Action à exécuter.
 */
export function attacherEvenementBoutonClotures(auClic) {
  if (elements.boutonClotures) {
    elements.boutonClotures.addEventListener('click', auClic);
  }
}

/**
 * Attache les boutons de retour à la page 1.
 *
 * Le bouton de la page A et celui du header appellent
 * la même action de réinitialisation de l’accueil.
 *
 * @param {Function} auClic - Action à exécuter.
 */
export function attacherEvenementBoutonRetour(auClic) {
  if (elements.boutonRetourAccueil) {
    elements.boutonRetourAccueil.addEventListener('click', auClic);
  }

  if (elements.boutonAccueilHeader) {
    elements.boutonAccueilHeader.addEventListener('click', auClic);
  }
}

/**
 * Affiche la page A1 : clôtures du Vesuvio.
 */
export function afficherCloturesVesuvio() {
  const cloturesSection = document.getElementById(
    'clotures-vesuvio-section',
  );

  if (!cloturesSection) {
    return;
  }

  cloturesSection.classList.remove('is-hidden');
  definirTitre('Vesuvio');
}

/**
 * Masque la page A1.
 */
export function masquerCloturesVesuvio() {
  const cloturesSection = document.getElementById(
    'clotures-vesuvio-section',
  );

  if (cloturesSection) {
    cloturesSection.classList.add('is-hidden');
  }
}