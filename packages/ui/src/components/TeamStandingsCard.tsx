import { useTeamStandings } from '../hooks/useTeamStandings';
import { formatDuration } from '@dhl-relay/shared';
import type { SanityClient } from '@sanity/client';

interface TeamStandingsCardProps {
  client: SanityClient;
}

export function TeamStandingsCard({ client }: TeamStandingsCardProps) {
  const { standings, loading } = useTeamStandings(client);

  if (loading) return null;
  if (standings.length === 0)
    return <p className="text-gray-400">Ingen holdresultater endnu.</p>;

  return (
    <div className="bg-gray-800 rounded-xl px-4 py-3">
      <div className="text-sm font-semibold text-white mb-2">Fastest teams</div>
      <div className="flex flex-col gap-1">
        {standings.map((team) => (
          <div
            key={team.teamId}
            className={`flex items-center justify-between bg-gray-700 rounded-lg px-3 py-2 ${!team.isComplete ? 'opacity-40' : 'opacity-100'}`}
          >
            <span className="text-white text-sm">
              {team.teamName}
              <span className="text-gray-400 text-xs ml-2">
                {team.finishedCount}/{team.totalRunners}
              </span>
            </span>
            <span className="text-white font-mono text-sm">
              {formatDuration(team.totalSeconds)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
