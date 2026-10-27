/**
 * Fichier : js/utils/draftStorage.js
 * Rôle : conserver localement les saisies en cours d’une clôture.
 *
 * Cet utilitaire évite de perdre les chiffres saisis si la page
 * est rechargée accidentellement sur mobile (glissement vers le bas).
 *
 * Les données sont conservées uniquement dans le navigateur :
 * elles ne sont pas envoyées dans Supabase.
 *
 * Le brouillon est lié à la date métier :
 * une clôture réalisée entre minuit et 03:00 appartient à la veille.
 *
 * Ce module est partagé par les pages du service Soir.
 * Il pourra ensuite être réutilisé par le service Midi.
 */

const STORAGE_KEY = 'caisse-vesuvio:soir-draft';

/**
 * Détermine la date métier actuelle.
 *
 * Une clôture réalisée entre 00:00 et 02:59 concerne la veille.
 *
 * @returns {string} Date métier au format YYYY-MM-DD.
 */
function getBusinessDate() {
  const now = new Date();
  const businessDate = new Date(now);

  if (now.getHours() < 3) {
    businessDate.setDate(businessDate.getDate() - 1);
  }

  const year = businessDate.getFullYear();
  const month = String(businessDate.getMonth() + 1).padStart(2, '0');
  const day = String(businessDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Lit le brouillon complet stocké dans le navigateur.
 *
 * @returns {Object} Brouillon courant, ou objet vide.
 */
function loadDraft() {
  try {
    const rawDraft = localStorage.getItem(STORAGE_KEY);

    if (!rawDraft) {
      return {};
    }

    const draft = JSON.parse(rawDraft);

    return draft && typeof draft === 'object' ? draft : {};
  } catch (error) {
    // Un brouillon illisible ne doit jamais bloquer la saisie.
    return {};
  }
}

/**
 * Vérifie que le brouillon concerne bien la date métier actuelle.
 *
 * @param {Object} draft - Brouillon à contrôler.
 * @returns {boolean} true si le brouillon est utilisable.
 */
function isDraftForCurrentBusinessDate(draft) {
  return Boolean(
    draft &&
    draft.businessDate &&
    draft.businessDate === getBusinessDate(),
  );
}

/**
 * Écrit le brouillon complet dans le navigateur.
 *
 * @param {Object} draft - Brouillon à enregistrer.
 * @returns {void}
 */
function writeDraft(draft) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    // Si le navigateur refuse l’accès au stockage local,
    // la saisie continue normalement sans sauvegarde.
  }
}

/**
 * Sauvegarde les champs d’un formulaire dans le brouillon.
 *
 * Chaque champ est identifié par son attribut id.
 * Les champs sans id ne sont pas sauvegardés.
 *
 * @param {HTMLFormElement} formElement - Formulaire à sauvegarder.
 * @returns {void}
 */
export function saveFormDraft(formElement) {
  if (!formElement || !formElement.id) {
    return;
  }

  const draft = loadDraft();
  const formValues = {};

  formElement.querySelectorAll('input').forEach((input) => {
    if (input.id) {
      formValues[input.id] = input.value;
    }
  });

  draft.businessDate = getBusinessDate();
  draft[formElement.id] = formValues;

  writeDraft(draft);
}

/**
 * Restaure les champs d’un formulaire depuis le brouillon.
 *
 * La restauration est ignorée si le brouillon concerne une autre
 * date métier : cela évite de retrouver les chiffres de la veille.
 *
 * @param {HTMLFormElement} formElement - Formulaire à restaurer.
 * @returns {boolean} true si des valeurs ont été restaurées.
 */
export function restoreFormDraft(formElement) {
  if (!formElement || !formElement.id) {
    return false;
  }

  const draft = loadDraft();

  if (!isDraftForCurrentBusinessDate(draft)) {
    return false;
  }

  const formValues = draft[formElement.id];

  if (!formValues || typeof formValues !== 'object') {
    return false;
  }

  Object.entries(formValues).forEach(([inputId, value]) => {
    const input = document.getElementById(inputId);

    if (input && typeof value === 'string') {
      input.value = value;
    }
  });

  return true;
}

/**
 * Sauvegarde une section spécifique du brouillon.
 *
 * Sert notamment aux listes de paiements : MyPOS, chèques, ANCV papier.
 *
 * @param {string} sectionKey - Clé unique de la section.
 * @param {*} value - Valeur à enregistrer.
 * @returns {void}
 */
export function saveDraftSection(sectionKey, value) {
  if (!sectionKey) {
    return;
  }

  const draft = loadDraft();

  draft.businessDate = getBusinessDate();
  draft[sectionKey] = value;

  writeDraft(draft);
}

/**
 * Lit une section spécifique du brouillon.
 *
 * @param {string} sectionKey - Clé unique de la section.
 * @returns {*} Valeur enregistrée, ou null si absente ou périmée.
 */
export function getDraftSection(sectionKey) {
  if (!sectionKey) {
    return null;
  }

  const draft = loadDraft();

  if (!isDraftForCurrentBusinessDate(draft)) {
    return null;
  }

  return draft[sectionKey] ?? null;
}

/**
 * Sauvegarde automatiquement le formulaire à chaque saisie.
 *
 * @param {HTMLFormElement} formElement - Formulaire surveillé.
 * @returns {void}
 */
export function setupDraftAutosave(formElement) {
  if (!formElement) {
    return;
  }

  formElement.addEventListener('input', () => {
    saveFormDraft(formElement);
  });
}

/**
 * Efface tous les brouillons du service Soir.
 *
 * À appeler après une validation réussie dans Supabase :
 * les chiffres sont alors définitivement enregistrés.
 *
 * @returns {void}
 */
export function clearSoirDrafts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Si le stockage local est inaccessible, on ignore l’erreur.
  }
}