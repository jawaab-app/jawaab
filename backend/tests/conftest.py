"""Shared fixtures for integration tests.

Integration tests need a real Postgres and Redis (the FTS uses Postgres-only
`websearch_to_tsquery`, and caching uses Redis). They are skipped automatically
unless TEST_DATABASE_URL and TEST_REDIS_URL point at reachable services, e.g.:

    docker compose up -d postgres redis
    TEST_DATABASE_URL=postgresql+psycopg://jawaab:jawaab@localhost:5432/jawaab \
    TEST_REDIS_URL=redis://localhost:6379/1 pytest
"""
import os

import pytest

DB = os.environ.get("TEST_DATABASE_URL")
RD = os.environ.get("TEST_REDIS_URL")

if DB and RD:
    os.environ["DATABASE_URL"] = DB
    os.environ["REDIS_URL"] = RD

_reason = "set TEST_DATABASE_URL and TEST_REDIS_URL to run integration tests"


def _reachable() -> bool:
    if not (DB and RD):
        return False
    try:
        import redis
        from sqlalchemy import create_engine, text
        create_engine(DB).connect().execute(text("SELECT 1"))
        redis.from_url(RD).ping()
        return True
    except Exception:
        return False


_available = _reachable()

# CI sets REQUIRE_SERVICES=1 so a broken service setup fails the run instead of
# silently skipping every integration test.
if os.environ.get("REQUIRE_SERVICES") == "1" and not _available:
    raise RuntimeError("REQUIRE_SERVICES=1 but Postgres/Redis are not reachable")

requires_services = pytest.mark.skipif(not _available, reason=_reason)


@pytest.fixture(scope="session")
def client():
    from fastapi.testclient import TestClient

    from app.main import app
    return TestClient(app)


@pytest.fixture()
def seed_question():
    """Insert one question with content + a tag; clean up after."""
    from sqlalchemy import text

    from app.db import engine
    with engine.begin() as c:
        c.execute(text(
            "INSERT INTO questions (id, url, slug, title, question, answer, "
            "content_jmu, content_text, madhab, source_slug, scholar) VALUES "
            "(999001, 'http://x/1', 'fasting', 'Ruling on fasting Ramadan', "
            "'Is fasting obligatory?', 'Yes it is.', '## Ruling', "
            "'Ruling on fasting Ramadan obligatory', 'hanafi', 'src1', 'Mufti A') "
            "ON CONFLICT (id) DO NOTHING"
        ))
        c.execute(text(
            "INSERT INTO tags (id, name, slug) VALUES (999001,'Fasting','fasting') "
            "ON CONFLICT (slug) DO NOTHING"
        ))
        c.execute(text(
            "INSERT INTO question_tags (question_id, tag_id) VALUES (999001,999001) "
            "ON CONFLICT DO NOTHING"
        ))
    yield 999001
    with engine.begin() as c:
        c.execute(text("DELETE FROM questions WHERE id = 999001"))
        c.execute(text("DELETE FROM tags WHERE id = 999001"))
