from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, bookmarks, history, questions, search

app = FastAPI(title="Jawaab API", version="1.0.0")

# Mobile clients hit the API directly; allow all origins (no cookies used).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


app.include_router(questions.router)
app.include_router(search.router)
app.include_router(auth.router)
app.include_router(bookmarks.router)
app.include_router(history.router)
