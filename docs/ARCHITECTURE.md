# System Overview

This document breaks down the Cat Fact ToDo Tracker into the front-end, back-end,
database, and API layers so you can navigate the codebase quickly.

## Front-end

- **Location:** `frontend/`
- **Tech:** Vanilla HTML/CSS/ESM JavaScript (no build step).
- **Entry point:** `frontend/index.html` can be opened directly in the browser.
- **Key files:**
  - `index.html` – Layout and forms for registration, login, and todo creation. Comments explain how each section maps to API calls.
  - `app.js` – Handles interactions with the NestJS API via `fetch`, manages the JWT token in memory, and renders todo items.
  - `styles.css` – Provides a simple responsive layout so the focus stays on the API behaviour.
- **Usage:** Start the back-end (`npm run start:dev`), then open `frontend/index.html`. The page expects the API to run on `http://localhost:8888`; adjust `window.API_PORT` in the browser console if you bind to a different port.

## Back-end

- **Location:** `src/`
- **Framework:** NestJS (TypeScript) with module-based architecture.
- **Modules:**
  - `AppModule` (`src/app.module.ts`) glues together the feature modules.
  - `AuthModule` (`src/auth/`) handles registration/login, JWT issuance, and guards.
  - `TodosModule` (`src/todos/`) handles todo CRUD and cat fact enrichment.
  - `PrismaModule` (`src/prisma/`) exposes a singleton Prisma client to the rest of the app.
- **Entry point:** `src/main.ts` boots the Nest application, applies global validation pipes, and listens on the configured port.
- **Auth flow:**
  1. `AuthController` validates requests via DTOs and calls `AuthService`.
  2. `AuthService` hashes passwords with bcrypt, persists users with Prisma, and signs JWTs via `JwtService`.
  3. `JwtStrategy` reads bearer tokens and attaches `{ userId, email }` to `req.user` for downstream controllers.
- **Todo flow:** `TodosController` uses `JwtAuthGuard` to protect routes, then calls `TodosService`, which validates dates, fetches cat facts via Axios, and stores todos with Prisma.

## Database

- **ORM:** Prisma with SQLite (default) – see `prisma/schema.prisma`.
- **Models:**
  - `User` – stores email, password hash, creation timestamp, and relation to todos.
  - `Todo` – stores message, scheduled date, associated cat fact, and relation to owner.
- **Migrations:** Run `npm run prisma:migrate` to create/update the SQLite database or adapt the datasource to Postgres/MySQL by changing `prisma/schema.prisma` and `DATABASE_URL`.
- **Connection lifecycle:** `PrismaService` connects on module init and registers a shutdown hook to close Nest gracefully.

## API

- **Base URL:** `http://localhost:8888`
- **Endpoints:**
  - `POST /register` – Accepts `{ email, password }` and returns the created user (sans password).
  - `POST /login` – Returns `{ access_token }` used for authenticated requests.
  - `POST /todos` – Requires `Authorization: Bearer <token>`. Accepts `{ message, date }` (YYYY-MM-DD), fetches a cat fact, and stores the todo.
  - `GET /todos` – Requires authentication and returns the caller's todos sorted by creation date.
- **Validation:** DTOs leverage `class-validator`; `ValidationPipe` strips unknown fields.
- **Error handling:** Standard NestJS HTTP exceptions (`BadRequestException`, `UnauthorizedException`) are thrown for invalid input or credentials and bubble up to structured JSON responses.

## Running locally

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
# open frontend/index.html in your browser
```

Optional: use the bundled `docs/CatFactToDo.postman_collection.json` or `scripts/test_curl.sh` for additional API testing.
