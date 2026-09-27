import re

from fastapi import APIRouter, Depends, Query, Request, Response
from sqlalchemy import case, func, select, text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.models import Question
from app.routers.questions import _cached_json
from app.schemas import SearchPage

router = APIRouter(tags=["search"])
_settings = get_settings()

# How much an answer from the reader's own school is lifted in the ranking.
# Enough to win ties and near-ties, not enough to bury a far better match.
PREFER_BOOST = 1.5

# Below this many full-text hits, also try a fuzzy title match so a typo
# ("ramadn") still finds something.
FUZZY_BELOW = 1
FUZZY_WORD_THRESHOLD = 0.4

_WORD = re.compile(r"^[\w']+$", re.UNICODE)
_OPERATOR = re.compile(r'["()]|(?:^|\s)(?:or|-)(?:\s|$)', re.IGNORECASE)


def build_tsquery(q: str):
    """websearch query, with the last word matched as a prefix while it is
    still being typed (no trailing space, no quotes/operators).

    Lexemes are stemmed, so a prefix longer than the stem ("fasti" against
    "fast") misses; the fuzzy fallback below catches those."""
    words = q.split()
    last = words[-1] if words else ""
    if len(words) >= 1 and not q.endswith(" ") and len(last) >= 3 and _WORD.match(last) and not _OPERATOR.search(q):
        head = " ".join(words[:-1])
        prefix = func.to_tsquery("english", f"{last}:*")
        if not head:
            return prefix
        return func.websearch_to_tsquery("english", head).op("&&")(prefix)
    return func.websearch_to_tsquery("english", q)


def _row(r, rank: float) -> dict:
    return {
        "id": r.id, "slug": r.slug, "title": r.title,
        "madhab": r.madhab, "source_slug": r.source_slug,
        "scholar": r.scholar, "rank": float(rank),
    }


@router.get("/search", response_model=SearchPage)
def search(
    request: Request,
    response: Response,
    q: str = Query(..., min_length=2, max_length=200),
    madhab: str | None = Query(None, description="Only this school."),
    prefer: str | None = Query(None, description="Rank this school first, keep the rest."),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    params = {"q": q, "madhab": madhab, "prefer": prefer, "limit": limit, "offset": offset}

    def boost():
        if not prefer:
            return 1.0
        return case((Question.madhab == prefer, PREFER_BOOST), else_=1.0)

    def build():
        tsq = build_tsquery(q)
        # Normalisation 1 divides by 1 + log(length) so long answers don't win
        # just by repeating the word.
        rank = (func.ts_rank(Question.search_vector, tsq, 1) * boost()).label("rank")
        match = Question.search_vector.op("@@")(tsq)
        if madhab:
            match = match & (Question.madhab == madhab)

        total = db.execute(select(func.count()).select_from(Question).where(match)).scalar_one()
        fuzzy = False
        if total < FUZZY_BELOW:
            # Typo fallback: trigram word similarity against titles (GIN trgm index).
            # SET takes no bind parameters; the value is a module constant.
            db.execute(text(f"SET LOCAL pg_trgm.word_similarity_threshold = {FUZZY_WORD_THRESHOLD}"))
            match = Question.title.op("%>")(q)
            if madhab:
                match = match & (Question.madhab == madhab)
            rank = (func.word_similarity(q, Question.title) * boost()).label("rank")
            total = db.execute(select(func.count()).select_from(Question).where(match)).scalar_one()
            fuzzy = True

        rows = db.execute(
            select(
                Question.id, Question.slug, Question.title, Question.madhab,
                Question.source_slug, Question.scholar, rank,
            )
            .where(match)
            .order_by(text("rank DESC"), Question.id)
            .limit(limit)
            .offset(offset)
        ).all()

        return {"items": [_row(r, r.rank) for r in rows], "total": total,
                "limit": limit, "offset": offset, "query": q, "fuzzy": fuzzy}

    return _cached_json(request, response, "search", params, build)
