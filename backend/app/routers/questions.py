from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app import cache
from app.config import get_settings
from app.db import get_db
from app.models import Question, QuestionTag, Tag
from app.schemas import FacetCount, Page, QuestionDetail, QuestionSummary

router = APIRouter(tags=["questions"])
_settings = get_settings()


def _cached_json(request: Request, response: Response, prefix: str,
                 params: dict, builder):
    """Serve from Redis if present; otherwise build, cache, and set ETag.

    Returns the payload dict (validated by the route's response_model), or a bare
    304 ``Response`` when If-None-Match matches, or ``None`` when the builder
    found nothing (caller raises 404). ``None`` results are never cached.
    """
    key = cache.make_key(prefix, params)
    payload = cache.get_json(key)
    if payload is None:
        payload = builder()
        if payload is None:
            return None
        cache.set_json(key, payload)

    etag = cache.etag_for(payload)
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers={"ETag": etag})
    response.headers["ETag"] = etag
    response.headers["Cache-Control"] = f"public, max-age={_settings.public_cache_ttl}"
    return payload


@router.get("/questions", response_model=Page)
def list_questions(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    madhab: str | None = None,
    source: str | None = None,
    scholar: str | None = None,
    tag: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    params = {"madhab": madhab, "source": source, "scholar": scholar,
              "tag": tag, "limit": limit, "offset": offset}

    def build():
        stmt = select(Question)
        count_stmt = select(func.count()).select_from(Question)
        if madhab:
            stmt = stmt.where(Question.madhab == madhab)
            count_stmt = count_stmt.where(Question.madhab == madhab)
        if source:
            stmt = stmt.where(Question.source_slug == source)
            count_stmt = count_stmt.where(Question.source_slug == source)
        if scholar:
            stmt = stmt.where(Question.scholar == scholar)
            count_stmt = count_stmt.where(Question.scholar == scholar)
        if tag:
            sub = (select(QuestionTag.question_id)
                   .join(Tag, Tag.id == QuestionTag.tag_id)
                   .where(Tag.slug == tag))
            stmt = stmt.where(Question.id.in_(sub))
            count_stmt = count_stmt.where(Question.id.in_(sub))

        total = db.execute(count_stmt).scalar_one()
        stmt = stmt.order_by(Question.id).limit(limit).offset(offset)
        rows = db.execute(stmt).scalars().all()
        items = [QuestionSummary.model_validate(r).model_dump() for r in rows]
        return {"items": items, "total": total, "limit": limit, "offset": offset}

    return _cached_json(request, response, "questions", params, build)


@router.get("/questions/{qid}", response_model=QuestionDetail)
def get_question(qid: int, request: Request, response: Response,
                 db: Session = Depends(get_db)):
    def build():
        row = db.execute(
            select(Question)
            .options(selectinload(Question.tags))
            .where(Question.id == qid)
        ).scalar_one_or_none()
        if row is None:
            return None
        return QuestionDetail.model_validate(row).model_dump()

    result = _cached_json(request, response, "question", {"id": qid}, build)
    if result is None:
        raise HTTPException(status_code=404, detail="question not found")
    return result


@router.get("/tags", response_model=list[FacetCount])
def list_tags(request: Request, response: Response, db: Session = Depends(get_db)):
    def build():
        rows = db.execute(
            select(Tag.slug, func.count(QuestionTag.question_id))
            .join(QuestionTag, QuestionTag.tag_id == Tag.id)
            .group_by(Tag.slug)
            .order_by(func.count(QuestionTag.question_id).desc())
        ).all()
        return [{"value": s, "count": c} for s, c in rows]

    return _cached_json(request, response, "tags", {}, build)


@router.get("/scholars", response_model=list[FacetCount])
def list_scholars(request: Request, response: Response, db: Session = Depends(get_db)):
    def build():
        rows = db.execute(
            select(Question.scholar, func.count())
            .where(Question.scholar.is_not(None))
            .group_by(Question.scholar)
            .order_by(func.count().desc())
        ).all()
        return [{"value": s, "count": c} for s, c in rows]

    return _cached_json(request, response, "scholars", {}, build)
