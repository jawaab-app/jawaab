import pytest

from tests.conftest import requires_services


@requires_services
def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


@requires_services
def test_list_and_filter_questions(client, seed_question):
    r = client.get("/questions", params={"madhab": "hanafi"})
    assert r.status_code == 200
    body = r.json()
    assert body["total"] >= 1
    assert any(q["id"] == seed_question for q in body["items"])
    # ETag present, and a conditional re-request yields 304
    etag = r.headers["ETag"]
    r2 = client.get("/questions", params={"madhab": "hanafi"},
                    headers={"If-None-Match": etag})
    assert r2.status_code == 304


@requires_services
def test_get_question_detail(client, seed_question):
    r = client.get(f"/questions/{seed_question}")
    assert r.status_code == 200
    body = r.json()
    assert body["content_jmu"] == "## Ruling"
    assert body["tags"][0]["slug"] == "fasting"


@requires_services
def test_get_missing_question_404(client):
    assert client.get("/questions/424242").status_code == 404


@requires_services
def test_full_text_search(client, seed_question):
    r = client.get("/search", params={"q": "fasting ramadan"})
    assert r.status_code == 200
    body = r.json()
    assert body["total"] >= 1
    assert body["items"][0]["rank"] > 0


@requires_services
def test_search_filters_by_madhab(client, seed_question):
    hits = client.get("/search", params={"q": "fasting ramadan", "madhab": "hanafi"}).json()
    assert any(q["id"] == seed_question for q in hits["items"])
    misses = client.get("/search", params={"q": "fasting ramadan", "madhab": "maliki"}).json()
    assert all(q["id"] != seed_question for q in misses["items"])


@requires_services
def test_tags_and_scholars_facets(client, seed_question):
    tags = client.get("/tags").json()
    assert any(t["value"] == "fasting" for t in tags)
    scholars = client.get("/scholars").json()
    assert any(s["value"] == "Mufti A" for s in scholars)


@pytest.fixture()
def seed_pair(seed_question):
    """The seed question plus a Mālikī twin, so ranking by school is testable."""
    from sqlalchemy import text

    from app.db import engine
    with engine.begin() as c:
        c.execute(text(
            "INSERT INTO questions (id, url, slug, title, question, answer, "
            "content_jmu, content_text, madhab, source_slug, scholar) VALUES "
            "(999002, 'http://x/2', 'fasting-2', 'Ruling on fasting Ramadan', "
            "'Is fasting obligatory?', 'Yes it is.', '## Ruling', "
            "'Ruling on fasting Ramadan obligatory', 'maliki', 'src2', 'Mufti B') "
            "ON CONFLICT (id) DO NOTHING"
        ))
    yield (seed_question, 999002)
    with engine.begin() as c:
        c.execute(text("DELETE FROM questions WHERE id = 999002"))


@requires_services
def test_search_prefers_school_without_excluding_others(client, seed_pair):
    hanafi, maliki = seed_pair
    r = client.get("/search", params={"q": "fasting ramadan", "prefer": "maliki"}).json()
    ids = [q["id"] for q in r["items"]]
    assert maliki in ids and hanafi in ids
    assert ids.index(maliki) < ids.index(hanafi)
    r = client.get("/search", params={"q": "fasting ramadan", "prefer": "hanafi"}).json()
    ids = [q["id"] for q in r["items"]]
    assert ids.index(hanafi) < ids.index(maliki)


@requires_services
def test_list_prefers_school_without_excluding_others(client, seed_pair):
    hanafi, maliki = seed_pair
    r = client.get("/questions", params={"prefer": "maliki", "limit": 100}).json()
    ids = [q["id"] for q in r["items"]]
    assert maliki in ids and hanafi in ids
    assert ids.index(maliki) < ids.index(hanafi)


@requires_services
def test_search_matches_last_word_as_prefix(client, seed_question):
    r = client.get("/search", params={"q": "ruling fasti"}).json()
    assert r["fuzzy"] is False
    assert any(q["id"] == seed_question for q in r["items"])


@requires_services
def test_search_falls_back_to_fuzzy_title_match(client, seed_question):
    r = client.get("/search", params={"q": "ramadn"}).json()
    assert r["fuzzy"] is True
    assert any(q["id"] == seed_question for q in r["items"])
    assert r["items"][0]["rank"] > 0
