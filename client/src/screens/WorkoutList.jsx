import './WorkoutList.css';

export default function WorkoutList({
  status,
  workouts = [],
  errorMessage = 'Could not load your workouts.',
  actionError = '',
  onAdd,
  onEdit,
  onDelete,
  onLogout,
}) {
  const isEmpty = status === 'success' && workouts.length === 0;
  const hasRows = status === 'success' && workouts.length > 0;

  return (
    <section className="workout-list" aria-labelledby="workout-list-title">
      <header className="workout-list__header">
        <h1 id="workout-list-title" className="workout-list__title">
          My workouts
        </h1>
        <div className="workout-list__toolbar">
          <button
            type="button"
            className="workout-list__button workout-list__button--primary"
            onClick={onAdd}
          >
            Add workout
          </button>
          <button type="button" className="workout-list__button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div role="status" className="workout-list__message">
        {status === 'loading' && <p>Loading workouts…</p>}
        {isEmpty && <p>No workouts yet. Select Add workout to create your first one.</p>}
      </div>

      <div role="alert">
        {status === 'error' && (
          <p className="workout-list__error">
            <strong>Error:</strong> {errorMessage}
          </p>
        )}
        {actionError && (
          <p className="workout-list__error">
            <strong>Error:</strong> {actionError}
          </p>
        )}
      </div>

      {hasRows && (
        <div
          className="workout-list__scroll"
          role="region"
          aria-labelledby="workout-list-caption"
          tabIndex={0}
        >
          <table className="workout-list__table">
            <caption id="workout-list-caption" className="workout-list__visually-hidden">
              Your workouts, newest first
            </caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">Duration</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <th scope="row" className="workout-list__name">
                    {workout.name}
                  </th>
                  <td>{workout.date}</td>
                  <td>{workout.durationMin} min</td>
                  <td>
                    <div className="workout-list__row-actions">
                      <button
                        type="button"
                        className="workout-list__button"
                        aria-label={`Edit ${workout.name} on ${workout.date}`}
                        onClick={() => onEdit(workout)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="workout-list__button workout-list__button--danger"
                        aria-label={`Delete ${workout.name} on ${workout.date}`}
                        onClick={() => onDelete(workout)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}