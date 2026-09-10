import { useNavigate } from 'react-router-dom';
import { useRunSession } from '../context/RunSessionContext';

export default function SelectTeamPage() {
  const { teams, teamsLoading, selectTeam } = useRunSession();
  const navigate = useNavigate();

  if (teamsLoading)
    return <p className="p-4 text-surface-content-muted">Loading teams...</p>;

  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className="text-xl font-semibold text-surface-content mb-2">
        Select your team
      </h1>

      {teams.map((team) => (
        <button
          key={team._id}
          onClick={() => {
            selectTeam(team._id);
            void navigate('/select-runner');
          }}
          className="bg-surface text-surface-content rounded-xl px-4 py-3 text-left"
        >
          {team.teamName}
        </button>
      ))}
    </div>
  );
}
