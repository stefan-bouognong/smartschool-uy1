# 🎓 SmartSchool UY1 — Microservice Étudiant & Inscriptions (Student Service)

Ce microservice gère les dossiers administratifs d'inscription et l'identité des étudiants pour le système **SmartSchool UY1**.

---

## 1. Responsabilités & Périmètre de Données
*   **Rôle** : Inscriptions administratives, cycle de vie étudiant, et **génération transactionnelle de matricule**.
*   **Base de données isolée** : Possède et interagit uniquement avec les tables `Etudiant`, `Inscription`, et `Annee_Academique` (MySQL).
*   **Communication synchrone** : Interroge de manière synchrone `Academic Service` pour valider l'existence du Département et du Niveau lors de la création d'une inscription.

---

## 2. API Exposée

### Inscription administrative d'un étudiant (Avec génération de matricule)
*   **URL** : `POST /api/scolarite/inscrire`
*   **Payload** :
```json
{
  "nom": "Kamer",
  "prenom": "Jean",
  "email": "jean.kamer@uy1.cm",
  "filiere": "Informatique",
  "niveau": "M1"
}
```
*   **Réponse attendue (Matricule autogénéré)** :
```json
{
  "success": true,
  "message": "Inscription administrative réussie",
  "data": {
    "id_inscription": 1,
    "matricule": "26INFJM10001",
    "date_inscription": "2026-05-29T12:00:00.000Z",
    "statut_paiement": false,
    "etudiant": {
      "id_etudiant": 1,
      "nom_etud": "Kamer",
      "prenom_etud": "Jean",
      "email": "jean.kamer@uy1.cm"
    },
    "academic": {
      "filiere": "Informatique",
      "niveau": "M1",
      "id_niveau": 3
    },
    "annee": "2025-2026"
  }
}
```

### Mise à jour interne du statut de paiement
*   **URL** : `PUT /api/scolarite/internal/inscriptions/:id_inscription/paiement`
*   **Payload** :
```json
{
  "statut": true
}
```

---

## 3. Lancement Local
Pour démarrer ce service de manière isolée :
```bash
npm run dev
```
Par défaut, le microservice s'exécute sur le port **`5002`**.
