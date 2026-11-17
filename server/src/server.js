import express from 'express';
import './db.js';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import errorHandler from './errorhandler.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set in .env');
  process.exit(1);
}

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
 
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});