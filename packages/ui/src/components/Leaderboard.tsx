import { useLeaderboard } from '../hooks/useLeaderboard';
import type { SanityClient } from '@sanity/client';
import type { LeaderboardEntry } from '@dhl-relay/shared';
import { LeaderboardCard } from './LeaderboardCard';
import { motion, AnimatePresence } from 'motion/react';

interface LeaderboardProps {
  client: SanityClient;
  onSelectEntry?: (entry: LeaderboardEntry) => void;
}

export function Leaderboard({ client, onSelectEntry }: LeaderboardProps) {
  const { entries, referenceRunnerId, loading, error } = useLeaderboard(client);

  if (loading)
    return <p className="text-surface-content-muted">Loading leaderboard...</p>;
  if (error) return <p className="text-surface-content-muted">{error}</p>;
  if (entries.length === 0)
    return <p className="text-surface-content-muted">No results yet.</p>;

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
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto md:max-h-full pb-9">
          <AnimatePresence>
            {entries.map((entry, index) => {
              const isReference = entry.runner._id === referenceRunnerId;

              return (
                <motion.div
                  key={entry.runner._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                >
                  <LeaderboardCard
                    rank={index + 1}
                    entry={entry}
                    isReference={isReference}
                    onClick={() => onSelectEntry?.(entry)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
