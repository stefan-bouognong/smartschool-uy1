# Rapport de projet : SmartSchool-uy1

## Introduction

Ce document présente le backend `smartschool-uy1`, un service backend développé pour piloter une application de gestion scolaire. Le backend est créé pour centraliser les données des établissements, des départements, des niveaux, des enseignants, des étudiants, des notes et des paiements, et pour exposer des API REST utilisables par des interfaces front-end ou des outils de test.

Le projet sert principalement de plateforme de simulation fonctionnelle et de SUT (System Under Test) pour tester une solution de génération automatique de cas de tests Java. L'objectif est de proposer un système réel, riche en flux métiers et en intégrations techniques, afin de vérifier la qualité et la pertinence de la génération de scénarios de tests.

## 1. Contexte général

Ce backend Node.js / Express a été créé pour répondre à deux besoins complémentaires :

- Fournir une API de gestion scolaire complète et modulaire.
- Offrir une base de test pratique pour la plateforme de génération de cas de tests Java.

Le service s'appuie sur MySQL via Sequelize pour la persistance des données. Il permet de gérer les opérations de l'administration scolaire, les traitements académiques, les paiements et la production de documents PDF.

> Les diagrammes sont prévus dans le document de conception associé. Ce rapport se focalise sur le contexte, les objectifs, l'architecture fonctionnelle et les points d'intérêt pour le test.

## 2. Objectifs du projet

- Fournir une API REST pour la gestion d'un établissement scolaire.
- Permettre la gestion des établissements, départements, niveaux, unités d'enseignement, enseignants, étudiants et notes.
- Offrir des services financiers et de génération de documents PDF.
- Servir de support pour évaluer et tester la plateforme de génération de cas de tests Java.

## 3. Environnement technique

- Langage : JavaScript (Node.js)
- Framework web : Express
- Base de données : MySQL
- ORM : Sequelize
- Authentification : JSON Web Tokens (JWT)
- Génération de PDF : PDFKit
- Outils de développement : Nodemon
- Gestion des variables d'environnement : dotenv

## 4. Architecture de l'application

L'application est structurée en modules indépendants, chacun responsable d'une zone fonctionnelle :

- `src/modules/auth` : gestion des comptes, connexion et déconnexion.
- `src/modules/admin` : administration des données référentielles (établissements, départements, niveaux, UEs, années, enseignants).
- `src/modules/academique` : gestion des notes, des moyennes et des unités d'enseignement.
- `src/modules/finance` : orchestration des paiements et intégration d'une passerelle financière.
- `src/modules/reporting` : extraction des données de reporting et production de relevés au format PDF.
- `src/database/models` : définition des entités et des relations Sequelize.

Le point d'entrée principal est `src/server.js`, qui initialise la connexion à la base, synchronise les modèles et démarre le serveur.

## 5. Principales routes exposées

### Authentification
- `POST /api/auth/register` : création d'un nouvel utilisateur. Utile pour inscrire un compte administrateur, enseignant ou autre profil autorisé.
- `POST /api/auth/login` : authentification et génération d'un token JWT. Permet d'obtenir un accès sécurisé aux routes protégées.
- `POST /api/auth/logout` : déconnexion et invalidation de session côté client.

### Administration
- `GET /api/admin/etablissements` : récupération de la liste des établissements scolaires.
- `POST /api/admin/etablissements` : ajout d'un nouvel établissement.
- `GET /api/admin/departements` : récupération de tous les départements pour un établissement.
- `POST /api/admin/departements` : création d'un département.
- `GET /api/admin/niveaux` : récupération des niveaux d'enseignement disponibles.
- `POST /api/admin/niveaux` : création d'un niveau (par exemple licence, master).
- `GET /api/admin/ues` : récupération des unités d'enseignement (UE).
- `POST /api/admin/ues` : création d'une UE nouvelle.
- `GET /api/admin/annees` : récupération des années académiques.
- `POST /api/admin/annees` : création d'une année scolaire.
- `GET /api/admin/enseignants` : récupération de la liste des enseignants.
- `POST /api/admin/enseignants` : ajout d'un enseignant dans le système.

Ces routes administratives sont utilisées pour gérer les données de référence du système scolaire.

### Académique
- `POST /api/academique/ue` : création d'une unité d'enseignement dans le contexte académique.
- `GET /api/academique/ue` : liste des UEs disponibles.
- `GET /api/academique/ue/:id` : détails d'une UE spécifique.
- `POST /api/academique/notes` : insertion d'une note pour un étudiant sur une UE.
- `GET /api/academique/notes` : liste de toutes les notes enregistrées.
- `GET /api/academique/notes/id/:id` : récupération d'une note par son identifiant.
- `GET /api/academique/notes/inscription/:id_inscription` : notes liées à une inscription étudiante.
- `GET /api/academique/notes/ue/:id_UE` : notes pour une UE donnée.
- `GET /api/academique/notes/enseignant/me` : notes associées à l'enseignant authentifié.
- `GET /api/academique/moyenne/inscription/:id_inscription` : calcul de la moyenne pour une inscription étudiante.
- `GET /api/academique/moyenne/ue/:id_UE` : calcul de la moyenne pour une UE.

Ces routes permettent de gérer le cœur pédagogique : notes, calcul des moyennes et accès aux informations académiques.

### Finance
- `POST /finance/charge` : déclenchement d'une opération de paiement via la passerelle de paiement.
- `GET /finance/status` : vérification de l'état de la connexion au service de paiement ou du statut de la transaction.

Ce module simule le volet financier du système et permet de valider les flux de paiement.

### Reporting
- `GET /reporting/releve/:etudiantId` : génération et téléchargement d'un relevé de notes PDF pour un étudiant.

Le module reporting produit des documents PDF, ce qui en fait un bon cas d'usage pour des tests d'export et de génération de fichier.

## 6. Modèle de données et relations

Les modèles définis dans `src/database/models` couvrent les principales entités scolaires :

- `Utilisateur`
- `Enseignant`
- `Etudiant`
- `Inscription`
- `UE`
- `Note`
- `Tranche`
- `PayerTranche`
- `Departement`
- `Annee`
- `Niveau`
- `Etablissement`

Relations clés :
- `Departement` appartient à `Etablissement`.
- `Niveau` appartient à `Departement`.
- `UE` appartient à `Niveau`.
- `Inscription` relie `Etudiant`, `Annee` et `Niveau`.
- `Note` relie `Inscription`, `UE` et `Enseignant`.
- `PayerTranche` relie `Inscription` et `Tranche`.

## 7. Points d'attention pour le test

- La configuration de la base MySQL doit être fournie via `src/.env`.
- Le service `sequelize.sync()` synchronise automatiquement les tables, ce qui est utile pour des scénarios de test fonctionnel mais doit être contrôlé en production.
- Les routes de reporting produisent des PDF, ce qui constitue un cas d'usage concret pour valider un processus d'export.
- Le module `finance` contient une intégration de paiement factice/realiste, pertinent pour tester les flux de transaction.
- L'authentification JWT peut être utilisée pour valider des scénarios de sécurité et d'accès contrôlé aux ressources.

## 8. Usage comme SUT pour la plateforme de génération de cas de tests Java

Cette application est adaptée comme SUT car elle présente :

- un ensemble de points d'entrée REST clairement identifiés,
- des règles métiers de gestion scolaire,
- des dépendances externes (base de données, envoi de PDF, système de paiement),
- des cas de test ciblés sur l'authentification, la création d'entités, la lecture de données, la génération de documents et la gestion des erreurs.

Pour une plateforme de génération de cas de tests Java, ce backend fournit des scénarios représentatifs :

- tests de validation des corps de requête,
- tests d'accès à la base de données,
- tests de service métier (calcul de moyenne, génération de relevés),
- tests d'intégration de modules (admin / académique / reporting).

## 9. Conclusion

`smartschool-uy1` est un backend fonctionnel de gestion scolaire qui peut être exploité comme plateforme de test pour la génération de cas de tests Java. Le rapport met en évidence le contexte d'utilisation, l'architecture modulaire et les points de test essentiels, sans entrer dans les diagrammes de conception qui seront documentés séparément.
