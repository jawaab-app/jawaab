#!/usr/bin/env bash
# Runs on the droplet after CI has synced a new release into /srv/jawaab/backend.
# Rebuilds changed services, waits for /health, and rolls back to
# /srv/jawaab/backend.prev if the new release never becomes healthy.
set -euo pipefail

APP=/srv/jawaab/backend
PREV=/srv/jawaab/backend.prev

healthy() {
  for _ in $(seq 1 30); do
    if docker compose exec -T api python -c \
      "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/health', timeout=3).status == 200 else 1)" \
      >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

cd "$APP"
docker compose up -d --build --remove-orphans
if healthy; then
  echo "deploy ok: $(date -u +%FT%TZ)"
  docker image prune -f >/dev/null
  exit 0
fi

echo "new release failed its health check; rolling back" >&2
docker compose logs --tail 50 api >&2 || true
if [ -d "$PREV" ]; then
  rsync -a --delete --exclude '.env' "$PREV"/ "$APP"/
  cd "$APP"
  docker compose up -d --build --remove-orphans
  healthy && echo "rolled back to previous release" >&2
fi
exit 1
