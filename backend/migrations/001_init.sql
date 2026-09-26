-- Jawaab backend schema. Auto-run by the postgres container on first init.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ----------------------------------------------------------------- questions
CREATE TABLE IF NOT EXISTS questions (
    id                  BIGINT PRIMARY KEY,
    url                 TEXT NOT NULL,
    slug                TEXT NOT NULL,
    title               TEXT NOT NULL,
    question            TEXT,
    answer              TEXT,
    content_jmu         TEXT NOT NULL DEFAULT '',
    content_text        TEXT NOT NULL DEFAULT '',
    madhab              TEXT NOT NULL DEFAULT 'unknown',
    source_slug         TEXT,
    scholar             TEXT,
    original_source_url TEXT,
    search_vector       tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(question, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(content_text, '')), 'C')
    ) STORED,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS questions_search_idx  ON questions USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS questions_title_trgm   ON questions USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS questions_madhab_idx    ON questions (madhab);
CREATE INDEX IF NOT EXISTS questions_source_idx    ON questions (source_slug);
CREATE INDEX IF NOT EXISTS questions_scholar_idx   ON questions (scholar);

-- ---------------------------------------------------------------------- tags
CREATE TABLE IF NOT EXISTS tags (
    id   BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS question_tags (
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    tag_id      BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);
CREATE INDEX IF NOT EXISTS question_tags_tag_idx ON question_tags (tag_id);

-- ------------------------------------------------------------------- scraper
CREATE TABLE IF NOT EXISTS scrape_state (
    url        TEXT PRIMARY KEY,
    status     TEXT NOT NULL DEFAULT 'pending',
    error      TEXT,
    attempts   INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS scrape_state_status_idx ON scrape_state (status);

-- --------------------------------------------------------------------- users
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    email         TEXT,
    provider      TEXT NOT NULL CHECK (provider IN ('email', 'google', 'apple')),
    provider_id   TEXT,
    password_hash TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- one identity per external provider account
CREATE UNIQUE INDEX IF NOT EXISTS users_provider_uq
    ON users (provider, provider_id) WHERE provider_id IS NOT NULL;
-- one email account per address
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uq
    ON users (email) WHERE provider = 'email';

-- ----------------------------------------------------------------- bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, question_id)
);

-- ----------------------------------------------------------- reading_history
CREATE TABLE IF NOT EXISTS reading_history (
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    read_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, question_id)
);
CREATE INDEX IF NOT EXISTS reading_history_recent_idx
    ON reading_history (user_id, read_at DESC);
