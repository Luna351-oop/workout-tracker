# Workout Tracker

A small full-stack CRUD app built by a 6-person university group for a course on AI in front-end and back-end development. A user logs in and manages their own workouts (name, date, duration, optional notes). Each user can only see and change their own workouts.

- **Front end:** React single-page app with three screens (Login, Workout List, Workout Form), built with Vite.
- **Back end:** Express REST API with a SQLite database and JWT authentication.
- **Full specification:** see [SPEC.md](SPEC.md).
- **AI assistance:** the code was written with an AI assistant (Claude) in a chat. Every prompt we sent is logged in [PROMPTS.md](PROMPTS.md).

## Stack (exact versions)

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

These are the versions our group installed. They were installed with `--save-exact`, so `package.json` holds exact numbers, and each `package-lock.json` freezes the full dependency tree. Check your own install with `npm ls --depth=0` in `server` and in `client`.

Notes on choices:
- **bcryptjs instead of bcrypt:** bcryptjs is pure JavaScript, so nothing needs compiling on Windows. We could not confirm a prebuilt native `bcrypt` binary for Node 26.
- **better-sqlite3 12.11.1:** the 12.10.0 release added prebuilt binaries for Node 26, and 12.11.1 is the version we use.
- **No dotenv, cors or nodemon:** Node's own `--env-file` and `--watch` flags replace dotenv and nodemon, and the Vite dev server proxies `/api` to Express, so CORS is not needed.

## Setup (Windows PowerShell)

Other operating systems and Node versions were not tested.

**1. Clone and set up the server**

```powershell
git clone <repo-url>
cd workout-tracker\server
npm ci
Copy-Item .env.example .env
New-Item -ItemType Directory -Force data | Out-Null
```

The `data` folder is git-ignored, so a fresh clone does not have it. The database file is created inside it.

**2. Edit `server\.env`**

Set `JWT_SECRET` to a long random value. This command prints one:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep the other values as they are unless you need a different port. Never commit `.env`.

**3. Create the demo users and start the server**

```powershell
npm run seed
npm run dev
```

The server listens on `http://localhost:3001`. Restart it after any change to `.env`, because `--watch` does not react to env file changes. Run server commands from the `server` folder, because `DB_PATH` is a relative path.

**4. Set up and start the client (second terminal)**

```powershell
cd workout-tracker\client
npm ci
npm run dev
```

Open the address Vite prints, normally `http://localhost:5173`. The browser sends `/api/...` requests to the Vite dev server, which forwards them to port 3001. If you change `PORT` in `.env`, change the proxy target in `client\vite.config.js` as well.

## Demo logins

There is no registration screen. The two users are created by `npm run seed` from the `SEED_*` values in `server\.env`. With the unchanged `.env.example` values they are:

| User | Email | Password |
|---|---|---|
| 1 | student@example.com | change-me |
| 2 | teammate@example.com | change-me-too |

If you changed the `SEED_*` values in your `.env`, use those instead. These passwords are for local demos only.

The seed script never changes the password of an existing user. To start over, stop the server, delete `server\data\workouts.db` and run `npm run seed` again. This deletes all workouts.

## Environment variables (`server\.env`)

| Variable | Meaning |
|---|---|
| `PORT` | Port the Express server listens on (default 3001) |
| `JWT_SECRET` | Secret used to sign login tokens (required, the server will not start without it) |
| `DB_PATH` | Path of the SQLite file, relative to the folder you run commands from |
| `SEED_EMAIL`, `SEED_PASSWORD` | First demo user |
| `SEED_EMAIL_2`, `SEED_PASSWORD_2` | Second demo user |

## Scripts

| Folder | Command | What it does |
|---|---|---|
| `server` | `npm run dev` | Start the API with auto-restart on code changes |
| `server` | `npm start` | Start the API without auto-restart |
| `server` | `npm run seed` | Create the two demo users |
| `client` | `npm run dev` | Start the Vite dev server |
| `client` | `npm run build` | Create a production build in `client\dist` |
| `client` | `npm run preview` | Preview the production build |

## API endpoints

All requests and responses use JSON. Errors have the shape `{ "error": "message" }`.

| # | Method and path | Auth | Request body | Success | Error codes |
|---|---|---|---|---|---|
| 1 | `POST /api/auth/login` | No | `{ email, password }` | `200` `{ token }` | `400` missing or non-text fields, `401` wrong credentials |
| 2 | `GET /api/workouts` | Yes | none | `200` array of the user's workouts, newest date first | `401` |
| 3 | `POST /api/workouts` | Yes | `{ name, date, durationMin, notes? }` | `201` the saved workout | `400` validation, `401` |
| 4 | `PUT /api/workouts/:id` | Yes | `{ name, date, durationMin, notes? }` | `200` the updated workout | `400` validation, `401`, `404` not found or not yours |
| 5 | `DELETE /api/workouts/:id` | Yes | none | `204` no body | `401`, `404` not found or not yours |

Authenticated requests send the token as `Authorization: Bearer <token>`. Tokens expire after 1 hour.

Validation rules for workouts:
- `name`: non-empty text.
- `date`: a real calendar date written `YYYY-MM-DD`.
- `durationMin`: a whole number greater than 0.
- `notes`: optional text. Leaving it out stores no notes, so an update without `notes` clears them.

Unexpected server errors return `500` with the generic message `Internal server error`. The details are written only to the server console.

## Project structure

```
workout-tracker/
├── README.md
├── SPEC.md
├── PROMPTS.md
├── .gitignore
├── server/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── scripts/
│   │   └── seed.js
│   └── src/
│       ├── server.js
│       ├── db.js
│       ├── auth.js
│       ├── errorHandler.js
│       └── routes/
│           ├── auth.js
│           └── workouts.js
└── client/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        └── screens/
            ├── Login.jsx / Login.css
            ├── WorkoutList.jsx / WorkoutList.css
            └── WorkoutForm.jsx / WorkoutForm.css
```

## Known limitations

**Accounts and security**
- There is no registration, password reset or roles. Users exist only if the seed script created them.
- Logging out only removes the token from the browser. The token itself stays valid until it expires after 1 hour, and there is no refresh or revocation.
- The token is stored in the browser's `localStorage`, which any script running on the page can read.
- The login endpoint has no rate limiting or lockout, and the app does not use HTTPS.
- Passwords longer than 72 bytes are truncated by bcrypt, so only the first 72 bytes count.
- The demo passwords are weak on purpose. Always set your own `JWT_SECRET`.

**Features**
- There is no pagination, search or filtering. The list loads all of a user's workouts.
- Dates are stored as plain `YYYY-MM-DD` text with no time zone. Future dates and duplicate workouts are allowed.
- Deleting a workout asks for no confirmation, and a failed list load has no retry button.
- After saving or cancelling the form, keyboard focus is not moved to a specific place on the list.

**Quality**
- There is no automated test suite. The API was checked with a manual PowerShell script, and the front end was checked by hand.
- The interface was built for accessibility (labelled fields, a table caption, announced errors, visible focus, a table that scrolls sideways at very narrow widths). Colour contrast has not been measured with a tool, and testing with a screen reader is not documented here.
- Validation exists on both the client and the server, so the rules must be kept in sync by hand.

**Deployment**
- This is a local development setup. Express does not serve the built client, and there is no production configuration.
- It was only tested on Windows with PowerShell and Node 26.13.0.
