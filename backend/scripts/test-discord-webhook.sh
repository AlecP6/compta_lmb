#!/bin/bash

# Script de test pour le webhook Discord (version shell)
# Usage: ./test-discord-webhook.sh

API_URL="${API_URL:-http://localhost:3001}"
ENDPOINT="/api/discord/webhook"
API_KEY="${DISCORD_WEBHOOK_KEY:-${GTARP_WEBHOOK_KEY:-}}"

# Données par défaut
GAME_ID="${1:-12345}"
ACTION="${2:-deposit}"
AMOUNT="${3:-1000.50}"
DESCRIPTION="${4:-Test de transaction depuis script}"

echo ""
echo "🧪 Test du webhook Discord"
echo "═══════════════════════════════════════"
echo "📍 URL: ${API_URL}${ENDPOINT}"
echo "📤 Données:"
echo "   - gameId: ${GAME_ID}"
echo "   - action: ${ACTION}"
echo "   - amount: ${AMOUNT}"
echo "   - description: ${DESCRIPTION}"
if [ -n "$API_KEY" ]; then
  echo "🔑 Clé API: ${API_KEY:0:10}..."
else
  echo "⚠️  Aucune clé API configurée"
fi
echo "───────────────────────────────────────"
echo ""

# Préparer les headers
HEADERS=(-H "Content-Type: application/json")
if [ -n "$API_KEY" ]; then
  HEADERS+=(-H "X-API-Key: $API_KEY")
fi

# Faire la requête
RESPONSE=$(curl -s -w "\n%{http_code}" "${HEADERS[@]}" \
  -X POST "${API_URL}${ENDPOINT}" \
  -d "{
    \"gameId\": \"${GAME_ID}\",
    \"action\": \"${ACTION}\",
    \"amount\": ${AMOUNT},
    \"description\": \"${DESCRIPTION}\",
    \"category\": \"Discord\"
  }")

# Séparer le body et le code HTTP
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 Statut HTTP: $HTTP_CODE"
echo "📦 Réponse:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "✅ Test réussi !"
  exit 0
else
  echo "❌ Test échoué !"
  exit 1
fi

