# Caisse Vesuvio


Application de gestion des encaissements journaliers pour la pizzeria **Le Vesuvio**.


Elle permet de saisir, contrôler et archiver les encaissements du service du **Midi** et du **Soir**, avec un suivi des écarts de caisse, du fond de caisse et des éléments nécessaires à la comptabilité mensuelle.


## Objectif


Reconstruction moderne de l’application de caisse, avec une organisation claire du code et une séparation entre :


- La saisie des encaissements (Midi et Soir)
- L’archivage des journées de caisse dans Supabase
- Le contrôle des écarts entre encaissements théoriques et réels
- La gestion du fond de caisse
- La préparation des données pour la comptabilité mensuelle et les statistiques


## Fonctionnement général


L’application est organisée autour de deux services distincts :


### Service Midi


Le service du Midi permet de saisir les encaissements de la journée :


- Les paiements myPOS, saisis paiement par paiement
- La CB classique, la CB Ticket Restaurant, les espèces Adipos
- Les ANCV papier et dématérialisés
- Les chèques
- La TVA (5,5 %, 10 %, 20 %)
- La fréquentation (pizzas sur place et à emporter)


La validation enregistre la clôture dans Supabase et verrouille le formulaire.


### Service Soir


Le service du Soir est organisé en pages, dans cet ordre :


1. **CB** : CB classique, Ticket Restaurant, ANCV et AMEX, chacune distinguant contact / sans contact, plus les paiements myPOS
2. **Espèces** : fond de caisse, décompte des billets et pièces, espèces Adipos
3. **ANCV** : titres papier par dénomination (10 €, 20 €, 25 €, 50 €)
4. **Chèques** : saisie paiement par paiement
5. **Récapitulatif** : totaux, écarts, fréquentation, TVA et validation


La validation du Soir est **bloquée si le contrôle de cohérence entre les encaissements et la TVA échoue**. Après un enregistrement réussi, l’interface est remise à zéro.


## Règles métier


- **Le fond de caisse ne fait pas partie du chiffre d’affaires.** Il n’intervient que pour calculer l’écart de caisse lors du comptage physique.
- `cash_counted` correspond au **CA en espèces net du fond de caisse** : `(billets + pièces) - fond de caisse`, sans jamais être négatif.
- `cash_delta` correspond à l’écart de caisse : `cash_counted - espèces Adipos`.
- Le total des encaissements du Soir **exclut le myPOS**.
- Le contrôle de cohérence du Soir compare le total TVA TTC aux encaissements (myPOS exclu).
- `total_revenue` correspond à la somme des montants TVA TTC.


## Architecture du code


Le projet sépare strictement les responsabilités :


```text
js/
├── features/
│   ├── midi/
│   │   ├── midiController.js
│   │   ├── midiView.js
│   │   ├── midiTemplate.js
│   │   ├── midiRecap.js
│   │   └── pages/
│   └── soir/
│       ├── soirController.js
│       ├── soirView.js
│       ├── soirTemplate.js
│       ├── soirTotals.js
│       └── pages/
│           ├── cashPage.js
│           ├── cardPage.js
│           ├── ancvPage.js
│           ├── checksPage.js
│           ├── recapPage.js
│           └── templates/
├── validation/
│   ├── midiValidation.js
│   ├── soirValidation.js
│   ├── amountValidation.js
│   └── closingValidation.js
├── services/
│   └── dailyClosingService.js
├── utils/
│   ├── amounts.js
│   ├── calculations.js
│   ├── format.js
│   ├── formNavigation.js
│   ├── paymentList.js
│   └── validation.js
└── supabaseClient.js
```


### Séparation des responsabilités


- **Templates** (`*Template.js`) : HTML uniquement, aucune logique.
- **Vues** (`*View.js`, `*Page.js`) : affichage, navigation, écouteurs — aucun calcul métier ni accès Supabase.
- **Contrôleurs** (`*Controller.js`) : coordination des pages et de la navigation.
- **Totaux** (`soirTotals.js`) : source de vérité des montants du Soir.
- **Validation** (`js/validation/`) : contrôles et construction des données à enregistrer — aucune dépendance au DOM ni à Supabase.
- **Services** (`js/services/`) : seul endroit autorisé à communiquer avec Supabase.


### Utilitaires partagés


- `paymentList.js` : composant unique de liste de paiements (saisie, Entrée, suppression, total), utilisé par le myPOS du Midi, le myPOS du Soir et les chèques du Soir.
- `formNavigation.js` : navigation entre les champs avec la touche Entrée.
- `amounts.js`, `calculations.js`, `format.js` : lecture des montants, calculs et formatage.


## Stack technique


- **HTML / CSS / JavaScript** : application front-end légère, sans framework lourd
- **Supabase** : base de données et API
- **Git / GitHub** : versioning et sauvegarde du code
- **Vercel** : déploiement prévu


## Base de données


La table `daily_closings` archive une clôture par date et par service (`midi` / `soir`), avec une contrainte d’unicité sur `(business_date, service)`.


### Colonnes principales


| Colonne | Rôle |
|---|---|
| `mypos` | Total des paiements myPOS |
| `cb_classic` / `cb_ticket_resto` / `cb_amex` / `ancv_connect` | Totaux par type de carte |
| `cb_classic_contact` / `cb_classic_no_contact` | Détail CB classique |
| `cb_tr_contact` / `cb_tr_no_contact` | Détail CB Ticket Restaurant |
| `cb_amex_contact` / `cb_amex_no_contact` | Détail CB AMEX |
| `cb_ancv_contact` / `cb_ancv_no_contact` | Détail CB ANCV |
| `ancv_paper` | Total ANCV papier |
| `ancv_paper_10` / `_20` / `_25` / `_50` | Nombre de titres par dénomination |
| `cash_counted` | CA en espèces net du fond de caisse |
| `cash_adipos` | Espèces Adipos |
| `cash_delta` | Écart de caisse |
| `checks_total` | Total des chèques |
| `vat_5_5` / `vat_10` / `vat_20` | Montants TVA TTC |
| `pizzas_dine_in` / `pizzas_takeaway` | Fréquentation |
| `total_revenue` | Somme des montants TVA TTC |
| `status` | `open` ou `closed` |


Les totaux (`cb_classic`, `ancv_paper`, etc.) sont recalculés à partir des colonnes de détail, qui servent aux statistiques fines.


## Démarrage


1. Cloner le dépôt :


```bash
git clone [https://github.com/Yann17550/caisse_vesuvio.git](https://github.com/Yann17550/caisse_vesuvio.git)
```


2. Ouvrir le projet dans VS Code.


3. Lancer l’application avec un serveur local, par exemple avec l’extension **Live Server**.


4. Ouvrir `index.html` dans le navigateur.


## Tests à effectuer


Après chaque modification, vérifier :


- La saisie des montants au Midi et au Soir
- La navigation entre les champs avec la touche Entrée
- Le fonctionnement du myPOS et des chèques (ajout, suppression, total)
- Le calcul du récapitulatif et le contrôle de cohérence
- L’enregistrement dans Supabase (Midi et Soir)
- La remise à zéro du Soir après validation
- L’absence d’erreur dans la console du navigateur


## Déploiement


Le déploiement est prévu sur **Vercel**, afin de rendre l’application accessible depuis les postes de la pizzeria.


## Roadmap


- [x] Service Midi fonctionnel (saisie, validation, enregistrement Supabase)
- [x] Service Soir : CB, Espèces, ANCV, Chèques et Récapitulatif
- [x] Utilitaires partagés pour la navigation et les paiements
- [x] Validation des saisies avant enregistrement
- [x] Enregistrement des clôtures Midi et Soir dans Supabase
- [x] Détail des paiements par type (contact / sans contact, dénominations ANCV)
- [ ] Habillage mobile
- [ ] Déploiement Vercel
- [ ] Comptabilité mensuelle
- [ ] Statistiques par type de paiement