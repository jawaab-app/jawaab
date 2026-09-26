import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User
from app.schemas import (
    LoginIn, ProviderTokenIn, RefreshIn, RegisterIn, TokenPair,
)
from app.security import (
    decode_token, hash_password, make_access_token, make_refresh_token,
    verify_password,
)
from app.services import oauth

router = APIRouter(prefix="/auth", tags=["auth"])


def _pair(user_id: int) -> TokenPair:
    return TokenPair(
        access_token=make_access_token(user_id),
        refresh_token=make_refresh_token(user_id),
    )


@router.post("/register", response_model=TokenPair, status_code=201)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    exists = db.execute(
        select(User).where(User.provider == "email", User.email == body.email)
    ).scalar_one_or_none()
    if exists:
        raise HTTPException(status_code=409, detail="email already registered")
    user = User(email=body.email, provider="email",
                password_hash=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return _pair(user.id)


@router.post("/login", response_model=TokenPair)
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.execute(
        select(User).where(User.provider == "email", User.email == body.email)
    ).scalar_one_or_none()
    if user is None or not user.password_hash \
            or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")
    return _pair(user.id)


def _social_login(provider: str, provider_id: str, email: str | None,
                  db: Session) -> TokenPair:
    user = db.execute(
        select(User).where(User.provider == provider,
                           User.provider_id == provider_id)
    ).scalar_one_or_none()
    if user is None:
        user = User(provider=provider, provider_id=provider_id, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
    return _pair(user.id)


@router.post("/google", response_model=TokenPair)
def google_login(body: ProviderTokenIn, db: Session = Depends(get_db)):
    try:
        provider, pid, email = oauth.verify_google(body.id_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    return _social_login(provider, pid, email, db)


@router.post("/apple", response_model=TokenPair)
def apple_login(body: ProviderTokenIn, db: Session = Depends(get_db)):
    try:
        provider, pid, email = oauth.verify_apple(body.id_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    return _social_login(provider, pid, email, db)


@router.post("/refresh", response_model=TokenPair)
def refresh(body: RefreshIn, db: Session = Depends(get_db)):
    try:
        user_id = decode_token(body.refresh_token, "refresh")
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="invalid refresh token")
    if db.get(User, user_id) is None:
        raise HTTPException(status_code=401, detail="user not found")
    return _pair(user_id)
