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

## 5. Stratégie retenue : construction parallèle

### Décision validée

- **La migration du dossier `js/` est abandonnée.**
- `js/` reste le code historique qui assure actuellement
  le fonctionnement du Midi et du Soir.
- `js/` n’est plus modifié, ni refactorisé, ni migré.
- La nouvelle application Vesuvio est construite en parallèle
  dans `core/` et `clotures-vesuvio/`.
- `core/` fournit les briques génériques réutilisables.
- `clotures-vesuvio/` contiendra la nouvelle application de clôture.
- La bascule vers la nouvelle application se fera uniquement
  lorsqu’elle sera complète, testée et validée.
- `js/` sera supprimé uniquement après la bascule finale.

### Règle absolue

- **Aucun fichier du dossier `js/` ne doit être modifié.**
- Aucune façade temporaire ne doit être créée dans `js/`.
- Aucun import de `js/` ne doit être modifié.
- Toute nouvelle fonctionnalité se construit dans `core/`
  ou dans `clotures-vesuvio/`.
- Aucune règle métier de clôture ne doit se trouver dans `core/`.
- Les pages ne doivent jamais coder en dur un `etablissement_id`.

### Leçon validée

- Une tentative de modification de `js/utils/calculations.js`
  a été réalisée puis annulée par le commit `e871add`.
- Cette expérience confirme que la modification de `js/`
  pendant la construction de la nouvelle architecture
  crée un risque de mélange des méthodes.
- La stratégie retenue est donc la construction parallèle,
  sans toucher à `js/`.

### Règle pendant la phase d’accueil

- Le dossier `js/` correspond au code historique.
- Aucun fichier de `js/` ne doit être modifié.
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
  base-de-donnees/
    accesCloturesJournalieres.js
    clientSupabase.js

  configuration/
    configurationApplication.js
    configurationEtablissements.js

  interface/
    affichageLignesNonNulles.js
    champsMontants.js
    comportementChampTexte.js
    erreursChamps.js
    formatageEntier.js
    formatageEuro.js
    listesPaiements.js
    navigationFormulaire.js
    remiseAZeroFormulaire.js

  montants/
    conversionMontants.js
    operationsMontants.js

  validation/
    reglesMontants.js
    reglesSaisies.js

js/
  main.js
  config.js
  supabaseClient.js
  features/
  services/
  utils/
  validation/
```

### Arborescence cible

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
| `clotures-vesuvio/` | Nouvelle application de clôture du Vesuvio |
| `clotures-pizz-doleron/` | Future application de clôture de Pizza d’Oléron |
| `js/` | Code historique, non modifiable, à supprimer après bascule |

## 6. Page d’accueil — phase 1

La création de la page d’accueil est la **première tâche du projet**,
avant la construction de la nouvelle application Vesuvio.

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

## 7. Nouvelle application Vesuvio

La nouvelle application Vesuvio sera construite dans
`clotures-vesuvio/`, en utilisant les briques de `core/`.

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

Ces fichiers seront créés progressivement,
sans modifier `js/`.

## 8. Application Oléron future

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

Ces fichiers seront créés lors de la construction réelle
de l’application Pizza d’Oléron.

## 9. Nomenclature validée

### Règles

- Noms de fichiers et de fonctions en français.
- Pas de noms vagues : `utils`, `helpers`, `controller` sont proscrits.
- Le nom décrit la responsabilité métier réelle.
- Le DOM est isolé dans les modules de vue.
- Les règles métier Vesuvio restent dans `clotures-vesuvio/`.
- Les règles métier Oléron resteront dans `clotures-pizz-doleron/`.

### Fonctions validées

| Fonction historique | Nom cible |
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

## 10. Doublons historiques

Les doublons présents dans `js/` sont conservés tels quels.
Ils ne seront pas corrigés, car `js/` n’est plus modifié.

La nouvelle application utilisera uniquement les modules `core/` :

- `core/montants/conversionMontants.js` pour la conversion ;
- `core/validation/reglesMontants.js` pour la validation ;
- `core/interface/champsMontants.js` pour la lecture DOM.

## 11. Briques UX globales

Ces briques sont disponibles pour la nouvelle application Vesuvio
et les futures applications.

| Brique | Fichier cible | État |
|---|---|---|
| Effacer au focus, restaurer au blur | `core/interface/comportementChampTexte.js` | Créé |
| Navigation Entrée / Tab | `core/interface/navigationFormulaire.js` | Créé |
| Listes de paiements | `core/interface/listesPaiements.js` | Créé |
| Remise à zéro après validation réussie | `core/interface/remiseAZeroFormulaire.js` | Créé |
| Masquage des lignes à zéro | `core/interface/affichageLignesNonNulles.js` | Créé |
| Formatage euro | `core/interface/formatageEuro.js` | Créé |
| Formatage entier | `core/interface/formatageEntier.js` | Créé |
| Erreurs de champs | `core/interface/erreursChamps.js` | Créé |
| Lecture des montants dans le DOM | `core/interface/champsMontants.js` | Créé |

## 12. Déroulement des tâches

### Phase 1 — Page d’accueil : terminée

1. Créer `core/configuration/configurationEtablissements.js`.
2. Créer `accueil/selectionEtablissement.js`.
3. Créer `accueil/navigationApplications.js`.
4. Créer `accueil/pageAccueil.js`.
5. Créer `accueil/vueAccueil.js`.
6. Créer `accueil/demarrageApplication.js`.
7. Remplacer `index.html` par la page d’accueil.
8. Créer `css/accueil.css`.
9. Tester la navigation et la sélection d’établissement sur téléphone.

### Phase 1 bis — Retour à l’accueil

1. Ajouter un bouton « Accueil » visible lorsque les clôtures Vesuvio
   sont ouvertes.
2. Permettre le retour à l’accueil sans rafraîchir la page.
3. Tester sur téléphone.
4. Commit et push après validation.

### Phase 2 — Tronc commun : terminée

1. Créer les modules `core/montants/`.
2. Créer les modules `core/validation/`.
3. Créer les modules `core/interface/`.
4. Créer les modules `core/base-de-donnees/`.
5. Ne modifier aucun fichier de `js/`.

### Phase 3 — Nouvelle application Vesuvio

1. Créer `clotures-vesuvio/midi/`.
2. Créer `clotures-vesuvio/soir/`.
3. Créer `clotures-vesuvio/services/`.
4. Utiliser les modules `core/`.
5. Ne modifier aucun fichier de `js/`.
6. Tester chaque étape sur téléphone.
7. Commit et push après chaque étape validée.

### Phase 4 — Bascule finale

1. Vérifier que la nouvelle application Vesuvio couvre
   toutes les fonctions de `js/`.
2. Tester complètement Midi et Soir.
3. Basculer `index.html` vers la nouvelle application.
4. Supprimer `js/` uniquement après validation complète.

### Phase 5 — Application Oléron

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
- **Ne jamais modifier un fichier de `js/`.**
- Penser aux répercussions transverses :
  - Page d’accueil
  - Récapitulatifs
  - Supabase
  - Midi / Soir
  - Établissements
  - Futures applications

## 14. État du projet

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
- [x] Création de `core/montants/conversionMontants.js`.
- [x] Création de `core/montants/operationsMontants.js`.
- [x] Création de `core/validation/reglesMontants.js`.
- [x] Création de `core/validation/reglesSaisies.js`.
- [x] Création de `core/interface/champsMontants.js`.
- [x] Création de `core/interface/erreursChamps.js`.
- [x] Création de `core/interface/comportementChampTexte.js`.
- [x] Création de `core/interface/navigationFormulaire.js`.
- [x] Création de `core/interface/listesPaiements.js`.
- [x] Création de `core/configuration/configurationApplication.js`.
- [x] Création de `core/base-de-donnees/clientSupabase.js`.
- [x] Création de `core/base-de-donnees/accesCloturesJournalieres.js`.
- [x] Création de `core/interface/remiseAZeroFormulaire.js`.
- [x] Création de `core/interface/affichageLignesNonNulles.js`.
- [x] Création de `core/interface/formatageEuro.js`.
- [x] Création de `core/interface/formatageEntier.js`.
- [x] Revert de la tentative de modification de `js/utils/calculations.js`.
- [x] Vérification syntaxique de tous les fichiers `core/`.
- [x] **Phase 2 — Tronc commun : terminée.**
- [ ] Ajout du bouton « Accueil » dans les clôtures Vesuvio.
- [ ] Suppression de `index-initial.html` après validation complète.
- [ ] Création de `clotures-vesuvio/midi/`.
- [ ] Création de `clotures-vesuvio/soir/`.
- [ ] Création de `clotures-vesuvio/services/`.
- [ ] Bascule finale vers la nouvelle application Vesuvio.
- [ ] Suppression de `js/` après bascule.

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

```text
feat(core): ajouter la conversion, les opérations et la validation des montants
```

```text
feat(validation): ajouter les règles génériques de validation des saisies
```

```text
feat(interface): ajouter la lecture des montants dans le DOM
```

```text
feat(interface): ajouter la gestion des erreurs de champs
```

```text
feat(interface): ajouter les comportements de champs, la navigation clavier et les listes de paiements
```

```text
Revert "feat(interface): ajouter la lecture des montants dans le DOM"
```

```text
feat(base-de-donnees): ajouter la configuration application et le client Supabase
```

```text
feat(base-de-donnees): ajouter l’accès générique aux clôtures journalières
```

```text
feat(interface): ajouter la remise à zéro des formulaires
```

```text
feat(interface): ajouter le masquage des lignes et le formatage euro et entier
```

- Branche : `feature/midi-mobile-layout`
- Dépôt : `Yann17550/caisse_vesuvio`
- Dernier commit : masquage des lignes et formatage euro et entier.
