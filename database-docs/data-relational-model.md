# Data Relational Model (v1)

## Scope
Core tables for the book retention quiz app:
- `users`
- `books`
- `chapters`
- `questions`
- `user_attempts`

This model is designed for Postgres (Supabase-compatible).

## Entity Relationship Summary
- A `user` can have many `user_attempts`.
- A `book` can have many `chapters`.
- A `chapter` belongs to one `book` and can have many `questions`.
- A `question` belongs to one `chapter`.
- A `user_attempt` belongs to one `user` and one `question`.

## Tables

### 1) `users`
Purpose: app users who take quizzes.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | `primary key default gen_random_uuid()` | User identifier |
| `email` | `text` | `not null unique` | Login identity |
| `display_name` | `text` | `not null` | Name shown in app |
| `created_at` | `timestamptz` | `not null default now()` | Audit |
| `updated_at` | `timestamptz` | `not null default now()` | Audit |

Indexes:
- `unique (email)`

---

### 2) `books`
Purpose: books available for study.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `bigserial` | `primary key` | Book identifier |
| `title` | `text` | `not null` | Ex: Thinking, Fast and Slow |
| `author` | `text` | `not null` | Ex: Daniel Kahneman |
| `description` | `text` | `null` | Optional metadata |
| `published_year` | `int` | `null` | Optional metadata |
| `created_at` | `timestamptz` | `not null default now()` | Audit |

Indexes:
- `index on (title)`

---

### 3) `chapters`
Purpose: chapters within each book.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `bigserial` | `primary key` | Chapter identifier |
| `book_id` | `bigint` | `not null references books(id) on delete cascade` | Parent book |
| `chapter_number` | `int` | `not null` | Order within book |
| `title` | `text` | `not null` | Chapter title |
| `summary` | `text` | `null` | Optional source for AI prompts |
| `created_at` | `timestamptz` | `not null default now()` | Audit |

Constraints:
- `unique (book_id, chapter_number)`

Indexes:
- `index on (book_id)`
- `index on (book_id, chapter_number)`

---

### 4) `questions`
Purpose: quiz questions associated with chapters.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `bigserial` | `primary key` | Question identifier |
| `chapter_id` | `bigint` | `not null references chapters(id) on delete cascade` | Parent chapter |
| `question_text` | `text` | `not null` | Prompt text |
| `question_type` | `text` | `not null default 'mcq'` | v1 supports `mcq` |
| `options` | `jsonb` | `not null` | Array of answer options |
| `correct_answer` | `text` | `not null` | Correct option value/key |
| `explanation` | `text` | `null` | Why answer is correct |
| `difficulty` | `smallint` | `not null default 2 check (difficulty between 1 and 5)` | For weighting |
| `source` | `text` | `not null default 'manual'` | `manual` or `ai` |
| `created_at` | `timestamptz` | `not null default now()` | Audit |

Indexes:
- `index on (chapter_id)`
- `index on (chapter_id, difficulty)`

---

### 5) `user_attempts`
Purpose: stores each user answer event for retention scoring.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `bigserial` | `primary key` | Attempt identifier |
| `user_id` | `uuid` | `not null references users(id) on delete cascade` | Attempting user |
| `question_id` | `bigint` | `not null references questions(id) on delete cascade` | Attempted question |
| `selected_answer` | `text` | `not null` | User choice |
| `is_correct` | `boolean` | `not null` | Computed at write time |
| `response_ms` | `int` | `null check (response_ms >= 0)` | Time to answer |
| `confidence` | `smallint` | `null check (confidence between 1 and 5)` | Optional self-rating |
| `attempted_at` | `timestamptz` | `not null default now()` | Event timestamp |

Indexes:
- `index on (user_id, attempted_at desc)`
- `index on (question_id)`
- `index on (user_id, question_id, attempted_at desc)`

## Cardinality Diagram (Text)
- `books (1) -> (many) chapters`
- `chapters (1) -> (many) questions`
- `users (1) -> (many) user_attempts`
- `questions (1) -> (many) user_attempts`

## Suggested SQL DDL
```sql
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists books (
  id bigserial primary key,
  title text not null,
  author text not null,
  description text,
  published_year int,
  created_at timestamptz not null default now()
);
create index if not exists idx_books_title on books(title);

create table if not exists chapters (
  id bigserial primary key,
  book_id bigint not null references books(id) on delete cascade,
  chapter_number int not null,
  title text not null,
  summary text,
  created_at timestamptz not null default now(),
  unique (book_id, chapter_number)
);
create index if not exists idx_chapters_book_id on chapters(book_id);
create index if not exists idx_chapters_book_chapter on chapters(book_id, chapter_number);

create table if not exists questions (
  id bigserial primary key,
  chapter_id bigint not null references chapters(id) on delete cascade,
  question_text text not null,
  question_type text not null default 'mcq',
  options jsonb not null,
  correct_answer text not null,
  explanation text,
  difficulty smallint not null default 2 check (difficulty between 1 and 5),
  source text not null default 'manual',
  created_at timestamptz not null default now()
);
create index if not exists idx_questions_chapter_id on questions(chapter_id);
create index if not exists idx_questions_chapter_difficulty on questions(chapter_id, difficulty);

create table if not exists user_attempts (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  question_id bigint not null references questions(id) on delete cascade,
  selected_answer text not null,
  is_correct boolean not null,
  response_ms int check (response_ms >= 0),
  confidence smallint check (confidence between 1 and 5),
  attempted_at timestamptz not null default now()
);
create index if not exists idx_attempts_user_time on user_attempts(user_id, attempted_at desc);
create index if not exists idx_attempts_question on user_attempts(question_id);
create index if not exists idx_attempts_user_question_time on user_attempts(user_id, question_id, attempted_at desc);
```

## Notes for v2
Potential future tables:
- `quiz_sessions` (group attempts into one quiz run)
- `retention_snapshots` (precomputed retention per user/book/chapter)
- `user_progress` (xp, level, streak)
