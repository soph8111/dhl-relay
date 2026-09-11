import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { SelectionList } from '../components/SelectionList';
import { BackButton } from '@/components/BackButton';

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
    void navigate('/select-team');
    return null;
  }

  const uniqueRunners = Array.from(
    new Map(runners.map((r) => [r._id, r])).values(),
  );

  const items = uniqueRunners.map((runner) => {
    const totalOccurrences = runners.filter((r) => r._id === runner._id).length;
    const baseName =
      runner.firstName && runner.lastName
        ? `${runner.firstName} ${runner.lastName}`
        : (runner.alias ?? 'Unknown');
    const label =
      totalOccurrences > 1
        ? `${baseName} (${totalOccurrences} rounds)`
        : baseName;

    return {
      id: runner._id,
      label,
      disabled: takenRunnerIds.has(runner._id),
      disabledLabel: '(taken)',
    };
  });

  return (
    <>
      <SelectionList
        title="Select yourself"
        loading={runnersLoading}
        items={items}
        onSelect={(id) => {
          selectRunner(id);
          void navigate('/running');
        }}
      />
      <BackButton to="/select-team" />
    </>
  );
}
