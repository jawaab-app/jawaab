import time

import jwt
import pytest

from app.security import (
    decode_token, hash_password, make_access_token, make_refresh_token,
    verify_password,
)


def test_password_hash_roundtrip():
    h = hash_password("s3cret!")
    assert h != "s3cret!"
    assert verify_password("s3cret!", h)
    assert not verify_password("wrong", h)


def test_access_token_roundtrip():
    tok = make_access_token(42)
    assert decode_token(tok, "access") == 42


def test_refresh_token_roundtrip():
    tok = make_refresh_token(7)
    assert decode_token(tok, "refresh") == 7


def test_token_type_mismatch_rejected():
    access = make_access_token(1)
    with pytest.raises(ValueError):
        decode_token(access, "refresh")


def test_tampered_token_rejected():
    tok = make_access_token(1)
    with pytest.raises(jwt.PyJWTError):
        decode_token(tok + "x", "access")
