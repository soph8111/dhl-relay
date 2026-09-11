import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';
import { SelectionList } from '../components/SelectionList';

export default function SelectTeamPage() {
  const { teams, teamsLoading, selectTeam } = useRunSession();
  const navigate = useNavigate();

  return (
    <SelectionList
      title="Select your team"
      loading={teamsLoading}
      items={teams.map((team) => ({ id: team._id, label: team.teamName }))}
      onSelect={(id) => {
        selectTeam(id);
        void navigate('/select-runner');
      }}
    />
  );
}
