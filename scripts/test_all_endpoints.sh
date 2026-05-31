#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BASE_GATEWAY="http://localhost:8000/api/v1"
TIMESTAMP="$(date +%s)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

json_extract() {
  if [ -z "$1" ] || [ -z "$2" ]; then
    echo ""
    return
  fi

  node - <<'NODE' "$1" "$2"
try {
  const res = JSON.parse(process.argv[2]);
  const key = process.argv[3];
  const parts = key.split('.');
  let value = res;
  for (const part of parts) {
    if (value == null) break;
    value = value[part];
  }
  process.stdout.write(value == null ? '' : String(value));
} catch (err) {
  process.stdout.write('');
}
NODE
}

print_step() {
  printf '\n=== %s ===\n' "$1"
}

print_step "Vérification de l'API Gateway"
HEALTH_RESPONSE=$(curl -sS http://localhost:8000/gateway/health || true)
if [ -z "$HEALTH_RESPONSE" ]; then
  echo "❌ La Gateway ne répond pas sur http://localhost:8000/gateway/health"
  echo "Démarrez d'abord les services avec : bash scripts/launch_services_and_tests.sh"
  exit 1
fi
printf 'Gateway: %s\n' "$HEALTH_RESPONSE"

EMAIL="test.admin.$TIMESTAMP@smartschool.local"
PASSWORD="Password123!"
USER_NAME="Admin Test"
USER_ROLE="Admin"

print_step "Enregistrement d'un utilisateur Admin de test"
cat > "$TMP_DIR/register.json" <<EOF
{
  "nom": "Admin",
  "prenom": "Test",
  "email": "$EMAIL",
  "mot_de_passe": "$PASSWORD",
  "role": "ADMIN"
}
EOF
REGISTER_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/auth/register" \
  -H 'Content-Type: application/json' \
  -d @"$TMP_DIR/register.json" || true)
printf 'Register response: %s\n' "$REGISTER_RESPONSE"

print_step "Connexion de l'utilisateur Admin"
cat > "$TMP_DIR/login.json" <<EOF
{
  "email": "$EMAIL",
  "mot_de_passe": "$PASSWORD"
}
EOF
LOGIN_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/auth/login" \
  -H 'Content-Type: application/json' \
  -d @"$TMP_DIR/login.json")
TOKEN=$(json_extract "$LOGIN_RESPONSE" "data.token")
if [ -z "$TOKEN" ]; then
  echo "❌ Impossible de récupérer le token de connexion"
  printf 'Login response: %s\n' "$LOGIN_RESPONSE"
  exit 1
fi
printf 'Token récupéré (%d caractères)\n' "${#TOKEN}"
AUTH_HEADER="Authorization: Bearer $TOKEN"

print_step "Test des endpoints Gateway via token"

# Créer année académique de test
cat > "$TMP_DIR/annee.json" <<EOF
{
  "libelle_annee": "2025-2026"
}
EOF
ANNEE_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/admin/annees" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/annee.json" || true)
printf 'Admin Annee response: %s\n' "$ANNEE_RESPONSE"
ANNEE_ID=$(json_extract "$ANNEE_RESPONSE" "data.id_annee")

# Créer établissement
cat > "$TMP_DIR/etab.json" <<EOF
{
  "nom_etablissement": "Université UY1 $TIMESTAMP"
}
EOF
ETAB_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/etablissements" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/etab.json")
ETAB_ID=$(json_extract "$ETAB_RESPONSE" "data.id_etablissement")
printf 'Établissement créé: %s (id=%s)\n' "$ETAB_RESPONSE" "$ETAB_ID"

# Créer département
cat > "$TMP_DIR/dept.json" <<EOF
{
  "nom_dept": "Informatique $TIMESTAMP",
  "id_etablissement": $ETAB_ID
}
EOF
DEPT_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/departements" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/dept.json")
DEPT_ID=$(json_extract "$DEPT_RESPONSE" "data.id_departement")
printf 'Département créé: %s (id=%s)\n' "$DEPT_RESPONSE" "$DEPT_ID"

# Créer niveau
cat > "$TMP_DIR/niveau.json" <<EOF
{
  "libelle_niveau": "M1",
  "id_departement": $DEPT_ID
}
EOF
NIVEAU_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/niveaux" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/niveau.json")
NIVEAU_ID=$(json_extract "$NIVEAU_RESPONSE" "data.id_niveau")
printf 'Niveau créé: %s (id=%s)\n' "$NIVEAU_RESPONSE" "$NIVEAU_ID"

# Créer UE
cat > "$TMP_DIR/ue.json" <<EOF
{
  "code_UE": "INF101_$TIMESTAMP",
  "libelle_UE": "Programmation UY1",
  "credits_ECTS": 5,
  "id_niveau": $NIVEAU_ID
}
EOF
UE_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/ues" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/ue.json")
UE_ID=$(json_extract "$UE_RESPONSE" "data.id_UE")
printf 'UE créée: %s (id=%s)\n' "$UE_RESPONSE" "$UE_ID"

# Créer enseignant
cat > "$TMP_DIR/enseignant.json" <<EOF
{
  "nom_ens": "Jean",
  "prenom_ens": "Dupont",
  "grade": "Maître de conférences"
}
EOF
ENSEIGNANT_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/enseignants" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/enseignant.json")
ENSEIGNANT_ID=$(json_extract "$ENSEIGNANT_RESPONSE" "data.id_enseignant")
printf 'Enseignant créé: %s (id=%s)\n' "$ENSEIGNANT_RESPONSE" "$ENSEIGNANT_ID"

# Créer étudiant et synchroniser vers Scolarité
STUDENT_EMAIL="test.student.$TIMESTAMP@smartschool.local"
cat > "$TMP_DIR/student.json" <<EOF
{
  "nom": "Marie",
  "prenom": "Curie",
  "email": "$STUDENT_EMAIL",
  "filiere": "Informatique $TIMESTAMP",
  "niveau": "M1",
  "telephone": "099123456",
  "date_naissance": "2003-05-01"
}
EOF
STUDENT_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/etudiants" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/student.json")
STUDENT_ID=$(json_extract "$STUDENT_RESPONSE" "data.etudiant.id_etudiant")
INSCRIPTION_ID=$(json_extract "$STUDENT_RESPONSE" "data.inscription.id_inscription")
printf 'Étudiant sync response: %s\n' "$STUDENT_RESPONSE"
printf 'Étudiant id=%s inscription id=%s\n' "$STUDENT_ID" "$INSCRIPTION_ID"

# Vérifier les inscriptions
INSCRIPTIONS_RESPONSE=$(curl -sS -H "$AUTH_HEADER" "$BASE_GATEWAY/scolarite/inscriptions")
printf 'Inscriptions: %s\n' "$INSCRIPTIONS_RESPONSE"

# Créer une note académique
cat > "$TMP_DIR/note.json" <<EOF
{
  "valeur_note": 14,
  "session": "Normale",
  "date_examen": "2025-05-15",
  "id_inscription": $INSCRIPTION_ID,
  "id_UE": $UE_ID,
  "id_enseignant": $ENSEIGNANT_ID
}
EOF
NOTE_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/academique/notes" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/note.json")
NOTE_ID=$(json_extract "$NOTE_RESPONSE" "data.id_note")
printf 'Note créée: %s (id=%s)\n' "$NOTE_RESPONSE" "$NOTE_ID"

# Récupérer la note
NOTE_GET_RESPONSE=$(curl -sS -H "$AUTH_HEADER" "$BASE_GATEWAY/academique/notes/$NOTE_ID")
printf 'Note get: %s\n' "$NOTE_GET_RESPONSE"

# Créer une tranche de paiement
cat > "$TMP_DIR/tranche.json" <<EOF
{
  "libelle_tranche": "Tranche 1",
  "montant_exigible": 100.50,
  "date_limite": "2025-06-30"
}
EOF
TRANCHE_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/finance/tranches" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/tranche.json")
TRANCHE_ID=$(json_extract "$TRANCHE_RESPONSE" "data.id_tranche")
printf 'Tranche créée: %s (id=%s)\n' "$TRANCHE_RESPONSE" "$TRANCHE_ID"

# Payer la tranche
cat > "$TMP_DIR/paiement.json" <<EOF
{
  "id_inscription": $INSCRIPTION_ID,
  "id_tranche": $TRANCHE_ID,
  "montant_verse": 100.50,
  "mode_paiement": "Espèces"
}
EOF
PAIEMENT_RESPONSE=$(curl -sS -X POST "$BASE_GATEWAY/finance/payer" \
  -H 'Content-Type: application/json' \
  -H "$AUTH_HEADER" \
  -d @"$TMP_DIR/paiement.json")
printf 'Paiement response: %s\n' "$PAIEMENT_RESPONSE"

# Lister les paiements de l'inscription
PAIEMENTS_LIST_RESPONSE=$(curl -sS -H "$AUTH_HEADER" "$BASE_GATEWAY/finance/paiements/$INSCRIPTION_ID")
printf 'Paiements liste: %s\n' "$PAIEMENTS_LIST_RESPONSE"

# Reporting bareme et rapport étudiant
BAREME_RESPONSE=$(curl -sS -H "$AUTH_HEADER" "$BASE_GATEWAY/reporting/bareme")
printf 'Bareme response: %s\n' "$BAREME_RESPONSE"

REPORT_RESPONSE=$(curl -sS -H "$AUTH_HEADER" "$BASE_GATEWAY/reporting/etudiant/$STUDENT_ID")
printf 'Report response: %s\n' "$REPORT_RESPONSE"

print_step "Résultats finaux"
echo "Token OK : ${#TOKEN} caractères"
echo "Étudiant créé avec id_etudiant=$STUDENT_ID et inscription=$INSCRIPTION_ID"
echo "Note créée id_note=$NOTE_ID"
echo "Tranche créée id_tranche=$TRANCHE_ID"
echo "Paiement enregistré pour id_inscription=$INSCRIPTION_ID"

echo "✅ Tous les tests de points d'entrée principaux ont été exécutés."
