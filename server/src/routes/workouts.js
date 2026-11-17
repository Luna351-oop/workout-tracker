import { Router } from 'express';
import db from '../db.js';
import requireAuth from '../auth.js';

const router = Router();

router.use(requireAuth);

const listStmt = db.prepare(
  'SELECT * FROM workouts WHERE userId = ? ORDER BY date DESC, id DESC'
);
const getStmt = db.prepare('SELECT * FROM workouts WHERE id = ? AND userId = ?');
const insertStmt = db.prepare(
  'INSERT INTO workouts (userId, name, date, durationMin, notes) VALUES (?, ?, ?, ?, ?)'
);
const updateStmt = db.prepare(
  'UPDATE workouts SET name = ?, date = ?, durationMin = ?, notes = ? WHERE id = ? AND userId = ?'
);
const deleteStmt = db.prepare('DELETE FROM workouts WHERE id = ? AND userId = ?');

function isValidDate(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const d = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === text;
}

function validateWorkout(body) {
  const { name, date, durationMin, notes } = body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    return { error: 'name is required' };
  }
  if (typeof date !== 'string' || !isValidDate(date)) {
    return { error: 'date must be a valid date in YYYY-MM-DD format' };
  }
  if (!Number.isInteger(durationMin) || durationMin <= 0) {
    return { error: 'durationMin must be a whole number greater than 0' };
  }
  if (notes != null && typeof notes !== 'string') {
    return { error: 'notes must be a string' };
  }

  return { value: { name: name.trim(), date, durationMin, notes: notes ?? null } };
}

router.get('/', (req, res) => {
  res.json(listStmt.all(req.userId));
});

router.post('/', (req, res) => {
  const { error, value } = validateWorkout(req.body);
  if (error) return res.status(400).json({ error });

  const result = insertStmt.run(
    req.userId, value.name, value.date, value.durationMin, value.notes
  );
  res.status(201).json(getStmt.get(result.lastInsertRowid, req.userId));
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'Workout not found' });

  const { error, value } = validateWorkout(req.body);
  if (error) return res.status(400).json({ error });

  const result = updateStmt.run(
    value.name, value.date, value.durationMin, value.notes, id, req.userId
  );
  if (result.changes === 0) return res.status(404).json({ error: 'Workout not found' });

  res.json(getStmt.get(id, req.userId));
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'Workout not found' });

  const result = deleteStmt.run(id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: 'Workout not found' });

  res.status(204).end();
});

export default router;