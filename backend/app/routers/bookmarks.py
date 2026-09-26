from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import current_user
from app.models import Bookmark, User
from app.schemas import BookmarkIn, BookmarkOut

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("", response_model=list[BookmarkOut])
def list_bookmarks(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.execute(
        select(Bookmark).where(Bookmark.user_id == user.id)
        .order_by(Bookmark.created_at.desc())
    ).scalars().all()
    return rows


@router.post("", response_model=BookmarkOut, status_code=201)
def add_bookmark(body: BookmarkIn, user: User = Depends(current_user),
                 db: Session = Depends(get_db)):
    bm = Bookmark(user_id=user.id, question_id=body.question_id)
    db.add(bm)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # already bookmarked (or unknown question) — return existing if present
        existing = db.get(Bookmark, (user.id, body.question_id))
        if existing is None:
            raise HTTPException(status_code=404, detail="question not found")
        return existing
    db.refresh(bm)
    return bm


@router.delete("/{question_id}", status_code=204)
def remove_bookmark(question_id: int, user: User = Depends(current_user),
                    db: Session = Depends(get_db)):
    db.execute(delete(Bookmark).where(
        Bookmark.user_id == user.id, Bookmark.question_id == question_id))
    db.commit()
    return Response(status_code=204)
