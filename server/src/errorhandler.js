export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.status === 400) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}