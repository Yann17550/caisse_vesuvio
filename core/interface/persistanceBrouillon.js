/**
 * Fichier : core/interface/persistanceBrouillon.js
 * Rôle : conserver localement les saisies en cours d’un formulaire.
 *
 * Module générique, réutilisable par plusieurs applications
 * et plusieurs services. Aucune règle métier n’est incluse.
 *
 * Les données restent dans le navigateur (localStorage) :
 * elles ne sont pas envoyées dans une base de données.
 *
 * Chaque appelant fournit sa propre clé de stockage,
 * par exemple :
 * - 'caisse-vesuvio:brouillon-midi'
 * - 'caisse-vesuvio:brouillon-soir'
 *
 * Règle générique de fraîcheur : un brouillon n’est restauré
 * que s’il a été enregistré le même jour calendaire.
 * Cela évite de restaurer les saisies de la veille.
 */


/**
 * Retourne la date calendaire actuelle au format YYYY-MM-DD.
 *
 * @returns {string} Date du jour.
 */
function obtenirDateCalendaire() {
  const maintenant = new Date();


  const annee = maintenant.getFullYear();
  const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
  const jour = String(maintenant.getDate()).padStart(2, '0');


  return `${annee}-${mois}-${jour}`;
}


/**
 * Lit le brouillon complet associé à une clé de stockage.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @returns {Object} Brouillon courant, ou objet vide.
 */
function lireBrouillon(cleStockage) {
  try {
    const brut = localStorage.getItem(cleStockage);


    if (!brut) {
      return {};
    }


    const brouillon = JSON.parse(brut);


    return brouillon && typeof brouillon === 'object'
      ? brouillon
      : {};
  } catch {
    // Brouillon illisible : on repart d’un brouillon vide.
    return {};
  }
}


/**
 * Vérifie que le brouillon a été enregistré aujourd’hui.
 *
 * @param {Object} brouillon - Brouillon à contrôler.
 * @returns {boolean} true si le brouillon est du jour.
 */
function estBrouillonDuJour(brouillon) {
  return Boolean(
    brouillon &&
    brouillon.dateSauvegarde &&
    brouillon.dateSauvegarde === obtenirDateCalendaire(),
  );
}


/**
 * Écrit le brouillon complet associé à une clé de stockage.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @param {Object} brouillon - Brouillon à enregistrer.
 * @returns {void}
 */
function ecrireBrouillon(cleStockage, brouillon) {
  try {
    localStorage.setItem(
      cleStockage,
      JSON.stringify(brouillon),
    );
  } catch {
    // Stockage indisponible : la saisie continue sans sauvegarde.
  }
}


/**
 * Sauvegarde les champs d’un formulaire dans le brouillon.
 *
 * Chaque champ est identifié par son attribut id.
 * Les champs sans id ne sont pas sauvegardés.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @param {HTMLFormElement} formulaire - Formulaire à sauvegarder.
 * @returns {void}
 */
export function sauvegarderFormulaire(cleStockage, formulaire) {
  if (!cleStockage || !formulaire || !formulaire.id) {
    return;
  }


  const brouillon = lireBrouillon(cleStockage);
  const valeurs = {};


  formulaire.querySelectorAll('input').forEach((champ) => {
    if (champ.id) {
      valeurs[champ.id] = champ.value;
    }
  });


  brouillon.dateSauvegarde = obtenirDateCalendaire();
  brouillon[formulaire.id] = valeurs;


  ecrireBrouillon(cleStockage, brouillon);
}


/**
 * Restaure les champs d’un formulaire depuis le brouillon.
 *
 * La restauration est ignorée si le brouillon date d’un autre jour.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @param {HTMLFormElement} formulaire - Formulaire à restaurer.
 * @returns {boolean} true si des valeurs ont été restaurées.
 */
export function restaurerFormulaire(cleStockage, formulaire) {
  if (!cleStockage || !formulaire || !formulaire.id) {
    return false;
  }


  const brouillon = lireBrouillon(cleStockage);


  if (!estBrouillonDuJour(brouillon)) {
    return false;
  }


  const valeurs = brouillon[formulaire.id];


  if (!valeurs || typeof valeurs !== 'object') {
    return false;
  }


  Object.entries(valeurs).forEach(([idChamp, valeur]) => {
    const champ = document.getElementById(idChamp);


    if (champ && typeof valeur === 'string') {
      champ.value = valeur;
    }
  });


  return true;
}


/**
 * Sauvegarde une section du brouillon.
 *
 * Sert notamment aux listes de paiements : MyPOS, chèques, ANCV.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @param {string} cleSection - Clé unique de la section.
 * @param {*} valeur - Valeur à enregistrer.
 * @returns {void}
 */
export function sauvegarderSection(
  cleStockage,
  cleSection,
  valeur,
) {
  if (!cleStockage || !cleSection) {
    return;
  }


  const brouillon = lireBrouillon(cleStockage);


  brouillon.dateSauvegarde = obtenirDateCalendaire();
  brouillon[cleSection] = valeur;


  ecrireBrouillon(cleStockage, brouillon);
}


/**
 * Lit une section du brouillon.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @param {string} cleSection - Clé de la section.
 * @returns {*} Valeur enregistrée, ou null si absente ou périmée.
 */
export function lireSection(cleStockage, cleSection) {
  if (!cleStockage || !cleSection) {
    return null;
  }


  const brouillon = lireBrouillon(cleStockage);


  if (!estBrouillonDuJour(brouillon)) {
    return null;
  }


  return brouillon[cleSection] ?? null;
}


/**
 * Sauvegarde automatiquement le formulaire à chaque saisie.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @param {HTMLFormElement} formulaire - Formulaire surveillé.
 * @returns {void}
 */
export function configurerSauvegardeAutomatique(
  cleStockage,
  formulaire,
) {
  if (!cleStockage || !formulaire) {
    return;
  }


  formulaire.addEventListener('input', () => {
    sauvegarderFormulaire(cleStockage, formulaire);
  });
}


/**
 * Efface le brouillon associé à une clé de stockage.
 *
 * À appeler après une validation réussie :
 * les données sont alors définitivement enregistrées.
 *
 * @param {string} cleStockage - Clé unique du brouillon.
 * @returns {void}
 */
export function effacerBrouillon(cleStockage) {
  if (!cleStockage) {
    return;
  }


  try {
    localStorage.removeItem(cleStockage);
  } catch {
    // Stockage indisponible : on ignore.
  }
}