/**
 * Fichier : js/services/dailyClosingService.js
 * Rôle : communiquer avec la table `daily_closings` de Supabase.
 *
 * Ce service isole entièrement l’accès aux données.
 * Les vues et contrôleurs ne doivent jamais appeler Supabase directement.
 *
 * Chaque clôture appartient à un établissement.
 * Tant que le sélecteur d’établissement n’est pas en place,
 * l’application utilise Le Vesuvio par défaut.
 *
 * Dépendances :
 * - js/supabaseClient.js
 */

import { supabase } from '../supabaseClient.js';

const TABLE_NAME = 'daily_closings';

// Établissement actif par défaut : Le Vesuvio.
const DEFAULT_ETABLISSEMENT_ID = 2;

/**
 * Récupère la clôture d’un service pour une date donnée.
 *
 * @param {string} businessDate - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} service - Service recherché.
 * @param {number} [etablissementId] - Identifiant de l’établissement.
 * @returns {Promise<Object|null>} Ligne trouvée ou null.
 * @throws {Error} Si la requête Supabase échoue.
 */
export async function getDailyClosing(
  businessDate,
  service,
  etablissementId = DEFAULT_ETABLISSEMENT_ID,
) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('etablissement_id', etablissementId)
    .eq('business_date', businessDate)
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
 * @param {string} businessDate - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} service - Service concerné.
 * @param {Object} closingData - Données validées à enregistrer.
 * @param {number} [etablissementId] - Identifiant de l’établissement.
 * @returns {Promise<Object>} Ligne enregistrée.
 * @throws {Error} Si l’enregistrement échoue.
 */
export async function saveDailyClosing(
  businessDate,
  service,
  closingData,
  etablissementId = DEFAULT_ETABLISSEMENT_ID,
) {
  const payload = {
    etablissement_id: etablissementId,
    business_date: businessDate,
    service,
    ...closingData,
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
 * @param {string} businessDate - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} service - Service concerné.
 * @param {number} [etablissementId] - Identifiant de l’établissement.
 * @returns {Promise<Object>} Ligne mise à jour.
 * @throws {Error} Si la mise à jour échoue.
 */
export async function closeDailyClosing(
  businessDate,
  service,
  etablissementId = DEFAULT_ETABLISSEMENT_ID,
) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: 'closed',
      updated_at: new Date().toISOString(),
    })
    .eq('etablissement_id', etablissementId)
    .eq('business_date', businessDate)
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
 * @param {string} businessDate - Date au format ISO : YYYY-MM-DD.
 * @param {'midi'|'soir'} service - Service concerné.
 * @param {number} [etablissementId] - Identifiant de l’établissement.
 * @returns {Promise<Object>} Ligne mise à jour.
 * @throws {Error} Si la mise à jour échoue.
 */
export async function reopenDailyClosing(
  businessDate,
  service,
  etablissementId = DEFAULT_ETABLISSEMENT_ID,
) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: 'open',
      updated_at: new Date().toISOString(),
    })
    .eq('etablissement_id', etablissementId)
    .eq('business_date', businessDate)
    .eq('service', service)
    .select()
    .single();

  if (error) {
    throw new Error(`Impossible de rouvrir la clôture : ${error.message}`);
  }

  return data;
}