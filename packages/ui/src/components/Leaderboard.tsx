import { useLeaderboard } from '../hooks/useLeaderboard';
import type { SanityClient } from '@sanity/client';
import { formatSignedSeconds } from '@dhl-relay/shared';

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

export function Leaderboard({ client }: LeaderboardProps) {
  const { entries, referenceRunnerId, loading, error } = useLeaderboard(client);

  if (loading) return <p>Indlæser leaderboard...</p>;
  if (error) return <p>{error}</p>;
  if (entries.length === 0) return <p>Ingen resultater endnu.</p>;

  return (
    <div className="h-96 overflow-y-auto rounded-xl shadow-lg bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-white border-b border-gray-200">
          <tr>
            <th className="px-4 py-2 text-sm font-semibold text-gray-500">#</th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-500">
              Løber
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-500 text-right">
              Faktisk tids
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-500 text-right">
              Direktørtid
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-500 text-center">
              Slog chef
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const isReference = entry.runner._id === referenceRunnerId;

            return (
              <tr
                key={entry.runner._id}
                className={`border-b border-gray-100 ${
                  isReference
                    ? 'bg-gray-900 text-white'
                    : entry.beatsReference
                      ? 'bg-yellow-50'
                      : ''
                }`}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  {entry.runner.imageUrl && (
                    <img
                      src={entry.runner.imageUrl}
                      alt=""
                      className="block w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span>{runnerName(entry.runner)}</span>
                  {entry.runner.teamNames &&
                    entry.runner.teamNames.length > 0 && (
                      <span className="block text-gray-400">
                        {entry.runner.teamNames.join(', ')}
                      </span>
                    )}
                  {isReference && <span className=" opacity-75">(chef)</span>}
                </td>
                <td className="px-4 py-2 text-right font-mono">
                  {formatTime(entry.resultSeconds)}
                </td>
                <td className="px-4 py-2 text-right font-mono">
                  {isReference ? (
                    '—'
                  ) : (
                    <>
                      <div>{formatTime(entry.comparedResultSeconds)}</div>
                      <div className="text-xs text-gray-400 font-sans">
                        {formatSignedSeconds(entry.marginSeconds)}
                      </div>
                    </>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {!isReference && entry.beatsReference ? '⭐' : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
