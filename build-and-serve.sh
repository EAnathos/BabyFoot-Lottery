#!/usr/bin/env bash
set -euo pipefail

DIST="dist"

if [ ! -d "$DIST" ]; then
	mkdir "$DIST"
fi

npx tsc

echo "Demarrage du serveur sur http://localhost:8000/"
npx http-server -p 8000
