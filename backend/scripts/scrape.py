"""Postgres-native, resumable IslamQA scraper (the repointed scraper).

Reuses the proven HTML parsing from the original Supabase scraper
(`scraper/scrape.py`) but writes directly to DO Postgres and compiles content
into JMU on the way in (so the DB never stores raw HTML). Progress lives in the
`scrape_state` table, exactly like before, so it stays crash-safe and resumable.

Usage (env: DATABASE_URL; optional WORKERS, RATE_DELAY):
    python -m scripts.scrape seed   # discover URLs -> scrape_state
    python -m scripts.scrape run    # crawl pending/error rows
    python -m scripts.scrape all
"""
from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

import httpx
import psycopg
from psycopg.rows import dict_row

# Import the pure parsing helpers from the original scraper.
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scraper"))
import scrape as legacy  # noqa: E402

from app import cache  # noqa: E402
from app.services.jmu import compile_html  # noqa: E402
from scripts.migrate_from_supabase import slugify  # noqa: E402

WORKERS = int(os.environ.get("WORKERS", "6"))
RATE_DELAY = float(os.environ.get("RATE_DELAY", "0.4"))
USER_AGENT = legacy.USER_AGENT


def _dsn() -> str:
    return os.environ["DATABASE_URL"].replace("postgresql+psycopg://", "postgresql://")


def _store(conn: psycopg.Connection, q: "legacy.Question") -> None:
    compiled = compile_html(q.content_html)
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO questions
              (id, url, slug, title, question, answer, content_jmu, content_text,
               madhab, source_slug, scholar, original_source_url)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (id) DO UPDATE SET
              title=EXCLUDED.title, question=EXCLUDED.question,
              answer=EXCLUDED.answer, content_jmu=EXCLUDED.content_jmu,
              content_text=EXCLUDED.content_text, scholar=EXCLUDED.scholar,
              updated_at=now()
            """,
            (q.id, q.url, q.slug, q.title, q.question, q.answer, compiled.jmu,
             compiled.text or q.content_text, q.madhab, q.source_slug, q.scholar,
             q.original_source_url),
        )
        for name in q.tags:
            slug = slugify(name)
            cur.execute(
                "INSERT INTO tags (name, slug) VALUES (%s,%s) "
                "ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name RETURNING id",
                (name, slug),
            )
            tid = cur.fetchone()["id"]
            cur.execute(
                "INSERT INTO question_tags (question_id, tag_id) VALUES (%s,%s) "
                "ON CONFLICT DO NOTHING",
                (q.id, tid),
            )
    conn.commit()


def _mark(conn: psycopg.Connection, url: str, status: str, error: str | None = None):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO scrape_state (url, status, error, updated_at) "
            "VALUES (%s,%s,%s,now()) ON CONFLICT (url) DO UPDATE SET "
            "status=EXCLUDED.status, error=EXCLUDED.error, updated_at=now()",
            (url, status, error),
        )
    conn.commit()


def _pending(conn: psycopg.Connection, limit: int) -> list[str]:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT url FROM scrape_state WHERE status IN ('pending','error') "
            "LIMIT %s", (limit,),
        )
        return [r["url"] for r in cur.fetchall()]


async def _worker(client: httpx.AsyncClient, conn, queue: asyncio.Queue, stats: dict):
    while True:
        url = await queue.get()
        if url is None:
            queue.task_done()
            return
        try:
            r = await client.get(url, headers={"User-Agent": USER_AGENT}, timeout=60)
            if r.status_code == 404:
                _mark(conn, url, "done", "404")
                stats["skipped"] += 1
            else:
                r.raise_for_status()
                q = legacy.parse_question(url, r.text)
                if q is None:
                    _mark(conn, url, "error", "parse_failed")
                    stats["errors"] += 1
                else:
                    _store(conn, q)
                    _mark(conn, url, "done")
                    stats["ok"] += 1
        except Exception as e:  # noqa: BLE001
            stats["errors"] += 1
            _mark(conn, url, "error", str(e)[:300])
        finally:
            queue.task_done()
            await asyncio.sleep(RATE_DELAY)


async def run(conn: psycopg.Connection):
    stats = {"ok": 0, "errors": 0, "skipped": 0}
    async with httpx.AsyncClient(follow_redirects=True) as client:
        while True:
            batch = _pending(conn, 2000)
            if not batch:
                print("[done] no pending urls")
                break
            queue: asyncio.Queue = asyncio.Queue()
            for u in batch:
                queue.put_nowait(u)
            workers = [asyncio.create_task(_worker(client, conn, queue, stats))
                       for _ in range(WORKERS)]
            await queue.join()
            for _ in workers:
                queue.put_nowait(None)
            await asyncio.gather(*workers)
            print(f"[batch] ok={stats['ok']} err={stats['errors']} skip={stats['skipped']}")
    cache.bump_version()  # invalidate cached reads after a crawl


async def seed(conn: psycopg.Connection):
    async with httpx.AsyncClient(follow_redirects=True) as client:
        urls = await legacy.discover_post_urls(client)
    with conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO scrape_state (url, status) VALUES (%s,'pending') "
            "ON CONFLICT (url) DO NOTHING",
            [(u,) for u in urls],
        )
    conn.commit()
    print(f"[seed] {len(urls)} urls")


async def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "run"
    with psycopg.connect(_dsn(), row_factory=dict_row) as conn:
        if mode in ("seed", "all"):
            await seed(conn)
        if mode in ("run", "all"):
            await run(conn)


if __name__ == "__main__":
    asyncio.run(main())
