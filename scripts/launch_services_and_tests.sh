#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="$ROOT_DIR/logs"
PID_FILE="$LOG_DIR/smartschool-services.pid"
LOG_FILE="$LOG_DIR/smartschool-services.log"
mkdir -p "$LOG_DIR"

# Stop any stale gateway process on port 8000 before launching
GATEWAY_PORT=8000
STALE_PIDS="$(lsof -t -i:"$GATEWAY_PORT" 2>/dev/null || true)"
if [ -n "$STALE_PIDS" ]; then
  echo "⚠️  Port $GATEWAY_PORT déjà utilisé par : $STALE_PIDS"
  echo "   Arrêt des processus existants..."
  kill $STALE_PIDS || true
  sleep 2
fi

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "⚠️  Un processus de services semble déjà tourné. Stoppez-le avant de relancer :"
  echo "   kill $(cat "$PID_FILE")"
  exit 1
fi

echo "✅ Démarrage des microservices en arrière-plan..."
npm run start:all > "$LOG_FILE" 2>&1 &
SERVICE_PID=$!
echo "$SERVICE_PID" > "$PID_FILE"
echo "PID des services : $SERVICE_PID"
echo "Logs : $LOG_FILE"

sleep 3
if ! kill -0 "$SERVICE_PID" 2>/dev/null; then
  echo "❌ Le processus de services s'est terminé immédiatement. Vérifiez les logs : $LOG_FILE"
  exit 1
fi

echo
printf '%s\n' "⏳ Attente de la Gateway sur http://localhost:8000/gateway/health ..."
for i in {1..20}; do
  if curl -s http://localhost:8000/gateway/health | grep -q '"success":true'; then
    echo "✅ Gateway prête"
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "❌ La Gateway n'a pas répondu après 40 secondes. Vérifiez les logs : $LOG_FILE"
    exit 1
  fi
  sleep 2
done

echo
printf '%s\n' "🧩 Initialisation des données de test nécessaires..."
node <<'NODE'
const path = require('path');
const root = process.cwd();
const { Annee } = require(path.join(root, 'services', 'student', 'src', 'database', 'models'));
(async () => {
  const [annee, created] = await Annee.findOrCreate({
    where: { libelle_annee: '2025-2026' },
    defaults: { libelle_annee: '2025-2026' }
  });
  console.log(`Année académique ${annee.libelle_annee} ${created ? 'créée' : 'existante'}`);
})();
NODE

echo
printf '%s\n' "🚀 Lancement des tests de tous les endpoints via API Gateway..."

bash scripts/test_all_endpoints.sh

echo
echo "✅ Tests de endpoints exécutés. Si vous voulez arrêter les services : kill $SERVICE_PID"
