# Caisse Vesuvio

Application de gestion des encaissements journaliers pour la pizzeria **Le Vesuvio**.

Elle permet de saisir, contrôler et archiver les encaissements du service du **Midi** et du **Soir**, avec un suivi des écarts de caisse, du fond de caisse et des éléments nécessaires à la comptabilité mensuelle.

## Objectif

Reconstruction moderne de l’application de caisse, avec une organisation claire du code et une séparation entre :

- La saisie des encaissements (Midi et Soir)
- L’archivage des journées de caisse
- Le contrôle des écarts entre encaissements théoriques et réels
- La gestion du fond de caisse
- La préparation des données pour la comptabilité mensuelle

## Fonctionnement général

L’application est organisée autour de deux services distincts :

### Service Midi

Le service du Midi permet de saisir les encaissements de la journée, notamment :

- Les paiements en espèces
- Les paiements par carte bancaire
- Les paiements myPOS
- Le contrôle du fond de caisse
- Le récapitulatif de fin de service

La navigation entre les champs se fait avec la touche **Entrée**, pour une saisie rapide au comptoir.

### Service Soir

Le service du Soir reprend la même logique de saisie, avec les moyens de paiement suivants :

- Espèces
- Carte bancaire
- ANCV (titres restaurant)
- Chèques
- myPOS

Chaque moyen de paiement est géré dans une page dédiée, avec une saisie paiement par paiement et une validation à la touche **Entrée**.

Le service du Soir se termine par un **récapitulatif** qui présente :

- Le total des encaissements par moyen de paiement
- L’écart de caisse
- La fréquentation
- Les éléments de TVA

## Architecture du code

Le projet est structuré pour séparer clairement les responsabilités :

```text
js/
├── features/
│   ├── midi/
│   │   ├── midiController.js
│   │   ├── myPosPayments.js
│   │   └── pages/
│   └── soir/
│       ├── soirController.js
│       └── pages/
│           ├── cashPage.js
│           ├── cardPage.js
│           ├── ancvPage.js
│           ├── checksPage.js
│           └── recapPage.js
└── utils/
    ├── formNavigation.js
    └── paymentList.js
```

### Contrôleurs

Chaque service dispose de son propre contrôleur :

- `midiController.js` pour le service du Midi
- `soirController.js` pour le service du Soir

Ils coordonnent les pages, la navigation et les données de la journée.

### Pages

Chaque moyen de paiement possède sa propre page dans le service du Soir :

- `cashPage.js` : espèces
- `cardPage.js` : carte bancaire
- `ancvPage.js` : ANCV
- `checksPage.js` : chèques
- `recapPage.js` : récapitulatif de fin de service

Cette organisation permet de faire évoluer chaque moyen de paiement sans impacter les autres.

### Utilitaires partagés

Les fonctionnalités communes au Midi et au Soir sont regroupées dans `js/utils/` :

- `formNavigation.js` : navigation entre les champs avec la touche Entrée
- `paymentList.js` : gestion des listes de paiements, notamment pour le myPOS et les chèques

Cela évite la duplication de code entre les deux services et facilite les évolutions futures.

## Stack technique

- **HTML / CSS / JavaScript** : application front-end légère, sans framework lourd
- **Supabase** : base de données et authentification
- **Git / GitHub** : versioning et sauvegarde du code
- **Vercel** : déploiement prévu

## Base de données

La base de données Supabase est utilisée pour :

- Enregistrer les clôtures de caisse
- Conserver l’historique des encaissements
- Préparer les contrôles comptables et les statistiques

La table principale prévue est `daily_closings`, destinée à archiver une journée de caisse avec les informations nécessaires au contrôle et à la comptabilité.

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
- Le fonctionnement du myPOS et des chèques
- Le calcul du récapitulatif
- L’absence d’erreur dans la console du navigateur

## Déploiement

Le déploiement est prévu sur **Vercel**, afin de rendre l’application accessible depuis les postes de la pizzeria.

## Roadmap

- [x] Service Midi fonctionnel
- [x] Service Soir : Espèces, CB, ANCV, Chèques et Récapitulatif
- [x] Utilitaires partagés pour la navigation et les paiements
- [ ] Validation des saisies avant enregistrement
- [ ] Enregistrement des clôtures dans Supabase
- [ ] Habillage mobile
- [ ] Déploiement Vercel
- [ ] Comptabilité mensuelle