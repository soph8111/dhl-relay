import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { SelectionList } from '../components/SelectionList';

export default function SelectTeamPage() {
  const { teams, teamsLoading, selectTeam } = useRunSession();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-2xl font-semibold text-surface-content pb-4 text-center">
        Select Team
      </h1>

      <SelectionList
        loading={teamsLoading}
        items={teams.map((team) => ({
          id: team._id,
          label: team.teamName,
        }))}
        onSelect={(id) => {
          selectTeam(id);
          void navigate('/select-runner');
        }}
        variant="team"
      />
    </>
  );
}
