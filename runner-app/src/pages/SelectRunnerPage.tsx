import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { SelectionList } from '../components/SelectionList';
import { BackButton } from '@/components/BackButton';

interface ListItem {
  id: string;
  imageUrl?: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export default function SelectRunnerPage() {
  const {
    teams,
    runners,
    runnersLoading,
    selectedTeamId,
    selectRunner,
    takenRunnerIds,
  } = useRunSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTeamId) {
      void navigate('/select-team');
    }
  }, [selectedTeamId, navigate]);

  if (!selectedTeamId) {
    return null;
  }

  const selectedTeam = teams.find((team) => team._id === selectedTeamId);

  const uniqueRunners = Array.from(
    new Map(runners.map((r) => [r._id, r])).values(),
  );

  const available: ListItem[] = [];
  const active: ListItem[] = [];
  const finished: ListItem[] = [];

  for (const runner of uniqueRunners) {
    const slots = runners.filter((r) => r._id === runner._id).length;
    const used = runner.resultCount ?? 0;
    const label =
      runner.firstName && runner.lastName
        ? `${runner.firstName} ${runner.lastName}`
        : (runner.alias ?? 'Unknown');
    const sublabel = slots > 1 ? `${used}/${slots} finished` : undefined;

    if (takenRunnerIds.has(runner._id)) {
      active.push({
        id: runner._id,
        imageUrl: runner.imageUrl,
        label,
        sublabel,
        disabled: true,
      });
    } else if (used < slots) {
      available.push({
        id: runner._id,
        imageUrl: runner.imageUrl,
        label,
        sublabel,
      });
    }

    if (used > 0) {
      finished.push({
        id: runner._id,
        imageUrl: runner.imageUrl,
        label,
        sublabel,
        disabled: true,
      });
    }
  }

  return (
    <>
      {selectedTeam && (
        <h1 className="text-xl font-semibold text-surface-content pb-4 text-left">
          {selectedTeam.teamName}
        </h1>
      )}
      <div className="flex flex-col gap-6">
        {(runnersLoading || available.length > 0) && (
          <SelectionList
            title={`Select Runner (${available.length})`}
            items={available}
            loading={runnersLoading}
            onSelect={(id) => {
              selectRunner(id);
              void navigate('/running');
            }}
            variant="runner"
          />
        )}

        {active.length > 0 && (
          <SelectionList
            title={`Running (${active.length})`}
            items={active}
            onSelect={() => {}}
            variant="runner"
          />
        )}

        {finished.length > 0 && (
          <SelectionList
            title={`Finished (${finished.length})`}
            items={finished}
            onSelect={() => {}}
            variant="runner"
          />
        )}
      </div>

      <div className="flex justify-center mt-8">
        <BackButton to="/select-team" />
      </div>
    </>
  );
}
