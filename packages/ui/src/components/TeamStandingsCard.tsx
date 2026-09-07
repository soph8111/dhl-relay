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
    return (
      <p className="text-surface-content-muted">Ingen holdresultater endnu.</p>
    );

  return (
    <div className="bg-surface rounded-xl px-4 py-3">
      <div className="text-sm font-semibold text-white mb-2">Fastest teams</div>
      <div className="flex flex-col gap-1">
        {standings.map((team) => (
          <div
            key={team.teamId}
            className={`flex items-center justify-between bg-background rounded-lg px-3 py-2 ${!team.isComplete ? 'opacity-70' : 'opacity-100'}`}
          >
            <span className="text-surface-content text-xs flex flex-col">
              {team.teamName}
              <span className="text-surface-content-muted text-2xs">
                {team.finishedCount}/{team.totalRunners}
              </span>
            </span>
            <span className="text-surface-content text-sm">
              {formatDuration(team.totalSeconds)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
