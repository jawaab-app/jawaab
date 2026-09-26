"""Verify Google / Apple identity tokens.

Returns a normalised (provider, provider_id, email) on success, raises
ValueError on any failure. Apple verification fetches Apple's public JWKS and
validates the RS256 signature, issuer, and audience.
"""
from __future__ import annotations

import jwt
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

from app.config import get_settings

_settings = get_settings()
_apple_jwks: jwt.PyJWKClient | None = None


def verify_google(token: str) -> tuple[str, str, str | None]:
    try:
        info = google_id_token.verify_oauth2_token(
            token, google_requests.Request(), _settings.google_client_id
        )
    except Exception as e:  # google raises ValueError/GoogleAuthError
        raise ValueError(f"google token invalid: {e}")
    if info.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        raise ValueError("google token bad issuer")
    return "google", info["sub"], info.get("email")


def _apple_client() -> jwt.PyJWKClient:
    global _apple_jwks
    if _apple_jwks is None:
        _apple_jwks = jwt.PyJWKClient("https://appleid.apple.com/auth/keys")
    return _apple_jwks


def verify_apple(token: str) -> tuple[str, str, str | None]:
    try:
        signing_key = _apple_client().get_signing_key_from_jwt(token)
        info = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=_settings.apple_client_id,
            issuer=_settings.apple_issuer,
        )
    except Exception as e:
        raise ValueError(f"apple token invalid: {e}")
    return "apple", info["sub"], info.get("email")
