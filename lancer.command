#!/bin/bash
# Double-cliquez sur ce fichier pour ouvrir le portfolio dans votre navigateur.
cd "$(dirname "$0")" || exit 1
PORT=8000
while lsof -i ":$PORT" >/dev/null 2>&1; do PORT=$((PORT + 1)); done
echo "Portfolio disponible sur http://localhost:$PORT  (Ctrl+C pour arrêter)"
(sleep 1; open "http://localhost:$PORT") &
exec python3 -m http.server "$PORT"
