#!/usr/bin/env bash
# Nightly Postgres backup -> DO Spaces (s3-compatible). Run via cron on the Droplet:
#   0 3 * * *  /srv/jawaab/backend/scripts/backup.sh >> /var/log/jawaab-backup.log 2>&1
#
# Requires: s3cmd configured for DO Spaces, and the compose stack running.
set -euo pipefail

STAMP="$(date -u +%Y%m%d-%H%M%S)"
OUT="/tmp/jawaab-${STAMP}.sql.gz"
BUCKET="${SPACES_BUCKET:-s3://jawaab-backups}"

# Dump from the postgres container.
docker compose -f /srv/jawaab/backend/docker-compose.yml exec -T postgres \
  pg_dump -U "${POSTGRES_USER:-jawaab}" "${POSTGRES_DB:-jawaab}" | gzip > "$OUT"

# Upload and keep 30 days locally-pruned (Spaces lifecycle handles long-term).
s3cmd put "$OUT" "${BUCKET}/${STAMP}.sql.gz"
rm -f "$OUT"
echo "[backup] uploaded ${BUCKET}/${STAMP}.sql.gz"
