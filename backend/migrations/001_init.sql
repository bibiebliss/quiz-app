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
