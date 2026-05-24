# Quiz App Backend

## Run with Docker Compose (from repo root)

```bash
cp .env.example .env
docker compose up --build
```

## Run migrations and seed data

```bash
docker compose exec api npm run migrate
docker compose exec api npm run seed
```

## Migration commands

```bash
npm run migrate:create
npm run migrate:up
npm run migrate:down
```

## Endpoints scaffolded

- `GET /health`
- `GET /books`
- `GET /books/:id/chapters`
- `GET /quiz?chapterId=<id>&limit=<n>`
- `POST /attempt`
- `GET /retention/:userId`
