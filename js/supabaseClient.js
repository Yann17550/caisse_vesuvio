/**
 * Fichier : js/supabaseClient.js
 * Rôle : créer et exposer l’unique client Supabase de l’application.
 *
 * Ce module isole la dépendance à Supabase.
 * Les services métier doivent importer `supabase`, sans recréer de client.
 *
 * Inputs :
 *  - APP_CONFIG depuis js/config.js.
 *
 * Outputs :
 *  - Client Supabase prêt à l’emploi.
 *
 * Dépendances :
 *  - @supabase/supabase-js via CDN ESM.
 *  - js/config.js
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { APP_CONFIG } from './config.js';

const { url, publishableKey } = APP_CONFIG.supabase;

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