from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class TagOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    slug: str


class QuestionSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    title: str
    madhab: str
    source_slug: str | None
    scholar: str | None


class QuestionDetail(QuestionSummary):
    url: str
    question: str | None
    answer: str | None
    content_jmu: str
    original_source_url: str | None
    tags: list[TagOut] = []


class Page(BaseModel):
    items: list[QuestionSummary]
    total: int
    limit: int
    offset: int


class SearchHit(QuestionSummary):
    rank: float


class SearchPage(BaseModel):
    items: list[SearchHit]
    total: int
    limit: int
    offset: int
    query: str


class FacetCount(BaseModel):
    value: str
    count: int


# ----------------------------------------------------------------------- auth
class RegisterIn(BaseModel):
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ProviderTokenIn(BaseModel):
    id_token: str


class RefreshIn(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# ------------------------------------------------------------------ user sync
class BookmarkIn(BaseModel):
    question_id: int


class BookmarkOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    question_id: int
    created_at: datetime


class HistoryIn(BaseModel):
    question_id: int


class HistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    question_id: int
    read_at: datetime
