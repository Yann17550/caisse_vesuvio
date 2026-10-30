/**
 * Fichier : core/configuration/configurationApplication.js
 * Rôle : centraliser la configuration technique de l’application.
 *
 * Cette configuration est la source unique de la configuration
 * technique côté core/.
 *
 * Dépendances :
 * - Aucune.
 */

export const CONFIGURATION_APPLICATION = Object.freeze({
  supabase: Object.freeze({
    url: 'http://192.168.1.10:54321',
    publishableKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
  }),
  cashFloat: Object.freeze({
    targetAmount: 134,
  }),
});