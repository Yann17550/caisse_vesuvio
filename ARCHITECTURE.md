# PROJET : CLÔTURES VESUVIO — Architecture multi-applications

## 1. Objet du projet

Le projet gère les clôtures de service des établissements de l’EIRL :
encaissements, contrôles de cohérence, TVA, enregistrement Supabase
et clôture journalière.

Le terme « caisse » ne décrit pas correctement le périmètre fonctionnel.
Les applications sont donc nommées :

- `clotures-vesuvio`
- `clotures-pizz-doleron`

## 2. Contexte métier

- Une EIRL, deux établissements :
  - Le Vesuvio : `etablissement_id = 2`
  - Pizza d’Oléron : `etablissement_id = 1`, à confirmer en base.
- Pizza d’Oléron : service du Soir uniquement, pas de Midi.
- Comptabilités séparées par établissement.
- Consolidation possible au niveau de l’EIRL.
- Objectif long terme : plusieurs applications partageant un tronc commun :
  - Page d’accueil
  - Clôtures Vesuvio
  - Clôtures Pizza d’Oléron
  - Facturation
  - TVA
  - Autres modules futurs

## 3. Stack et déploiement

- Dépôt GitHub : `Yann17550/caisse_vesuvio`
- Branche de travail : `feature/midi-mobile-layout`
- Déploiement prévu : Vercel, un seul projet Vercel pour l’instant.
- Base de données : Supabase.
- Tables connues :
  - `daily_closings`
  - `etablissements`
  - tables de détails de paiements
- Projet local : `C:\MesProjets\caisse_vesuvio`

Le nom du dépôt GitHub peut rester `caisse_vesuvio` pour l’instant.
Le nom fonctionnel des modules applicatifs est en revanche
`accueil`, `clotures-vesuvio` et `clotures-pizz-doleron`.

## 4. État fonctionnel validé

### Midi — Le Vesuvio

- Saisie des encaissements et de la TVA.
- Contrôle de cohérence : CA hors MyPOS = TVA TTC.
- Enregistrement dans Supabase.
- Clôture du service.
- Verrouillage après succès.
- Remise à zéro après succès.
- L’AMEX n’est pas saisi au Midi et n’est donc pas inclus dans ce contrôle.

### Soir — Le Vesuvio

- Pages : CB, Espèces, ANCV, Chèques, Récapitulatif.
- ANCV papier saisi par dénominations : 10, 20, 25 et 50.
- Enregistrement des détails dans Supabase.
- Contrôle de cohérence TVA.
- Enregistrement et clôture du service.

### Établissement

- Chaque clôture est actuellement rattachée à
  `etablissement_id = 2` (Le Vesuvio).
- Cette valeur est actuellement définie par défaut dans
  `js/services/dailyClosingService.js`.
- À terme, l’établissement actif proviendra de la page d’accueil
  et de la configuration.

## 5. Architecture cible

### Principe général

- Pas de dossier `apps/`.
- Structure plate.
- `accueil/`, `core/`, `clotures-vesuvio/` et
  `clotures-pizz-doleron/` sont au même niveau.
- `core/` contient uniquement des briques génériques.
- Aucune règle métier de clôture ne doit se trouver dans `core/`.
- Le multi-établissement passe par la page d’accueil et la configuration.
- Les pages ne doivent jamais coder en dur un `etablissement_id`.

### Arborescence cible

```text
accueil/
  pageAccueil.js
  selectionEtablissement.js
  navigationApplications.js

core/
  configuration/
  base-de-donnees/
  montants/
  validation/
  interface/

clotures-vesuvio/
  midi/
  soir/
  services/

clotures-pizz-doleron/
  soir/
  services/
```

### Rôle des dossiers

| Dossier | Rôle |
|---|---|
| `accueil/` | Point d’entrée, sélection d’établissement, navigation entre applications |
| `core/configuration/` | Configuration application, établissements, environnement |
| `core/base-de-donnees/` | Client Supabase, accès générique, brouillons |
| `core/montants/` | Conversion, arrondi, opérations sur montants |
| `core/validation/` | Règles de validation génériques, sans DOM |
| `core/interface/` | UX, DOM, navigation, formatage, erreurs, listes |
| `clotures-vesuvio/` | Application de clôture du Vesuvio |
| `clotures-pizz-doleron/` | Future application de clôture de Pizza d’Oléron |

## 6. Page d’accueil — première tâche

La création de la page d’accueil est la **première tâche du projet**,
avant toute refactorisation du code existant.

### Objectif

Créer un point d’entrée unique permettant :

- d’afficher les applications disponibles ;
- d’accéder à Clôtures Vesuvio ;
- d’accéder à Clôtures Pizza d’Oléron ;
- d’accéder aux futurs modules : facturation, TVA, etc. ;
- de sélectionner l’établissement actif ;
- de mémoriser l’établissement actif pendant la session ;
- de transmettre l’établissement actif aux applications de clôture.

### Règle multi-établissement

- L’établissement actif est sélectionné depuis la page d’accueil.
- Les applications de clôture lisent l’établissement actif
  depuis la configuration ou l’état de session.
- Aucune page de clôture ne doit contenir de valeur codée en dur
  telle que `etablissement_id: 2`.

### Structure cible

```text
accueil/
  pageAccueil.js
  selectionEtablissement.js
  navigationApplications.js
```

| Fichier | Responsabilité |
|---|---|
| `pageAccueil.js` | Afficher la page d’accueil et orchestrer ses modules |
| `selectionEtablissement.js` | Sélectionner, valider et mémoriser l’établissement actif |
| `navigationApplications.js` | Gérer les boutons et la navigation vers les applications |

### Ordre de réalisation

1. Lire `index.html`, `js/main.js` et `js/config.js`.
2. Créer la page d’accueil.
3. Créer la sélection d’établissement.
4. Créer la navigation vers les applications.
5. Créer `core/configuration/configurationEtablissements.js`.
6. Tester la navigation et la sélection d’établissement sur téléphone.
7. Commit et push après validation.

## 7. Structure Vesuvio cible

```text
clotures-vesuvio/
  midi/
    gestionClotureMidi.js
    vueMidi.js
    modeleVueMidi.js
    validationClotureMidi.js
    affichageRecapitulatifMidi.js

  soir/
    navigationServiceSoir.js
    collecteDonneesClotureSoir.js
    vueSoir.js
    modeleVueSoir.js
    validationClotureSoir.js
    pages/
      pageCartesBancaires.js
      pageEspeces.js
      pageAncv.js
      pageCheques.js
      pageRecapitulatif.js

  services/
    serviceClotureJournaliere.js
```

## 8. Structure Oléron future

Pizza d’Oléron n’a pas de service du Midi.

```text
clotures-pizz-doleron/
  soir/
    navigationServiceSoir.js
    collecteDonneesClotureSoir.js
    vueSoir.js
    modeleVueSoir.js
    validationClotureSoir.js
    pages/
      pageCartesBancaires.js
      pageEspeces.js
      pageAncv.js
      pageCheques.js
      pageRecapitulatif.js

  services/
    serviceClotureJournaliere.js
```

Ces fichiers ne seront créés que lors de la migration réelle
de l’application Pizza d’Oléron.

## 9. Nomenclature validée

### Règles

- Noms de fichiers et de fonctions en français.
- Pas de noms vagues : `utils`, `helpers`, `controller` sont proscrits.
- Le nom décrit la responsabilité métier réelle.
- Le DOM est isolé dans `core/interface/`.
- Les règles métier Vesuvio restent dans `clotures-vesuvio/`.
- Les règles métier Oléron resteront dans `clotures-pizz-doleron/`.

### Correspondances validées

| Fichier actuel | Nom cible | Destination |
|---|---|---|
| `js/features/midi/midiController.js` | `gestionClotureMidi.js` | `clotures-vesuvio/midi/` |
| `js/features/midi/midiRecap.js` | `affichageRecapitulatifMidi.js` | `clotures-vesuvio/midi/` |
| `js/features/midi/midiTemplate.js` | `modeleVueMidi.js` | `clotures-vesuvio/midi/` |
| `js/features/midi/midiView.js` | `vueMidi.js` | `clotures-vesuvio/midi/` |
| `js/features/soir/soirController.js` | `navigationServiceSoir.js` | `clotures-vesuvio/soir/` |
| `js/features/soir/soirTotals.js` | `collecteDonneesClotureSoir.js` | `clotures-vesuvio/soir/` |
| `js/features/soir/soirTemplate.js` | `modeleVueSoir.js` | `clotures-vesuvio/soir/` |
| `js/features/soir/soirView.js` | `vueSoir.js` | `clotures-vesuvio/soir/` |
| `js/services/dailyClosingService.js` | `serviceClotureJournaliere.js` | `clotures-vesuvio/services/` |

### Fonctions validées

| Fonction actuelle | Nom cible |
|---|---|
| `parseAmount` | `convertirEnMontant` |
| `roundToTwoDecimals` | `arrondirADeuxDecimales` |
| `getAmountFromText` | `lireMontantDepuisTexte` |
| `getAmountFromInput` | `lireMontantDepuisChamp` |
| `getQuantityFromInput` | `lireQuantiteDepuisChamp` |
| `isValidAmount` | `estMontantValide` |
| `isFilled` | `estRenseigne` |
| `showFieldError` | `afficherErreurChamp` |
| `clearFieldError` | `effacerErreurChamp` |
| `validateAmountFields` | `validerChampsMontants` |
| `validatePositiveAmount` | `validerMontantStrictementPositif` |
| `validateNonNegativeAmount` | `validerMontantPositifOuNul` |
| `validateNonNegativeInteger` | `validerEntierPositifOuNul` |
| `getSoirTotals` | `collecterDonneesClotureSoir` |

## 10. Doublons identifiés

### `parseAmount`

Deux implémentations existent :

- `js/utils/validation.js`
- `js/utils/calculations.js`

La version de `js/utils/calculations.js` est la plus robuste :
elle gère les espaces, le symbole euro, la virgule et le point.

Décision :

- Conserver une seule fonction : `convertirEnMontant`.
- La placer dans `core/montants/conversionMontants.js`.
- Faire dépendre toutes les validations de cette fonction unique.

### Validation des montants

- `js/utils/validation.js` contient `isValidAmount`.
- `js/validation/amountValidation.js` contient
  `validateNonNegativeAmount` et `validatePositiveAmount`.

Décision :

- Conserver les fonctions structurées de
  `js/validation/amountValidation.js`.
- Les migrer vers `core/validation/reglesMontants.js`.
- `isValidAmount` pourra devenir un raccourci ou disparaître
  après migration complète des usages.

### Lecture DOM

- `js/utils/amounts.js` mélange conversion et accès DOM.
- `soirTotals.js` lit directement le DOM, y compris des spans cachés.

Décision :

- Isoler la lecture DOM dans `core/interface/champsMontants.js`.
- À terme, introduire un état de clôture du Soir
  afin de ne plus utiliser le DOM comme source de vérité.

## 11. Briques UX globales

Ces briques doivent être réutilisables par l’accueil, le Midi, le Soir
et les futures applications.

| Brique | Fichier cible |
|---|---|
| Effacer au focus, restaurer au blur | `core/interface/comportementChampTexte.js` |
| Navigation Entrée / Tab | `core/interface/navigationFormulaire.js` |
| Listes de paiements | `core/interface/listesPaiements.js` |
| Remise à zéro après validation réussie | `core/interface/remiseAZeroFormulaire.js` |
| Masquage des lignes à zéro | `core/interface/affichageLignesNonNulles.js` |
| Formatage euro | `core/interface/formatageEuro.js` |
| Formatage entier | `core/interface/formatageEntier.js` |
| Erreurs de champs | `core/interface/erreursChamps.js` |
| Lecture des montants dans le DOM | `core/interface/champsMontants.js` |

## 12. Déroulement des tâches

### Phase 1 — Page d’accueil

1. Lire `index.html`, `js/main.js` et `js/config.js`.
2. Créer la page d’accueil.
3. Créer la sélection d’établissement.
4. Créer la navigation vers les applications.
5. Créer `core/configuration/configurationEtablissements.js`.
6. Tester la navigation et la sélection d’établissement sur téléphone.
7. Commit et push après validation.

### Phase 2 — Refactorisation du tronc commun

1. Créer `core/montants/conversionMontants.js`.
2. Transformer `js/utils/calculations.js` en façade temporaire.
3. Créer `core/montants/operationsMontants.js`.
4. Créer `core/validation/reglesMontants.js`.
5. Créer `core/validation/reglesSaisies.js`.
6. Créer `core/interface/champsMontants.js`.
7. Créer `core/interface/erreursChamps.js`.
8. Créer `core/interface/comportementChampTexte.js`.
9. Créer `core/interface/navigationFormulaire.js`.
10. Créer `core/interface/listesPaiements.js`.

### Phase 3 — Migration des clôtures Vesuvio

1. Migrer le Midi vers `clotures-vesuvio/midi/`.
2. Migrer le Soir vers `clotures-vesuvio/soir/`.
3. Migrer le service de clôture vers `clotures-vesuvio/services/`.
4. Supprimer les anciens fichiers, uniquement après validation complète.

### Phase 4 — Clôtures Pizza d’Oléron

1. Créer `clotures-pizz-doleron/`.
2. Créer le module Soir.
3. Créer le service de clôture.
4. Utiliser l’établissement actif sélectionné depuis l’accueil.

## 13. Méthode de travail imposée

- Aucune supposition : demander à voir un fichier avant tout diagnostic
  ou modification.
- Une seule tâche à la fois.
- Modification minimale.
- Fichier complet à remplacer lorsqu’une modification est nécessaire.
- Test sur téléphone après chaque étape.
- Commit et push après chaque étape validée.
- Ne rien supprimer sans validation explicite.
- Penser aux répercussions transverses :
  - Page d’accueil
  - Récapitulatifs
  - Supabase
  - Midi / Soir
  - Établissements
  - Futures applications

## 14. État de la migration

- [x] Création du fichier `ARCHITECTURE.md`.
- [ ] Lecture de `index.html`, `js/main.js` et `js/config.js`.
- [ ] Création de la page d’accueil.
- [ ] Création de la sélection d’établissement.
- [ ] Création de la navigation vers les applications.
- [ ] Création de `core/configuration/configurationEtablissements.js`.
- [ ] Test navigation et sélection d’établissement sur téléphone.
- [ ] Création de `core/montants/conversionMontants.js`.
- [ ] Façade temporaire pour `js/utils/calculations.js`.
- [ ] Création de `core/montants/operationsMontants.js`.
- [ ] Création de `core/validation/reglesMontants.js`.
- [ ] Création de `core/validation/reglesSaisies.js`.
- [ ] Création de `core/interface/champsMontants.js`.
- [ ] Création de `core/interface/erreursChamps.js`.
- [ ] Création de `core/interface/comportementChampTexte.js`.
- [ ] Migration du Midi.
- [ ] Migration du Soir.
- [ ] Migration du service de clôture.
- [ ] Suppression des anciens fichiers.

## 15. Dernier commit validé

```text
docs: ajouter ARCHITECTURE.md comme référence de migration multi-applications
```

- Branche : `feature/midi-mobile-layout`
- Commit : `88097a1`
- Dépôt : `Yann17550/caisse_vesuvio`
- Fichier : `ARCHITECTURE.md`
