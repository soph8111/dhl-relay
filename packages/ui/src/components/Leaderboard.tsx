import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatSignedSeconds } from '@dhl-relay/shared';
import type { SanityClient } from '@sanity/client';
import StarFilled from '../icons/StarFilled';
import StarOutline from '../icons/StarOutline';

interface LeaderboardProps {
  client: SanityClient;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function runnerName(runner: {
  firstName: string;
  lastName: string;
  alias?: string;
}): string {
  return runner.firstName && runner.lastName
    ? `${runner.firstName} ${runner.lastName}`
    : runner.alias || 'Ukendt løber';
}

function firstName(runner: {
  firstName: string;
  lastName: string;
  alias?: string;
}): string {
  return runner.firstName || runner.alias || 'Ukendt løber';
}

export function Leaderboard({ client }: LeaderboardProps) {
  const { entries, referenceRunnerId, loading, error } = useLeaderboard(client);

  if (loading)
    return (
      <p className="text-surface-content-muted">Indlæser leaderboard...</p>
    );
  if (error) return <p className="text-surface-content-muted">{error}</p>;
  if (entries.length === 0)
    return (
      <p className="text-surface-content-muted">Ingen resultater endnu.</p>
    );

  return (
    <div className="flex flex-col md:h-full">
      <div className="flex items-center px-2 md:px-4 pb-2 text-xs text-surface-content">
        <span className="w-5 md:w-8">#</span>
        <span className="flex-1">Runner</span>
        <span className="w-15 md:w-24 text-right">Time</span>
        <span className="w-15 md:w-24 text-right">
          <span className="md:hidden">Calc.</span>
          <span className="hidden md:inline">Calc. time</span>
        </span>
        <span className="w-13 md:w-20 text-right">Day off</span>
      </div>

      <div className="relative md:min-h-0">
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto md:max-h-full ">
          {entries.map((entry, index) => {
            const isReference = entry.runner._id === referenceRunnerId;

            return (
              <div
                key={entry.runner._id}
                className={`flex items-center rounded-xl px-2 md:px-4 py-2.5 text-xs md:text-sm last:mb-9 ${
                  isReference
                    ? 'bg-accent text-accent-content'
                    : 'bg-surface text-surface-content'
                }`}
              >
                <span className="w-5 md:w-8">{index + 1}</span>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  {entry.runner.imageUrl ? (
                    <img
                      src={entry.runner.imageUrl}
                      alt=""
                      className="block w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface-content-muted/30 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate">
                      <span className="md:hidden">
                        {firstName(entry.runner)}
                      </span>
                      <span className="hidden md:inline">
                        {runnerName(entry.runner)}
                      </span>
                    </div>
                    {entry.runner.teamNames &&
                    entry.runner.teamNames.length > 0 ? (
                      <div className="text-2xs md:text-xs text-surface-content-muted truncate">
                        {entry.runner.teamNames.join(', ')}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="w-15 md:w-24 text-right">
                  {formatTime(entry.resultSeconds)}
                </div>
                <div className="w-15 md:w-24 text-right">
                  {isReference ? (
                    '—'
                  ) : (
                    <>
                      <div>{formatTime(entry.comparedResultSeconds)}</div>
                      <div className="text-xs text-surface-content-muted">
                        {formatSignedSeconds(entry.marginSeconds)}
                      </div>
                    </>
                  )}
                </div>
                <div className="w-13 md:w-20 flex justify-end pr-2 md:px-3">
                  {isReference ? null : entry.beatsReference ? (
                    <StarFilled className="text-accent" />
                  ) : (
                    <StarOutline className="text-accent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
