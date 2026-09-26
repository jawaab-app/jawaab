# Jawaab Backend

FastAPI + self-hosted Postgres + Redis, all in one Docker Compose stack on a
single DigitalOcean Droplet. Serves the scraped IslamQA Q&As to the Jawaab
Flutter app with heavy caching. See the design spec at
`../docs/superpowers/specs/2026-06-17-jawaab-backend-design.md`.

## Stack

```
Flutter app → Caddy (TLS) → FastAPI → Redis cache
                                    ↘ Postgres (FTS, tags, users)
```

- **API language:** Python (matches the scraper).
- **DB:** Postgres in the same Compose stack — no managed-DB bill.
- **Cache:** Redis response cache + HTTP ETag/Cache-Control, version-namespace
  invalidation on each crawl.
- **Auth:** email+password and Google/Apple sign-in, our own JWT (access+refresh).

## Run locally

```bash
cp .env.example .env          # edit secrets
docker compose up --build     # Caddy:80, api, postgres, redis
# API docs at http://localhost/docs
```

`migrations/001_init.sql` runs automatically on first Postgres init (schema,
FTS GIN index, pg_trgm, users/bookmarks/history).

## One-time data load (from existing Supabase project)

```bash
# In the api container (or any env with DATABASE_URL + SUPABASE_* set):
python -m scripts.migrate_from_supabase
```

Recompiles stored HTML into JMU, normalises tags, copies `scrape_state`.

## Ongoing scraping (repointed to Postgres)

```bash
python -m scripts.scrape seed   # discover URLs
python -m scripts.scrape run    # crawl pending/error rows, compile JMU, upsert
```

Reuses the original scraper's HTML parsing; writes straight to Postgres and busts
the Redis cache version when a crawl finishes.

## Tests

```bash
pip install -r requirements-dev.txt
pytest                          # pure tests (JMU, security) run anywhere

# Integration tests need real services:
docker compose up -d postgres redis
TEST_DATABASE_URL=postgresql+psycopg://jawaab:jawaab@localhost:5432/jawaab \
TEST_REDIS_URL=redis://localhost:6379/1 pytest
```

## Backups

`scripts/backup.sh` does a nightly `pg_dump` → DO Spaces (set up via cron on the
Droplet). Data is also reproducible by re-scraping.

## Going to production with a domain

Set `API_DOMAIN=api.yourdomain` in `.env`; Caddy auto-provisions HTTPS. Until a
domain exists, it serves plain HTTP on the Droplet IP.

## DigitalOcean access (IAM)

Team RBAC, configured in the DO console (not in code):
- **zajalist** → Owner (full admin + billing + team management)
- **Beydhawiy** → Owner (co-admin; downgrade to Member to exclude billing)

Each person generates their own Personal Access Token under API → Tokens.
