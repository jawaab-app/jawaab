"""Redis-backed response caching with version-namespace invalidation.

Public read responses are cached under a key that embeds a global version
number. After a scrape, bumping that version (``bump_version``) atomically
retires every cached read without scanning/deleting individual keys.
"""
import hashlib
import json
from typing import Any

import redis

from app.config import get_settings

_settings = get_settings()
_client = redis.from_url(_settings.redis_url, decode_responses=True)

_VERSION_KEY = "cache:version"


def _version() -> str:
    v = _client.get(_VERSION_KEY)
    if v is None:
        _client.set(_VERSION_KEY, "1")
        return "1"
    return v


def bump_version() -> None:
    """Invalidate all cached public reads (call after a scrape/import)."""
    _client.incr(_VERSION_KEY)


def make_key(prefix: str, params: dict[str, Any]) -> str:
    blob = json.dumps(params, sort_keys=True, default=str)
    digest = hashlib.sha1(blob.encode()).hexdigest()[:16]
    return f"resp:v{_version()}:{prefix}:{digest}"


def get_json(key: str) -> Any | None:
    raw = _client.get(key)
    return json.loads(raw) if raw is not None else None


def set_json(key: str, value: Any, ttl: int | None = None) -> None:
    _client.set(key, json.dumps(value, default=str),
                ex=ttl if ttl is not None else _settings.public_cache_ttl)


def etag_for(payload: Any) -> str:
    blob = json.dumps(payload, sort_keys=True, default=str)
    return hashlib.sha1(blob.encode()).hexdigest()
