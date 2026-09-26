from fastapi import APIRouter, Depends, Query, Request, Response
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app import cache
from app.config import get_settings
from app.db import get_db
from app.models import Question
from app.routers.questions import _cached_json
from app.schemas import SearchPage

router = APIRouter(tags=["search"])
_settings = get_settings()


@router.get("/search", response_model=SearchPage)
def search(
    request: Request,
    response: Response,
    q: str = Query(..., min_length=2, max_length=200),
    madhab: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    params = {"q": q, "madhab": madhab, "limit": limit, "offset": offset}

    def build():
        # websearch_to_tsquery handles user phrases/operators safely.
        tsq = func.websearch_to_tsquery("english", q)
        rank = func.ts_rank(Question.search_vector, tsq)

        match = Question.search_vector.op("@@")(tsq)
        if madhab:
            match = match & (Question.madhab == madhab)
        total = db.execute(
            select(func.count()).select_from(Question).where(match)
        ).scalar_one()

        rows = db.execute(
            select(
                Question.id, Question.slug, Question.title, Question.madhab,
                Question.source_slug, Question.scholar, rank.label("rank"),
            )
            .where(match)
            .order_by(text("rank DESC"), Question.id)
            .limit(limit)
            .offset(offset)
        ).all()

        items = [
            {
                "id": r.id, "slug": r.slug, "title": r.title,
                "madhab": r.madhab, "source_slug": r.source_slug,
                "scholar": r.scholar, "rank": float(r.rank),
            }
            for r in rows
        ]
        return {"items": items, "total": total, "limit": limit,
                "offset": offset, "query": q}

    return _cached_json(request, response, "search", params, build)
