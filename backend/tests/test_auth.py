import pytest

from tests.conftest import requires_services


@pytest.fixture()
def cleanup_user():
    yield
    from sqlalchemy import text

    from app.db import engine
    with engine.begin() as c:
        c.execute(text("DELETE FROM users WHERE email = 'test@jawaab.de'"))


@requires_services
def test_register_login_refresh_flow(client, cleanup_user):
    reg = client.post("/auth/register",
                       json={"email": "test@jawaab.de", "password": "pw12345"})
    assert reg.status_code == 201
    tokens = reg.json()
    assert tokens["access_token"] and tokens["refresh_token"]

    # duplicate registration rejected
    dup = client.post("/auth/register",
                      json={"email": "test@jawaab.de", "password": "pw12345"})
    assert dup.status_code == 409

    login = client.post("/auth/login",
                        json={"email": "test@jawaab.de", "password": "pw12345"})
    assert login.status_code == 200

    bad = client.post("/auth/login",
                     json={"email": "test@jawaab.de", "password": "nope"})
    assert bad.status_code == 401

    refreshed = client.post("/auth/refresh",
                           json={"refresh_token": tokens["refresh_token"]})
    assert refreshed.status_code == 200
    assert refreshed.json()["access_token"]


@requires_services
def test_protected_endpoint_requires_token(client):
    assert client.get("/bookmarks").status_code in (401, 403)


@requires_services
def test_bookmarks_roundtrip(client, seed_question, cleanup_user):
    tokens = client.post(
        "/auth/register",
        json={"email": "test@jawaab.de", "password": "pw12345"},
    ).json()
    auth = {"Authorization": f"Bearer {tokens['access_token']}"}

    add = client.post("/bookmarks", json={"question_id": seed_question}, headers=auth)
    assert add.status_code == 201
    lst = client.get("/bookmarks", headers=auth).json()
    assert any(b["question_id"] == seed_question for b in lst)
    rm = client.delete(f"/bookmarks/{seed_question}", headers=auth)
    assert rm.status_code == 204


@requires_services
def test_cache_invalidation_bumps_version():
    from app import cache
    k1 = cache.make_key("x", {"a": 1})
    cache.bump_version()
    k2 = cache.make_key("x", {"a": 1})
    assert k1 != k2  # version namespace changed -> old keys retired
