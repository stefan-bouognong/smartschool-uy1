# Lancer l'APK SmartSchool UY1

Ce document explique comment démarrer le backend et lancer une APK Android sur un émulateur ou un appareil physique.

## 1) Pré-requis

- Node.js installé
- `npm` installé
- Android SDK / `adb` installé
- Un émulateur Android ou un appareil Android connecté
- Le fichier APK disponible localement

## 2) Démarrer le backend de SmartSchool

Dans le dossier racine du projet :

```bash
npm install
bash scripts/launch_services_and_tests.sh
```

Vous pouvez aussi lancer uniquement le test de tous les endpoints si les services sont déjà démarrés :

```bash
npm run test:endpoints
```

Le script de lancement global :

- démarre tous les microservices en arrière-plan
- prépare une année académique de test dans la base
- exécute des requêtes `curl` de validation
- écrit les logs dans `logs/smartschool-services.log`

> Si un processus de services est déjà démarré, le script refusera de relancer pour éviter les conflits.

## 3) Vérifier que le backend est prêt

Depuis un autre terminal :

```bash
curl http://localhost:8000/gateway/health
```

La réponse attendue doit contenir `"success":true`.

## 4) Installer l'APK sur un appareil ou un émulateur

1. Vérifier l'appareil/emulateur connecté :

```bash
adb devices
```

2. Installer l'APK (remplacez le chemin par votre fichier) :

```bash
adb install -r /chemin/vers/votre/app.apk
```

3. Lancer l'application :

```bash
adb shell monkey -p com.example.smartschool -c android.intent.category.LAUNCHER 1
```

> Remplacez `com.example.smartschool` par le package réel de votre APK.

## 5) Trouver le package si nécessaire

Si vous ne connaissez pas le nom du package :

```bash
adb shell pm list packages | grep -i smartschool
```

## 6) Conseils pour la configuration réseau

- Si l'APK doit se connecter à votre backend local, vérifiez l'URL de l'API configurée dans l'application.
- Sur un émulateur Android standard, l'adresse `10.0.2.2` correspond à `localhost` de la machine hôte.
- Si l'application utilise un autre port ou un autre chemin, adaptez l'URL en conséquence.

## 7) Arrêter les services backend

Pour stopper les microservices lancés par le script :

```bash
kill $(cat logs/smartschool-services.pid)
```

---

Si vous avez un APK spécifique et que vous connaissez le package de l'application, je peux ajouter un exemple avec ce package précis. 
