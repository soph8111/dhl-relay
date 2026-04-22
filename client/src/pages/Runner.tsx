import { useRunners } from '../hooks/useRunners';

export default function RunnerPage() {
  const { runners, loading, error } = useRunners();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log(runners);
  return (
    <div>
      <h1>Vælg løber</h1>

      <select>
        <option value="">-- vælg --</option>
        {runners.map((runner) => (
          <option key={runner._id} value={runner._id}>
            {runner.firstName} {runner.lastName}
          </option>
        ))}
      </select>
    </div>
  );
}
