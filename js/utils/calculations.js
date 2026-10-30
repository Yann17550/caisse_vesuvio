/**
 * Fichier : js/utils/calculations.js
 * Rôle : façade temporaire vers les fonctions génériques de core/.
 *
 * Cette façade conserve les anciens noms de fonctions afin de ne pas
 * modifier immédiatement tous les fichiers qui les utilisent.
 *
 * À terme, les fichiers appelants devront importer directement
 * les fonctions de core/montants/.
 *
 * Dépendances :
 * - core/montants/conversionMontants.js
 * - core/montants/operationsMontants.js
 */

export {
  convertirEnMontant as parseAmount,
  arrondirADeuxDecimales as roundToTwoDecimals,
} from '../../core/montants/conversionMontants.js';

export {
  calculerSomme as sum,
  calculerDifference as subtract,
  calculerProduit as multiply,
  calculerQuotient as divide,
  calculerPourcentage as calculatePercentage,
} from '../../core/montants/operationsMontants.js';