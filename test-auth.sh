#!/bin/bash

echo "=== Test du système d'authentification ==="
echo ""

# Démarrer le serveur en arrière-plan
npm run dev &
SERVER_PID=$!
sleep 3

echo "1. Test de l'inscription..."
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@example.com","password":"test123456","confirmPassword":"test123456"}' | python3 -m json.tool

echo ""
echo "2. Test de connexion..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@example.com","password":"test123456"}')
echo "$RESPONSE" | python3 -m json.tool

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
  echo ""
  echo "3. Test du profil protégé..."
  curl -s http://localhost:5000/api/auth/profile \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
fi

# Arrêter le serveur
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo ""
echo "=== Tests terminés ==="
