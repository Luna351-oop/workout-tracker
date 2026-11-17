# Workout Tracker: One-Page Spec

**Status:** approved by the group. Registration is not included; users are created by a seed script.

## Stack and exact versions

| Part | Package | Version |
|---|---|---|
| Runtime | Node.js | 26.13.0 |
| Runtime | npm | 11.20.0 |
| Server | express | 5.3.0 |
| Server | better-sqlite3 | 12.11.1 |
| Server | bcryptjs | 3.0.3 |
| Server | jsonwebtoken | 9.0.3 |
| Client | react | 19.3.1 |
| Client | react-dom | 19.3.1 |
| Client | vite | 8.3.7 |
| Client | @vitejs/plugin-react | 6.1.2 |

The database is SQLite, accessed through better-sqlite3.

## 1. Entities

**User**

| Field | Type | Notes |
|---|---|---|
| id | integer | primary key, auto-increment |
| email | string | unique, required |
| passwordHash | string | never returned by the API |

**Workout**

| Field | Type | Notes |
|---|---|---|
| id | integer | primary key, auto-increment |
| userId | integer | foreign key to User.id |
| name | string | required, e.g. "Leg day" |
| date | string | ISO date, `YYYY-MM-DD`, required |
| durationMin | integer | minutes, must be > 0 |
| notes | string | optional |

One user has many workouts. A user can only see and change their own.

## 2. REST Endpoints (5)

| # | Method + Path | Auth | Request body | Success response | Error codes |
|---|---|---|---|---|---|
| 1 | `POST /api/auth/login` | No | `{ email, password }` | `200` `{ token }` | `400` missing fields, `401` wrong credentials |
| 2 | `GET /api/workouts` | Yes | none | `200` `[Workout, ...]` (own only) | `401` missing/invalid token |
| 3 | `POST /api/workouts` | Yes | `{ name, date, durationMin, notes? }` | `201` `Workout` | `400` validation, `401` |
| 4 | `PUT /api/workouts/:id` | Yes | `{ name, date, durationMin, notes? }` | `200` updated `Workout` | `400` validation, `401`, `404` not found or not yours |
| 5 | `DELETE /api/workouts/:id` | Yes | none | `204` no body | `401`, `404` not found or not yours |

**Decision:** full CRUD plus register and login would be 6 endpoints, over the limit of 5. The group kept 5 by dropping registration: users are created by a small seed script.

## 3. UI Screens (3)

1. **Login**
   - *Purpose:* get a token so the user can reach their workouts.
   - *Components:* email input, password input, submit button, error message.
2. **Workout List**
   - *Purpose:* view and manage all of the user's workouts.
   - *Components:* table or list of workouts (name, date, duration), "Add workout" button, Edit and Delete buttons per row, Logout button.
3. **Workout Form** (used for both create and edit)
   - *Purpose:* add a new workout or change an existing one.
   - *Components:* inputs for name, date, duration, and notes; Save and Cancel buttons; validation messages.

## 4. Auth Approach: Simple JWT

- Login checks the password against the stored hash, then returns a signed JWT containing the user id, with a 1-hour expiry.
- The front end stores the token and sends it as `Authorization: Bearer <token>` on every workout request.
- One small middleware on the back end verifies the token and sets the current user id. Every workout query is filtered by that id.
- A 401 response sends the user back to the Login screen.
- Libraries: `jsonwebtoken` 9.0.3 for JWT and `bcryptjs` 3.0.3 for password hashing.

## 5. Explicitly out of scope

Registration, password reset, exercise-level tracking (sets/reps), charts, search or filtering, pagination, roles.

## Implementation notes (added after approval)

These details were decided while building. They do not change the approved scope.

- The seed script creates **two** initial users, using private values from `SEED_EMAIL`/`SEED_PASSWORD` and `SEED_EMAIL_2`/`SEED_PASSWORD_2` in `server/.env`. Seed credential values must not be added to documentation or source control.
- `GET /api/workouts` returns the user's workouts sorted by date, newest first.
- `PUT` replaces the whole workout. Leaving `notes` out clears them.
- A non-numeric `:id` in `PUT` or `DELETE` returns `404`.
- Error responses have the shape `{ "error": "message" }`. Unexpected errors return `500` with a generic message, and the details are only logged on the server.
- The Login and Workout List screens are separate from the Workout Form, and the app switches between them with React state instead of a router.
