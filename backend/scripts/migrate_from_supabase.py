"""One-time migration: Supabase `questions` + `scrape_state` -> DO Postgres.

For each question we recompile the stored `content_html` into JMU (so the new DB
never stores bulky HTML), derive `content_text`, and normalise tags into the
`tags` / `question_tags` tables.

Usage (env: SUPABASE_URL, SUPABASE_SERVICE_KEY, DATABASE_URL):
    python -m scripts.migrate_from_supabase

Pages by key (`id > last`) rather than OFFSET: deep offsets over rows this
large hit Supabase's statement timeout. Questions resume after the highest id
already in Postgres; set MIGRATE_FULL=1 to re-copy everything.
"""
from __future__ import annotations

import os
import re
import sys
import time

import httpx
import psycopg
from psycopg.rows import dict_row

from app.services.jmu import compile_html

PAGE = int(os.environ.get("MIGRATE_PAGE", "500"))
RETRIES = 5
_SLUG_RE = re.compile(r"[^a-z0-9]+")


def slugify(name: str) -> str:
    return _SLUG_RE.sub("-", name.strip().lower()).strip("-") or "tag"


def _pg_dsn() -> str:
    # app uses the SQLAlchemy URL form; psycopg wants the bare DSN.
    return os.environ["DATABASE_URL"].replace("postgresql+psycopg://", "postgresql://")


def fetch_page(client: httpx.Client, table: str, key: str, after, headers: dict):
    """Next PAGE rows of `table` ordered by `key`, strictly after `after`."""
    params = {"select": "*", "limit": PAGE, "order": key}
    if after is not None:
        # Plain operator filters take the raw value; quoting it makes PostgREST
        # compare against the literal quotes and the page never advances.
        params[key] = f"gt.{after}"
    for attempt in range(1, RETRIES + 1):
        try:
            r = client.get(
                f"{os.environ['SUPABASE_URL'].rstrip('/')}/rest/v1/{table}",
                headers=headers, params=params, timeout=120,
            )
            r.raise_for_status()
            rows = r.json()
            if rows and after is not None and rows[-1][key] == after:
                raise RuntimeError(f"{table}: paging by {key} did not advance past {after!r}")
            return rows
        except httpx.HTTPError as e:
            if attempt == RETRIES:
                raise
            print(f"[{table}] retry {attempt} after {e!r}", flush=True)
            time.sleep(2 ** attempt)


def migrate_questions(client: httpx.Client, conn: psycopg.Connection, headers: dict):
    after = None
    if os.environ.get("MIGRATE_FULL") != "1":
        with conn.cursor() as cur:
            cur.execute("SELECT max(id) AS m FROM questions")
            after = cur.fetchone()["m"]
        if after is not None:
            print(f"[questions] resuming after id {after}", flush=True)
    tag_cache: dict[str, int] = {}
    total = 0
    while True:
        rows = fetch_page(client, "questions", "id", after, headers)
        if not rows:
            break
        with conn.cursor() as cur:
            for row in rows:
                compiled = compile_html(row.get("content_html") or "")
                jmu = compiled.jmu
                text = compiled.text or (row.get("content_text") or "")
                cur.execute(
                    """
                    INSERT INTO questions
                      (id, url, slug, title, question, answer, content_jmu,
                       content_text, madhab, source_slug, scholar,
                       original_source_url)
                    VALUES (%(id)s,%(url)s,%(slug)s,%(title)s,%(question)s,
                            %(answer)s,%(jmu)s,%(text)s,%(madhab)s,%(source)s,
                            %(scholar)s,%(orig)s)
                    ON CONFLICT (id) DO UPDATE SET
                       content_jmu = EXCLUDED.content_jmu,
                       content_text = EXCLUDED.content_text,
                       updated_at = now()
                    """,
                    {
                        "id": row["id"], "url": row["url"], "slug": row["slug"],
                        "title": row["title"], "question": row.get("question"),
                        "answer": row.get("answer"), "jmu": jmu, "text": text,
                        "madhab": row.get("madhab") or "unknown",
                        "source": row.get("source_slug"),
                        "scholar": row.get("scholar"),
                        "orig": row.get("original_source_url"),
                    },
                )
                for name in (row.get("tags") or []):
                    slug = slugify(name)
                    tid = tag_cache.get(slug)
                    if tid is None:
                        cur.execute(
                            "INSERT INTO tags (name, slug) VALUES (%s,%s) "
                            "ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name "
                            "RETURNING id",
                            (name, slug),
                        )
                        tid = cur.fetchone()["id"]
                        tag_cache[slug] = tid
                    cur.execute(
                        "INSERT INTO question_tags (question_id, tag_id) "
                        "VALUES (%s,%s) ON CONFLICT DO NOTHING",
                        (row["id"], tid),
                    )
        conn.commit()
        total += len(rows)
        after = rows[-1]["id"]
        print(f"[questions] {total} migrated", flush=True)
    return total


def migrate_scrape_state(client: httpx.Client, conn: psycopg.Connection, headers: dict):
    after = None
    total = 0
    while True:
        rows = fetch_page(client, "scrape_state", "url", after, headers)
        if not rows:
            break
        with conn.cursor() as cur:
            for row in rows:
                cur.execute(
                    "INSERT INTO scrape_state (url, status, error, attempts) "
                    "VALUES (%s,%s,%s,%s) ON CONFLICT (url) DO UPDATE SET "
                    "status = EXCLUDED.status",
                    (row["url"], row.get("status", "pending"),
                     row.get("error"), row.get("attempts", 0)),
                )
        conn.commit()
        total += len(rows)
        after = rows[-1]["url"]
        print(f"[scrape_state] {total} migrated", flush=True)
    return total


def main():
    key = os.environ["SUPABASE_SERVICE_KEY"]
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    with httpx.Client() as client, \
            psycopg.connect(_pg_dsn(), row_factory=dict_row) as conn:
        q = migrate_questions(client, conn, headers)
        s = migrate_scrape_state(client, conn, headers)
    print(f"[done] {q} questions, {s} scrape_state rows")


if __name__ == "__main__":
    sys.exit(main())
