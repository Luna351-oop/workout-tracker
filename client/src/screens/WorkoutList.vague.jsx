export default function WorkoutList({ workouts }) {
  if (workouts.length === 0) {
    return <p>No workouts yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((workout) => (
          <tr key={workout.id}>
            <td>{workout.name}</td>
            <td>{workout.date}</td>
            <td>{workout.durationMin} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}