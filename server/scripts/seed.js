import bcrypt from 'bcryptjs';
import db from '../src/db.js';

const users = [
  { email: process.env.SEED_EMAIL, password: process.env.SEED_PASSWORD },
  { email: process.env.SEED_EMAIL_2, password: process.env.SEED_PASSWORD_2 },
];

if (users.some((u) => !u.email || !u.password)) {
  console.error('SEED_EMAIL, SEED_PASSWORD, SEED_EMAIL_2 and SEED_PASSWORD_2 must be set in .env');
  process.exit(1);
}

const insert = db.prepare(
  'INSERT OR IGNORE INTO users (email, passwordHash) VALUES (?, ?)'
);

for (const user of users) {
  const passwordHash = bcrypt.hashSync(user.password, 10);
  const result = insert.run(user.email, passwordHash);
  console.log(result.changes ? `Created user ${user.email}` : `User ${user.email} already exists`);
}