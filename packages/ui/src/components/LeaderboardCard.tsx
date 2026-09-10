import { formatSignedSeconds } from '@dhl-relay/shared';
import type { LeaderboardEntry } from '@dhl-relay/shared';
import StarFilled from '../icons/StarFilled';
import StarOutline from '../icons/StarOutline';

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
    : runner.alias || 'Unknown runner';
}

function firstName(runner: {
  firstName: string;
  lastName: string;
  alias?: string;
}): string {
  return runner.firstName || runner.alias || 'Unknown runner';
}

export interface LeaderboardCardProps {
  rank: number;
  entry: LeaderboardEntry;
  isReference: boolean;
  onClick?: () => void;
}

export function LeaderboardCard({
  rank,
  entry,
  isReference,
  onClick,
}: LeaderboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center rounded-xl px-2 md:px-4 py-2.5 text-xs md:text-sm ${
        isReference
          ? 'bg-accent text-accent-content'
          : `bg-surface text-surface-content ${onClick ? 'cursor-pointer' : ''}`
      }`}
    >
      <span className="w-5 md:w-8">{rank}</span>

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
            <span className="md:hidden">{firstName(entry.runner)}</span>
            <span className="hidden md:inline">{runnerName(entry.runner)}</span>
          </div>
          {entry.runner.teamNames && entry.runner.teamNames.length > 0 ? (
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
}
