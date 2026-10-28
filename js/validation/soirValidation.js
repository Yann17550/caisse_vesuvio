/**
 * Fichier : js/validation/soirValidation.js
 * Rôle : construire les données du Soir à enregistrer dans Supabase.
 *
 * Les totaux sont recalculés à partir des valeurs détaillées :
 * - CB classique / TR / AMEX / CB ANCV : contact + sans contact ;
 * - ANCV papier : nombre de titres par dénomination ;
 * - MyPOS et chèques : montant total et nombre de paiements.
 *
 * total_revenue correspond à la somme des montants TVA TTC.
 *
 * Ce module ne dépend ni du DOM ni de Supabase.
 */

/**
 * Construit les données à enregistrer dans Supabase.
 *
 * @param {Object} totals - Résultat de getSoirTotals().
 * @returns {Object} Données au format de la table daily_closings.
 */
export function buildSoirClosingData(totals) {
  return {
    // Détail CB classique
    cb_classic_contact: totals.cardClassic.contact,
    cb_classic_no_contact: totals.cardClassic.noContact,

    // Détail CB Ticket Restaurant
    cb_tr_contact: totals.cardTr.contact,
    cb_tr_no_contact: totals.cardTr.noContact,

    // Détail CB AMEX
    cb_amex_contact: totals.cardAmex.contact,
    cb_amex_no_contact: totals.cardAmex.noContact,

    // Détail CB ANCV (télécollecte)
    cb_ancv_contact: totals.cardAncv.contact,
    cb_ancv_no_contact: totals.cardAncv.noContact,

    // Détail ANCV papier (nombres de titres)
    ancv_paper_10: totals.ancvPaper.nb10,
    ancv_paper_20: totals.ancvPaper.nb20,
    ancv_paper_25: totals.ancvPaper.nb25,
    ancv_paper_50: totals.ancvPaper.nb50,

    // Agrégats
    mypos: totals.myPos.total,
    mypos_count: totals.myPos.count,
    cb_classic: totals.cardClassic.total,
    cb_ticket_resto: totals.cardTr.total,
    cb_amex: totals.cardAmex.total,
    ancv_connect: totals.cardAncv.total,
    cash_counted: totals.cash.countedTotal,
    cash_adipos: totals.cash.adipos,
    cash_delta: totals.cash.difference,
    ancv_paper: totals.ancvPaper.total,
    checks_total: totals.checks.total,
    checks_count: totals.checks.count,
    vat_5_5: totals.vat.ttc55,
    vat_10: totals.vat.ttc10,
    vat_20: totals.vat.ttc20,

    // Fréquentation
    pizzas_dine_in: totals.pizzas.dineIn,
    pizzas_takeaway: totals.pizzas.takeaway,

    // Chiffre d’affaires = somme des montants TVA TTC
    total_revenue: totals.vatTotal,
  };
}