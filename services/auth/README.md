# 🔐 SmartSchool UY1 — Microservice d'Authentification (Auth Service)

Ce microservice gère l'authentification et l'inscription sécurisée des utilisateurs administratifs et enseignants pour le système **SmartSchool UY1**.

---

## 1. Responsabilités & Périmètre de Données
*   **Rôle** : Enregistrement, hachage des mots de passe (`bcrypt`), génération et validation des tokens JWT signés.
*   **Base de données isolée** : Possède et interagit uniquement avec la table `Utilisateur` (MySQL).

---

## 2. API Exposée

### Inscription d'un Utilisateur
*   **URL** : `POST /api/auth/register`
*   **Payload** :
```json
{
  "nom": "Jean",
  "prenom": "Dupont",
  "email": "jean.dupont@uy1.cm",
  "mot_de_passe": "Securise123!",
  "role": "ADMIN",
  "id_enseignant": null
}
```

### Connexion d'un Utilisateur
*   **URL** : `POST /api/auth/login`
*   **Payload** :
```json
{
  "email": "jean.dupont@uy1.cm",
  "mot_de_passe": "Securise123!"
}
```
*   **Réponse attendue (JWT)** :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "id": 1,
    "nom": "Jean",
    "prenom": "Dupont",
    "email": "jean.dupont@uy1.cm",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Lancement Local
Pour démarrer ce service de manière isolée :
```bash
npm run dev
```
Par défaut, le microservice s'exécute sur le port **`5001`**.
