# Prompt Log

Every prompt our group sent to the AI assistant (Claude) while building this project, in order and copied word for word. Only our prompts are logged here, not the assistant's replies.

- **Log created:** 2026-11-18
- **Covers:** one chat conversation, 14 prompts.

---

## Prompt 1: Project brief and ground rules

```text
You are helping a 6-person university group build a small full-stack app
for a course on AI in front-end and back-end development. Rules:
  Always tell me the exact package versions you assume.
  If you are unsure a package or API exists, say so instead of guessing.
  Keep code small, readable, and explainable, because every member must be
  able to explain every function.
 Don't add features I didn't ask for.
```

## Prompt 2: One-page spec

```text
For a CRUD app, my pick is a workout tracker. Write a ONE-PAGE spec containing:
- 2-3 entities with fields and types
- 4 to 5 REST endpoints (method, path, request body, response, status codes)
- 3 UI screens (name, purpose, main components)
- Auth approach (simple JWT or session)
Keep it realistic for a 1-week student project, and don't add features
beyond what's listed.
```

## Prompt 3: Spec approval and stack proposal

```text
Spec approved, keep it as is (no register endpoint, seed script instead).
My machine has Node 26.13.0 and npm 11.20.0 on Windows with PowerShell.
Nothing else is installed yet, so I'll be installing everything with npm.
I want to use React with Vite for the front end, and Express with SQLite
(better-sqlite3) for the back end. Propose the stack with exact pinned
versions, the folder structure and the install commands. Flag any package
you're not 100% sure exists, and tell me whether better-sqlite3 and bcrypt
support Node 26, or whether bcryptjs is safer. Use .env for secrets with a
.env.example, and add a .gitignore. Write all commands for PowerShell
(use ; not &&). Don't write any app code yet.
```

## Prompt 4: Installed versions confirmed

```text
Setup done. Node 26.13.0, npm 11.20.0, Windows PowerShell.
Server: express 5.3.0, better-sqlite3 12.11.1 (load test passed),
bcryptjs 3.0.3, jsonwebtoken 9.0.3.
Client: react 19.3.1, react-dom 19.3.1, vite 8.3.7, @vitejs/plugin-react 6.1.2.
.env and .env.example created, .env is git-ignored. Use these exact
versions in all code.
```

## Prompt 5: Two seeded users, then auth (login and JWT middleware)

```text
Step 1 is done and working. Change the seed script to create two users
(SEED_EMAIL/SEED_PASSWORD and SEED_EMAIL_2/SEED_PASSWORD_2 from .env) and
tell me exactly what to change in .env and .env.example. Then continue with
step 2. Put the full file path above every code block.
```

## Prompt 6: Workout endpoints, error handler and tests

```text
Step 2 is done. Now write the four workout endpoints from our spec
(GET, POST, PUT, DELETE /api/workouts) behind requireAuth. Each user must
only touch their own workouts. Validate input as in the spec, use
parameterized queries, and add one central error handler that doesn't leak
internal errors. Express 5.3.0. Put the file path above each code block, and
give me tests for each endpoint, including one where user B tries to edit and
delete user A's workout.
```

## Prompt 7: Two failing test checks reported

```text
Two checks in your B1 test script fail: "A's workout still exists" (got '0',
expected '1') and "A's workout not modified" (got '', expected 'Leg day
(heavy)'). Every other check passes, including B PUT and B DELETE returning
404 and the DELETE-own check returning 204. Find the cause and fix the
script.
```

## Prompt 8: Full corrected test script

```text
Thanks. Please send the full corrected B1 script as one code block with all
the changes applied, so I can paste it in one go.
```

## Prompt 9: First WorkoutList component

```text
Step 3 is done and all tests pass. Now the front end. Make a React component that shows a list of workouts.
```

## Prompt 10: Accessible, responsive WorkoutList with CSS

```text
Now build the same WorkoutList component again, properly, in WorkoutList.jsx
with a separate WorkoutList.css. It needs loading, empty, error and success
states, Edit and Delete buttons on each row, an Add workout button and a
Logout button. It must be accessible (semantic table with a caption, labelled
buttons, keyboard operable, visible focus, errors announced to screen readers)
and responsive from 320px up. No inline styles, no UI library. Keep the file
path above each code block.
```

## Prompt 11: CSS problems found at 320px, edited CSS becomes the base

```text
I tested your WorkoutList at 320px and found problems in the CSS you wrote:
dates wrapped onto two lines, workout names broke mid-word, and the Delete
button was clipped. I fixed it myself by adding white-space: nowrap on table
cells (names still wrap) and min-width: 34rem on the table so it scrolls
inside its wrapper. Use my edited WorkoutList.css as the base from now on.
```

## Prompt 12: Login, workout form and connection to the real backend

```text
Yes, go ahead. Build the Login and Add/Edit workout form screens, and connect everything to the real backend: api.js, the /api proxy, and App loading real workouts.
```

## Prompt 13: Form error not clearing

```text
I found a bug in WorkoutForm.jsx. I clicked Save with the form empty, so the errors appeared. Then I typed a valid duration (45), but the old error and red border stayed until I pressed Save again. Why does this happen, and how do I fix it?
```

## Prompt 14: README, SPEC.md and this log

```text
Now write the README (project description, exact stack versions, setup steps including npm ci and copying .env.example to .env, endpoint table, known limitations) and a SPEC.md from our approved spec. Also make  a file/ log of all the prompts given to you.
```
