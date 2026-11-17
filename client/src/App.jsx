import { useEffect, useState } from 'react';
import {
  getToken,
  clearToken,
  login,
  listWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  errorText,
} from './api.js';
import Login from './screens/Login.jsx';
import WorkoutList from './screens/WorkoutList.jsx';
import WorkoutForm from './screens/WorkoutForm.jsx';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => getToken() !== null);
  const [screen, setScreen] = useState('list');
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState('loading');
  const [workouts, setWorkouts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  function logout() {
    clearToken();
    setLoggedIn(false);
    setScreen('list');
    setEditing(null);
    setWorkouts([]);
    setStatus('loading');
    setActionError('');
  }

  useEffect(() => {
    if (!loggedIn || screen !== 'list') return;

    let ignore = false;
    setStatus('loading');
    setActionError('');

    listWorkouts()
      .then((data) => {
        if (ignore) return;
        setWorkouts(data);
        setStatus('success');
      })
      .catch((err) => {
        if (ignore) return;
        if (err.status === 401) {
          logout();
          return;
        }
        setLoadError(errorText(err, 'Could not load your workouts.'));
        setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [loggedIn, screen]);

  async function handleLogin(email, password) {
    await login(email, password);
    setLoggedIn(true);
  }

  async function handleSave(values) {
    try {
      if (editing) {
        await updateWorkout(editing.id, values);
      } else {
        await createWorkout(values);
      }
      setScreen('list');
      setEditing(null);
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      throw err;
    }
  }

  async function handleDelete(workout) {
    setActionError('');
    try {
      await deleteWorkout(workout.id);
      setWorkouts((current) => current.filter((w) => w.id !== workout.id));
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setActionError(errorText(err, 'Could not delete the workout.'));
    }
  }

  function openForm(workout) {
    setEditing(workout);
    setScreen('form');
  }

  function closeForm() {
    setEditing(null);
    setScreen('list');
  }

  return (
    <main>
      {!loggedIn && <Login onSubmit={handleLogin} />}

      {loggedIn && screen === 'list' && (
        <WorkoutList
          status={status}
          workouts={workouts}
          errorMessage={loadError}
          actionError={actionError}
          onAdd={() => openForm(null)}
          onEdit={openForm}
          onDelete={handleDelete}
          onLogout={logout}
        />
      )}

      {loggedIn && screen === 'form' && (
        <WorkoutForm workout={editing} onSubmit={handleSave} onCancel={closeForm} />
      )}
    </main>
  );
}