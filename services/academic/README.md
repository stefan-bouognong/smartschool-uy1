# 🏛️ SmartSchool UY1 — Microservice Académique & Notes (Academic Service)

Ce microservice gère la structure administrative de l'enseignement (filières, niveaux, cours) et la saisie sécurisée des notes des examens pour le système **SmartSchool UY1**.

---

## 1. Responsabilités & Périmètre de Données
*   **Rôle** : Gestion de l'infrastructure académique, cours (UEs), saisie des notes et calcul des moyennes de cours.
*   **Base de données isolée** : Possède et interagit uniquement avec les tables `Etablissement`, `Departement`, `Niveau`, `UE`, `Enseignant`, et `Note` (MySQL).

---

## 2. API Exposée

### Saisie d'une Note d'Examen (0-20)
*   **URL** : `POST /api/academique/notes`
*   **Payload** :
```json
{
  "valeur_note": 15.5,
  "session": "Normale",
  "id_inscription": 1,
  "id_UE": 2,
  "id_enseignant": 4
}
```

### Consultation des Notes
*   **URL** : `GET /api/academique/notes?id_inscription=1`

### Validation Interne de la Hiérarchie (Pour Student Service)
*   **URL** : `GET /api/academique/internal/validate-hierarchy`
*   **Query Params** : `?filiere=Informatique&niveau=M1`
*   **Réponse attendue** :
```json
{
  "success": true,
  "data": {
    "id_departement": 1,
    "id_niveau": 2,
    "nom_dept": "Informatique",
    "libelle_niveau": "M1"
  }
}
```

---

## 3. Lancement Local
Pour démarrer ce service de manière isolée :
```bash
npm run dev
```
Par défaut, le microservice s'exécute sur le port **`5003`**.
