"""Password hashing + JWT issue/verify."""
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.config import get_settings

_settings = get_settings()


def _to_bytes(password: str) -> bytes:
    # bcrypt only considers the first 72 bytes; truncate explicitly so longer
    # passwords don't raise on modern bcrypt.
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_to_bytes(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_to_bytes(password), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def _encode(sub: str, kind: str, ttl: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": sub, "type": kind, "iat": now, "exp": now + ttl}
    return jwt.encode(payload, _settings.jwt_secret, algorithm=_settings.jwt_algorithm)


def make_access_token(user_id: int) -> str:
    return _encode(str(user_id), "access",
                   timedelta(minutes=_settings.jwt_access_ttl_min))


def make_refresh_token(user_id: int) -> str:
    return _encode(str(user_id), "refresh",
                   timedelta(days=_settings.jwt_refresh_ttl_days))


def decode_token(token: str, expected_type: str) -> int:
    """Return the user id, or raise jwt exceptions / ValueError on mismatch."""
    payload = jwt.decode(token, _settings.jwt_secret,
                         algorithms=[_settings.jwt_algorithm])
    if payload.get("type") != expected_type:
        raise ValueError("wrong token type")
    return int(payload["sub"])
