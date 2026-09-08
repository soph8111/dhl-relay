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
    <div className="bg-surface rounded-xl px-4 py-3 h-full min-h-0 flex flex-col">
      <div className="text-sm font-semibold text-surface-content mb-2 shrink-0">
        Fastest teams
      </div>

      <div className="relative flex-1 min-h-0">
        <div className="h-full overflow-y-auto">
          <div className="flex flex-col gap-1 md:pb-6">
            {standings.map((team) => (
              <div
                key={team.teamId}
                className={`flex items-center justify-between bg-background rounded-lg px-3 py-2 shrink-0 ${
                  !team.isComplete ? 'opacity-60' : 'opacity-100'
                }`}
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
        <div className="hidden md:block pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#dfdfdf] dark:from-[#313131] to-transparent" />
      </div>
    </div>
  );
}
