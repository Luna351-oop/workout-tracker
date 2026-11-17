import { useState } from 'react';
import { errorText } from '../api.js';
import './Login.css';

export default function Login({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(errorText(err, 'Could not reach the server.'));
      setSubmitting(false);
    }
  }

  return (
    <section className="login" aria-labelledby="login-title">
      <h1 id="login-title" className="login__title">Log in</h1>

      <form onSubmit={handleSubmit}>
        <div className="login__field">
          <label htmlFor="login-email" className="login__label">Email</label>
          <input
            id="login-email"
            className="login__input"
            type="email"
            autoComplete="username"
            autoFocus
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="login__field">
          <label htmlFor="login-password" className="login__label">Password</label>
          <input
            id="login-password"
            className="login__input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div role="alert">
          {error && (
            <p className="login__error">
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>

        <button type="submit" className="login__button" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </section>
  );
} 