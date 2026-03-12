#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$ROOT_DIR/woter-library"
LIB_PKG_NAME="@diegopatinodoprr/woter-library"
BUMP_SCRIPT="$ROOT_DIR/bump-all-patch-no-git.sh"
TARGETS=(
  "woter-api"
  "woter-frontend"
  "woter-admin"
)

if [[ ! -x "$BUMP_SCRIPT" ]]; then
  echo "[error] Script introuvable ou non exécutable: $BUMP_SCRIPT"
  exit 1
fi

if [[ ! -f "$LIB_DIR/package.json" ]]; then
  echo "[error] package.json introuvable pour woter-library"
  exit 1
fi

echo "[1/5] Bump patch (sans git tag/commit)"
"$BUMP_SCRIPT"

LIB_VERSION="$(node -p "require('$LIB_DIR/package.json').version")"
echo "[info] Nouvelle version library: $LIB_VERSION"

echo "[2/5] Build de woter-library"
(
  cd "$LIB_DIR"
  npm run build
)

echo "[3/5] npm pack de woter-library"
(
  cd "$LIB_DIR"
  npm pack
)

echo "[4/5] npm publish de woter-library"
(
  cd "$LIB_DIR"
  npm publish
)

echo "[5/5] Mise a jour de $LIB_PKG_NAME dans api/frontend/admin"
for project in "${TARGETS[@]}"; do
  project_dir="$ROOT_DIR/$project"
  package_json="$project_dir/package.json"

  if [[ ! -f "$package_json" ]]; then
    echo "[skip] $project: package.json introuvable"
    continue
  fi

  dep_info="$(node -e "const p=require('$package_json'); const name='$LIB_PKG_NAME'; const deps=p.dependencies||{}; const devDeps=p.devDependencies||{}; if (deps[name]) { console.log(['present','dependencies',deps[name]].join('|')); process.exit(0); } if (devDeps[name]) { console.log(['present','devDependencies',devDeps[name]].join('|')); process.exit(0); } console.log('missing|||');")"
  IFS='|' read -r dep_state dep_scope dep_spec <<< "$dep_info"

  echo "[run] $project"
  (
    cd "$project_dir"

    if [[ "$dep_state" == "missing" ]]; then
      echo "  - dependance absente, installation de $LIB_PKG_NAME@$LIB_VERSION"
      npm install "$LIB_PKG_NAME@$LIB_VERSION" --save
    elif [[ "$dep_spec" == github:* || "$dep_spec" == git+* ]]; then
      echo "  - dependance git detectee ($dep_spec), bascule vers version publiee $LIB_VERSION"
      npm install "$LIB_PKG_NAME@$LIB_VERSION" --save
    else
      echo "  - npm update $LIB_PKG_NAME"
      npm update "$LIB_PKG_NAME"
    fi
  )
done

echo "Termine: library bump/build/pack/publish + update dependencies effectues."
