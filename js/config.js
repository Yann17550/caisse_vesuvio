/**
 * Fichier : js/config.js
 * Rôle : centraliser la configuration de l’application.
 *
 * Cette configuration est volontairement isolée :
 * aucun autre module ne doit contenir d’URL ou de clé Supabase.
 *
 * Inputs :
 *  - Valeurs locales de Supabase.
 *
 * Outputs :
 *  - Objet `APP_CONFIG` utilisé par les autres modules.
 *
 * Dépendances :
 *  - Aucune.
 */

export const APP_CONFIG = Object.freeze({
  supabase: {
    url: 'http://192.168.1.10:54321',
    publishableKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
  },
  cashFloat: {
    targetAmount: 134,
  },
});