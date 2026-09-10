import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';

export default function SelectRunnerPage() {
  const {
    runners,
    runnersLoading,
    selectedTeamId,
    selectRunner,
    takenRunnerIds,
  } = useRunSession();
  const navigate = useNavigate();

  if (!selectedTeamId) {
    void navigate('/');
    return null;
  }

  if (runnersLoading)
    return <p className="p-4 text-surface-content-muted">Loading runners...</p>;

  const uniqueRunners = Array.from(
    new Map(runners.map((r) => [r._id, r])).values(),
  );

  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className="text-xl font-semibold text-surface-content mb-2">
        Select yourself
      </h1>

      {uniqueRunners.map((runner) => {
        const totalOccurrences = runners.filter(
          (r) => r._id === runner._id,
        ).length;
        const baseName =
          runner.firstName && runner.lastName
            ? `${runner.firstName} ${runner.lastName}`
            : runner.alias;
        const label =
          totalOccurrences > 1
            ? `${baseName} (${totalOccurrences} rounds)`
            : baseName;
        const isTaken = takenRunnerIds.has(runner._id);

        return (
          <button
            key={runner._id}
            disabled={isTaken}
            onClick={() => {
              selectRunner(runner._id);
              void navigate('/running');
            }}
            className={`rounded-xl px-4 py-3 text-left ${
              isTaken
                ? 'bg-surface/50 text-surface-content-muted'
                : 'bg-surface text-surface-content'
            }`}
          >
            {label} {isTaken && '(taken)'}
          </button>
        );
      })}
    </div>
  );
}
