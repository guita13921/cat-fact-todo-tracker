# Cat Fact ToDo Tracker (NestJS + Prisma + SQLite)

A simple ToDo API that supports user registration & login (JWT), creating ToDos (message, date),
and—on creation—fetches a cat fact from `https://catfact.ninja/fact` to store with the item.
Users can list only their own ToDos.

## Tech choices

- **NestJS (TypeScript)** – opinionated Node.js framework for clean modules/DI/testing
- **Prisma ORM + SQLite** – easy local dev; switch to Postgres/MySQL by changing `DATABASE_URL`
- **JWT (passport-jwt)** – stateless authentication
- **bcrypt** – secure password hashing
- **class-validator** – request DTO validation
- **axios** – to fetch the cat fact

## Quick start

1. **Install Node 20+** (LTS recommended). Clone this repo and install deps:

```bash
npm install
```

2. **Create env file**

```bash
cp .env.example .env
# Optionally edit JWT_SECRET and PORT
```

3. **Generate Prisma client + DB migration**

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Run the API**

```bash
npm run start:dev
# Server on http://localhost:8888
```

5. **Open the demo front-end (optional)**

Open `frontend/index.html` directly in your browser. The page is a lightweight
HTML/JS client that exercises the API endpoints (register, login, create/list
todos) and logs responses in the built-in console panel.

## API

### POST /register

Registers a new user.

```json
{ "email": "you@example.com", "password": "yourpassword" }
```

### POST /login

Returns a JWT:

```json
{ "access_token": "<JWT>" }
```

### POST /todos (Authenticated)

Create a new ToDo item. Include your JWT in the `Authorization: Bearer <token>` header.

```json
{ "message": "Buy milk", "date": "2025-10-01" }
```

Response includes stored `catFact`.

### GET /todos (Authenticated)

Returns all ToDos for the authenticated user.

## Notes / Decisions

- We treat `date` as date-only. We persist it as `YYYY-MM-DDT00:00:00.000Z` to preserve the date semantics.
- All routes except `/register` and `/login` are secured via JWT.
- Passwords are hashed with bcrypt (work factor 10). Never store plain passwords.
- Sensitive configs live in `.env` (`JWT_SECRET`, `DATABASE_URL`, `PORT`).

## cURL smoke test

After the server is up, you can run:

```bash
chmod +x scripts/test_curl.sh
npm run test:curl
```

This will register, login, create a todo, then list all todos.

## Switch to Postgres (optional)

Change the `datasource db` in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Set `DATABASE_URL` to your Postgres connection string, then run migrate again.

---

Need a deeper breakdown? See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a
layer-by-layer overview covering the front-end, back-end, database, and API.
