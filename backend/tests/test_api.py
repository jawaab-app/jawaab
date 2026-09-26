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
