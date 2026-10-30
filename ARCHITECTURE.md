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

### Page d’accueil

- L’application démarre sur la page d’accueil.
- Le bouton « Clôtures » ouvre le choix de l’établissement.
- Le choix « Le Vesuvio » ouvre les clôtures Vesuvio.
- Le choix « Pizza d’Oléron » affiche « Application non disponible ».
- La navigation Midi / Soir est masquée tant que les clôtures Vesuvio
  ne sont pas ouvertes.
- Les clôtures Vesuvio s’ouvrent sur le service Midi.
- Le passage Midi / Soir fonctionne.
- Le retour à l’accueil depuis une clôture n’est pas encore implémenté.
- Un rafraîchissement de la page permet actuellement de revenir à l’accueil.

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

### Règle absolue pendant la refactorisation

- Le dossier `js/` correspond à l’ancien code fonctionnel.
- **Aucun fichier du dossier `js/` ne doit être modifié tant que
  la refactorisation n’est pas complète et validée.**
- Pendant la refactorisation, on crée uniquement des fichiers dans `core/`.
- Les nouveaux modules `core/` ne sont pas encore importés par l’ancien code.
- Les imports de `js/` vers `core/` seront migrés uniquement après
  création et validation complète des modules `core/`.
- Les anciens fichiers `js/` pourront ensuite devenir des façades
  temporaires, uniquement après validation de la migration des imports.
- Les anciens fichiers seront supprimés uniquement après validation
  complète de l’application.

### Règle pendant la phase d’accueil

- Le dossier `js/` correspond à l’ancien code fonctionnel.
- Pendant la phase d’accueil, aucun fichier de `js/` ne doit être modifié.
- Le nouveau point d’entrée est `accueil/demarrageApplication.js`.
- `index.html` est la nouvelle page d’accueil.
- `index-initial.html` est une sauvegarde temporaire locale,
  non commitée, conservée jusqu’à validation complète de la nouvelle
  navigation.

### Arborescence actuelle validée

```text
index.html
index-initial.html

accueil/
  demarrageApplication.js
  pageAccueil.js
  vueAccueil.js
  selectionEtablissement.js
  navigationApplications.js

css/
  accueil.css
  style.css
  midi.css
  soir.css

core/
  configuration/
    configurationEtablissements.js

js/
  main.js
  config.js
  supabaseClient.js
  features/
  services/
  utils/
  validation/
```

### Arborescence cible à terme

```text
accueil/
  demarrageApplication.js
  pageAccueil.js
  vueAccueil.js
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
| `js/` | Ancien code fonctionnel, intact jusqu’à la fin de la refactorisation |

## 6. Page d’accueil — phase 1

La création de la page d’accueil est la **première tâche du projet**,
avant toute refactorisation du code existant.

### Comportement validé

1. L’application s’ouvre sur l’accueil.
2. L’utilisateur clique sur « Clôtures ».
3. L’accueil affiche le choix de l’établissement.
4. Le choix « Le Vesuvio » ouvre les clôtures Vesuvio.
5. Le choix « Pizza d’Oléron » affiche « Application non disponible ».
6. Les clôtures Vesuvio s’ouvrent sur le service Midi.
7. La navigation Midi / Soir devient disponible.
8. Le retour à l’accueil depuis une clôture sera ajouté dans une étape
   ultérieure.

### Règle multi-établissement

- L’établissement actif est sélectionné depuis la page d’accueil.
- Les applications de clôture lisent l’établissement actif
  depuis la configuration ou l’état de session.
- Aucune page de clôture ne doit contenir de valeur codée en dur
  telle que `etablissement_id: 2`.

### Structure validée

```text
accueil/
  demarrageApplication.js
  pageAccueil.js
  vueAccueil.js
  selectionEtablissement.js
  navigationApplications.js
```

| Fichier | Responsabilité |
|---|---|
| `demarrageApplication.js` | Point d’entrée unique : démarre l’accueil, puis les clôtures Vesuvio |
| `pageAccueil.js` | Orchestre la page d’accueil, sans manipuler le DOM |
| `vueAccueil.js` | Manipule le DOM de l’accueil |
| `selectionEtablissement.js` | Sélectionne, valide et mémorise l’établissement actif |
| `navigationApplications.js` | Définit les applications et détermine la destination |

### Séparation des responsabilités

- `pageAccueil.js` ne touche pas directement au DOM.
- `vueAccueil.js` ne contient aucune règle métier.
- `selectionEtablissement.js` ne touche pas au DOM.
- `navigationApplications.js` ne touche pas au DOM.
- `demarrageApplication.js` ne contient aucune logique métier.

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
- Le DOM est isolé dans les modules de vue.
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

- Créer `convertirEnMontant` dans
  `core/montants/conversionMontants.js`.
- Ne pas modifier `js/utils/calculations.js` pendant la création
  des modules `core/`.
- Migrer les imports vers `core/` uniquement après validation complète
  des modules `core/`.
- Transformer ensuite les anciens fichiers en façades temporaires,
  puis les supprimer après validation complète.

### Validation des montants

- `js/utils/validation.js` contient `isValidAmount`.
- `js/validation/amountValidation.js` contient
  `validateNonNegativeAmount` et `validatePositiveAmount`.

Décision :

- Créer les fonctions structurées dans
  `core/validation/reglesMontants.js`.
- Ne pas modifier `js/utils/validation.js` ni
  `js/validation/amountValidation.js` pendant la création des modules
  `core/`.
- Migrer les imports uniquement après validation complète.

### Lecture DOM

- `js/utils/amounts.js` mélange conversion et accès DOM.
- `soirTotals.js` lit directement le DOM, y compris des spans cachés.

Décision :

- Créer `core/interface/champsMontants.js` pour isoler la lecture DOM.
- Ne pas modifier `js/utils/amounts.js` pendant la création des modules
  `core/`.
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
2. Créer `core/configuration/configurationEtablissements.js`.
3. Créer `accueil/selectionEtablissement.js`.
4. Créer `accueil/navigationApplications.js`.
5. Créer `accueil/pageAccueil.js`.
6. Créer `accueil/vueAccueil.js`.
7. Refactorer `accueil/pageAccueil.js` pour déléguer le DOM à `vueAccueil.js`.
8. Créer `accueil/demarrageApplication.js`.
9. Remplacer `index.html` par la page d’accueil.
10. Créer `css/accueil.css`.
11. Tester la navigation et la sélection d’établissement sur téléphone.
12. Commit et push après validation.

### Phase 1 bis — Retour à l’accueil

1. Ajouter un bouton « Accueil » visible lorsque les clôtures Vesuvio
   sont ouvertes.
2. Permettre le retour à l’accueil sans rafraîchir la page.
3. Tester sur téléphone.
4. Commit et push après validation.

### Phase 2 — Création du tronc commun

1. Créer `core/montants/conversionMontants.js`.
2. Créer `core/montants/operationsMontants.js`.
3. Créer `core/validation/reglesMontants.js`.
4. Créer `core/validation/reglesSaisies.js`.
5. Créer `core/interface/champsMontants.js`.
6. Créer `core/interface/erreursChamps.js`.
7. Créer `core/interface/comportementChampTexte.js`.
8. Créer `core/interface/navigationFormulaire.js`.
9. Créer `core/interface/listesPaiements.js`.
10. Ne modifier aucun fichier de `js/` pendant cette phase.

### Phase 3 — Migration des imports

1. Migrer les imports de `js/` vers `core/`, fichier par fichier.
2. Tester Midi et Soir après chaque migration.
3. Transformer les anciens fichiers `js/` en façades temporaires,
   uniquement lorsque tous leurs usages ont été migrés.
4. Supprimer les anciens fichiers, uniquement après validation complète.

### Phase 4 — Migration des clôtures Vesuvio

1. Migrer le Midi vers `clotures-vesuvio/midi/`.
2. Migrer le Soir vers `clotures-vesuvio/soir/`.
3. Migrer le service de clôture vers `clotures-vesuvio/services/`.
4. Supprimer les anciens fichiers, uniquement après validation complète.

### Phase 5 — Clôtures Pizza d’Oléron

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
- **Ne modifier aucun fichier de `js/` tant que la refactorisation
  n’est pas complète et validée.**
- Penser aux répercussions transverses :
  - Page d’accueil
  - Récapitulatifs
  - Supabase
  - Midi / Soir
  - Établissements
  - Futures applications

## 14. État de la migration

- [x] Création du fichier `ARCHITECTURE.md`.
- [x] Lecture de `index.html`, `js/main.js` et `js/config.js`.
- [x] Création de `core/configuration/configurationEtablissements.js`.
- [x] Création de `accueil/selectionEtablissement.js`.
- [x] Création de `accueil/navigationApplications.js`.
- [x] Création de `accueil/pageAccueil.js`.
- [x] Création de `accueil/vueAccueil.js`.
- [x] Refactorisation de `accueil/pageAccueil.js`.
- [x] Création de `accueil/demarrageApplication.js`.
- [x] Remplacement de `index.html` par la page d’accueil.
- [x] Création de `css/accueil.css`.
- [x] Test navigation et sélection d’établissement sur téléphone.
- [ ] Ajout du bouton « Accueil » dans les clôtures Vesuvio.
- [ ] Suppression de `index-initial.html` après validation complète.
- [ ] Création de `core/montants/conversionMontants.js`.
- [ ] Création de `core/montants/operationsMontants.js`.
- [ ] Création de `core/validation/reglesMontants.js`.
- [ ] Création de `core/validation/reglesSaisies.js`.
- [ ] Création de `core/interface/champsMontants.js`.
- [ ] Création de `core/interface/erreursChamps.js`.
- [ ] Création de `core/interface/comportementChampTexte.js`.
- [ ] Migration des imports de `js/` vers `core/`.
- [ ] Migration du Midi.
- [ ] Migration du Soir.
- [ ] Migration du service de clôture.
- [ ] Suppression des anciens fichiers.

## 15. Commits validés

```text
feat(midi): contrôle cohérence TVA et remise à zéro après validation
```

```text
docs: ajouter ARCHITECTURE.md comme référence de migration multi-applications
```

```text
docs: planifier la création de la page d’accueil avant la refactorisation
```

```text
feat(configuration): ajouter la configuration des établissements
```

```text
feat(accueil): ajouter la sélection de l’établissement actif
```

```text
feat(accueil): ajouter la navigation vers les applications
```

```text
feat(accueil): ajouter la page d’accueil et la navigation vers les clôtures
```

```text
feat(accueil): ajouter la vue de la page d’accueil
```

```text
refactor(accueil): déléguer le DOM de l’accueil à vueAccueil
```

```text
feat(accueil): ajouter le point d’entrée de l’application
```

```text
feat(accueil): intégrer la page d’accueil et ses styles
```

- Branche : `feature/midi-mobile-layout`
- Dépôt : `Yann17550/caisse_vesuvio`
- Dernier commit accueil : intégration de la page d’accueil et de ses styles.
