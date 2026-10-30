/**
 * Fichier : core/base-de-donnees/clientSupabase.js
 * Rôle : créer et exposer l’unique client Supabase du tronc commun.
 *
 * Ce module isole la dépendance à Supabase.
 * Les services métier devront importer ce client sans recréer
 * de connexion.
 *
 * Dépendances :
 * - @supabase/supabase-js via CDN ESM.
 * - core/configuration/configurationApplication.js
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import {
  CONFIGURATION_APPLICATION,
} from '../configuration/configurationApplication.js';

const { url, publishableKey } = CONFIGURATION_APPLICATION.supabase;

if (!url) {
  throw new Error('Configuration Supabase invalide : URL manquante.');
}

if (!publishableKey) {
  throw new Error('Configuration Supabase invalide : clé publishable manquante.');
}

export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});