# 💰 SmartSchool UY1 — Microservice Finance & Paiements (Finance Service)

Ce microservice gère les tranches de pension, les paiements étudiants et l'intégration de la passerelle de paiement mobile **Campay** pour le système **SmartSchool UY1**.

---

## 1. Responsabilités & Périmètre de Données
*   **Rôle** : CRUD des tranches de pension, enregistrement des paiements, intégration Campay Mobile Money et vérification d'éligibilité financière.
*   **Base de données isolée** : Possède et interagit uniquement avec les tables `Tranche` et `Payer_Tranche` (MySQL).
*   **Communication synchrone** : Interroge `Student Service` (port 5002) pour mettre à jour le statut de paiement d'une inscription après un versement réussi.

---

## 2. API Exposée

### Création d'une Tranche de Pension
*   **URL** : `POST /finance/tranches`
*   **Payload** :
```json
{
  "libelle_tranche": "Tranche 1",
  "montant_exigible": 50000,
  "date_limite": "2026-03-31"
}
```

### Paiement d'une Tranche (Avec Campay Mobile Money)
*   **URL** : `POST /finance/payer`
*   **Payload** :
```json
{
  "id_inscription": 1,
  "id_tranche": 1,
  "montant_verse": 50000,
  "mode_paiement": "Mobile Money",
  "telephone": "237670000000"
}
```

### Historique des Paiements d'une Inscription
*   **URL** : `GET /finance/paiements/:id_inscription`

### Éligibilité Financière (Endpoint Interne pour Reporting)
*   **URL** : `GET /finance/internal/eligibilite/:id_inscription`
*   **Réponse** :
```json
{
  "success": true,
  "data": {
    "id_inscription": 1,
    "total_verse": 150000,
    "total_exigible": 150000,
    "pourcentage": 100,
    "est_eligible": true
  }
}
```

---

## 3. Lancement Local
```bash
npm run dev
```
Port par défaut : **`5004`**
