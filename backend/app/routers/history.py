from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import current_user
from app.models import ReadingHistory, User
from app.schemas import HistoryIn, HistoryOut

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryOut])
def list_history(user: User = Depends(current_user), db: Session = Depends(get_db),
                 limit: int = Query(50, ge=1, le=200)):
    rows = db.execute(
        select(ReadingHistory).where(ReadingHistory.user_id == user.id)
        .order_by(ReadingHistory.read_at.desc()).limit(limit)
    ).scalars().all()
    return rows


@router.post("", response_model=HistoryOut, status_code=201)
def record_history(body: HistoryIn, user: User = Depends(current_user),
                   db: Session = Depends(get_db)):
    # upsert: re-reading a question refreshes read_at
    stmt = (
        pg_insert(ReadingHistory)
        .values(user_id=user.id, question_id=body.question_id)
        .on_conflict_do_update(
            index_elements=["user_id", "question_id"],
            set_={"read_at": func.now()},
        )
        .returning(ReadingHistory)
    )
    try:
        row = db.execute(stmt).scalar_one()
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=404, detail="question not found")
    return row
