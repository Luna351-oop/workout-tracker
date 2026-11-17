import Database from 'better-sqlite3';

const db = new Database(process.env.DB_PATH);

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    email        TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER NOT NULL REFERENCES users(id),
    name        TEXT NOT NULL,
    date        TEXT NOT NULL,
    durationMin INTEGER NOT NULL CHECK (durationMin > 0),
    notes       TEXT
  );
`);

export default db;