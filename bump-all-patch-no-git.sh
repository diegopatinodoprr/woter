#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

projects=(
  "woter-admin"
  "woter-api"
  "woter-frontend"
  "woter-library"
)

for project in "${projects[@]}"; do
  package_json="$ROOT_DIR/$project/package.json"

  if [[ ! -f "$package_json" ]]; then
    echo "[skip] $project: package.json introuvable"
    continue
  fi

  echo "[run] $project -> npm version patch --no-git-tag-version"
  (
    cd "$ROOT_DIR/$project"
    npm version patch --no-git-tag-version
  )
done

echo "Terminé: versions patch appliquées sans commit ni tag Git."
