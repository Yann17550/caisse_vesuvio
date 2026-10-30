/**
 * Fichier : core/base-de-donnees/accesCloturesJournalieres.js
 * Rôle : fournir l’accès générique à la table daily_closings.
 *
 * Ce module ne contient aucune règle métier propre à un
 * établissement. L’identifiant d’établissement est obligatoire
 * et doit provenir de la sélection effectuée sur la page d’accueil.
 *
 * Dépendances :
 * - core/base-de-donnees/clientSupabase.js
 */

import { supabase } from './clientSupabase.js';

const TABLE_NAME = 'daily_closings';

/**
 * Vérifie qu’un identifiant d’établissement est fourni.
 *
 * @param {number|string} etablissementId - Identifiant à contrôler.
 * @throws {Error} Si l’identifiant est absent ou invalide.
 */
function verifierEtablissementId(etablissementId) {
  if (etablissementId === null || etablissementId === undefined) {
    throw new Error('L’identifiant de l’établissement est obligatoire.');
  }
}

/**
 * Récupère la clôture d’un service pour une date donnée.
 *
 * @param {Object} parametres - Paramètres de recherche.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service recherché.
 * @param {number} parametres.etablissementId - Identifiant de l’établissement.
 * @returns {Promise<Object|null>} Ligne trouvée ou null.
 * @throws {Error} Si la requête Supabase échoue.
 */
export async function lireClotureJournaliere({
  dateActivite,
  service,
  etablissementId,
}) {
  verifierEtablissementId(etablissementId);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('etablissement_id', etablissementId)
    .eq('business_date', dateActivite)
    .eq('service', service)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de lire la clôture : ${error.message}`);
  }

  return data;
}

/**
 * Crée ou met à jour la clôture d’un service pour une date donnée.
 *
 * @param {Object} parametres - Paramètres d’enregistrement.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service concerné.
 * @param {Object} parametres.donnees - Données validées à enregistrer.
 * @param {number} parametres.etablissementId - Identifiant de l’établissement.
 * @returns {Promise<Object>} Ligne enregistrée.
 * @throws {Error} Si l’enregistrement échoue.
 */
export async function enregistrerClotureJournaliere({
  dateActivite,
  service,
  donnees,
  etablissementId,
}) {
  verifierEtablissementId(etablissementId);

  const payload = {
    etablissement_id: etablissementId,
    business_date: dateActivite,
    service,
    ...donnees,
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .upsert(payload, {
      onConflict: 'etablissement_id,business_date,service',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Impossible d’enregistrer la clôture : ${error.message}`);
  }

  return data;
}

/**
 * Valide définitivement une clôture.
 *
 * @param {Object} parametres - Paramètres de validation.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service concerné.
 * @param {number} parametres.etablissementId - Identifiant de l’établissement.
 * @returns {Promise<Object>} Ligne mise à jour.
 * @throws {Error} Si la mise à jour échoue.
 */
export async function validerClotureJournaliere({
  dateActivite,
  service,
  etablissementId,
}) {
  verifierEtablissementId(etablissementId);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: 'closed',
      updated_at: new Date().toISOString(),
    })
    .eq('etablissement_id', etablissementId)
    .eq('business_date', dateActivite)
    .eq('service', service)
    .select()
    .single();

  if (error) {
    throw new Error(`Impossible de valider la clôture : ${error.message}`);
  }

  return data;
}

/**
 * Rouvre une clôture pour modification.
 *
 * @param {Object} parametres - Paramètres de réouverture.
 * @param {string} parametres.dateActivite - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} parametres.service - Service concerné.
 * @param {number} parametres.etablissementId - Identifiant de l’établissement.
 * @returns {Promise<Object>} Ligne mise à jour.
 * @throws {Error} Si la mise à jour échoue.
 */
export async function rouvrirClotureJournaliere({
  dateActivite,
  service,
  etablissementId,
}) {
  verifierEtablissementId(etablissementId);

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: 'open',
      updated_at: new Date().toISOString(),
    })
    .eq('etablissement_id', etablissementId)
    .eq('business_date', dateActivite)
    .eq('service', service)
    .select()
    .single();

  if (error) {
    throw new Error(`Impossible de rouvrir la clôture : ${error.message}`);
  }

  return data;
}