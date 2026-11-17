import { useRef, useState } from 'react';
import { errorText } from '../api.js';
import './WorkoutForm.css';

export default function WorkoutForm({ workout, onSubmit, onCancel }) {
  const [name, setName] = useState(workout?.name ?? '');
  const [date, setDate] = useState(workout?.date ?? '');
  const [durationMin, setDurationMin] = useState(workout ? String(workout.durationMin) : '');
  const [notes, setNotes] = useState(workout?.notes ?? '');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef(null);
  const dateRef = useRef(null);
  const durationRef = useRef(null);

  const title = workout ? 'Edit workout' : 'Add workout';

  function validate() {
    const found = {};
    if (name.trim() === '') found.name = 'Enter a name.';
    if (date === '') found.date = 'Choose a date.';
    const minutes = Number(durationMin);
    if (durationMin === '' || !Number.isInteger(minutes) || minutes <= 0) {
      found.durationMin = 'Enter a whole number of minutes greater than 0.';
    }
    return found;
  }

  function clearError(key) {
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function invalidProps(key) {
    return errors[key]
      ? { 'aria-invalid': 'true', 'aria-describedby': `workout-${key}-error` }
      : {};
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const found = validate();
    setErrors(found);
    if (found.name) { nameRef.current.focus(); return; }
    if (found.date) { dateRef.current.focus(); return; }
    if (found.durationMin) { durationRef.current.focus(); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        date,
        durationMin: Number(durationMin),
        notes: notes.trim() === '' ? null : notes,
      });
    } catch (err) {
      setSubmitError(errorText(err, 'Could not save the workout.'));
      setSubmitting(false);
    }
  }

  return (
    <section className="workout-form" aria-labelledby="workout-form-title">
      <h1 id="workout-form-title" className="workout-form__title">{title}</h1>
      <p className="workout-form__hint">Name, date and duration are required.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="workout-form__field">
          <label htmlFor="workout-name" className="workout-form__label">Name</label>
          <input
            id="workout-name"
            ref={nameRef}
            className="workout-form__input"
            type="text"
            autoFocus
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError('name');
            }}
            {...invalidProps('name')}
          />
          {errors.name && (
            <p id="workout-name-error" className="workout-form__error">{errors.name}</p>
          )}
        </div>

        <div className="workout-form__field">
          <label htmlFor="workout-date" className="workout-form__label">Date</label>
          <input
            id="workout-date"
            ref={dateRef}
            className="workout-form__input"
            type="date"
            required
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              clearError('date');
            }}
            {...invalidProps('date')}
          />
          {errors.date && (
            <p id="workout-date-error" className="workout-form__error">{errors.date}</p>
          )}
        </div>

        <div className="workout-form__field">
          <label htmlFor="workout-durationMin" className="workout-form__label">
            Duration (minutes)
          </label>
          <input
            id="workout-durationMin"
            ref={durationRef}
            className="workout-form__input"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            required
            value={durationMin}
            onChange={(event) => {
              setDurationMin(event.target.value);
              clearError('durationMin');
            }}
            {...invalidProps('durationMin')}
          />
          {errors.durationMin && (
            <p id="workout-durationMin-error" className="workout-form__error">
              {errors.durationMin}
            </p>
          )}
        </div>

        <div className="workout-form__field">
          <label htmlFor="workout-notes" className="workout-form__label">Notes (optional)</label>
          <textarea
            id="workout-notes"
            className="workout-form__input workout-form__textarea"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div role="alert">
          {submitError && (
            <p className="workout-form__submit-error">
              <strong>Error:</strong> {submitError}
            </p>
          )}
        </div>

        <div className="workout-form__actions">
          <button type="submit" className="workout-form__button workout-form__button--primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="workout-form__button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}