import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { formatSeconds, formatSignedSeconds } from '@dhl-relay/shared';
import type { LeaderboardEntry } from '@dhl-relay/shared';
import StarFilled from '../icons/StarFilled';
import StarOutline from '../icons/StarOutline';
import CloseIcon from '../icons/CloseIcon';
import { StatCard } from './StatCard';

interface RunnerDetailModalProps {
  entry: LeaderboardEntry | null;
  onClose: () => void;
  hasBottomNav?: boolean;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

function runnerName(runner: {
  firstName: string;
  lastName: string;
  alias?: string;
}) {
  return runner.alias ?? `${runner.firstName} ${runner.lastName}`;
}

export function RunnerDetailModal({
  entry,
  onClose,
  hasBottomNav,
}: RunnerDetailModalProps) {
  const isDesktop = useIsDesktop();
  const offscreen = isDesktop ? { x: '100%' } : { y: '100%' };

  return (
    <AnimatePresence>
      {entry && (
        <div className="fixed inset-0 z-2000 ">
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 bg-background/70 backdrop-blur-xs transition-opacity duration-300 ease-outs"
          />

          {/* Panel: bottom sheet på mobil, side-panel på desktop */}
          <motion.div
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className={`absolute bg-background shadow-2xl inset-x-0 bottom-0 h-full max-h-fit rounded-t-3xl
              md:left-auto md:w-xl md:mr-8 ${hasBottomNav ? 'pb-20' : ''}`}
          >
            <div className="relative bg-accent h-35 md:h-50 md:mt-0 rounded-t-3xl">
              <button
                onClick={onClose}
                aria-label="X"
                className="absolute top-5 right-4 w-10 h-10 text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity hover:cursor-pointer"
              >
                <CloseIcon />
              </button>
              {entry.runner.imageUrl && (
                <img
                  src={entry.runner.imageUrl}
                  alt=""
                  className="w-28 h-28 md:w-30 md:h-30 rounded-full object-cover absolute -bottom-14 md:-bottom-14.5 left-6"
                />
              )}
            </div>

            <div className="pt-18 px-6 pb-8">
              <div className="flex items-center">
                <h2 className="text-3xl font-semibold text-surface-content w-full">
                  {runnerName(entry.runner)}
                </h2>
                {!entry.isReference &&
                  (entry.beatsReference ? (
                    <StarFilled className="text-accent w-8 h-8" />
                  ) : (
                    <StarOutline className="text-accent w-8 h-8" />
                  ))}
              </div>
              <p className="text-surface-content-muted my-2 text-sm md:text-base capitalize">
                Age {entry.runner.age} • {entry.runner.gender}
              </p>
              <p className="text-surface-content md:text-lg">
                {entry.runner.teamNames && entry.runner.teamNames.length > 0
                  ? entry.runner.teamNames.join(', ')
                  : 'No teams'}
              </p>
              <hr className="my-5 text-surface" />
              <div className="grid grid-cols-2 md:grid-cols-[2fr_3fr] gap-3 mt-6">
                <div className="bg-surface rounded-2xl p-4 h-35 flex justify-between">
                  <StatCard
                    label="Cut-off"
                    value={formatSeconds(entry.targetSeconds)}
                    variant="modal"
                    className="flex justify-between"
                  />
                </div>
                <div className="bg-surface rounded-2xl p-4 h-35">
                  <StatCard
                    label="Time"
                    value={formatSeconds(entry.resultSeconds)}
                    sublabel={formatSeconds(entry.comparedResultSeconds)}
                    variant="modal"
                    className="text-right flex-col"
                  />
                </div>
                <div className="bg-surface rounded-2xl p-4 h-35 flex justify-between">
                  <StatCard
                    label="Avg Pace"
                    value={formatSeconds(entry.resultSeconds / 5)}
                    unit="/km"
                    variant="modal"
                    className="flex justify-between"
                  />
                </div>
                {!entry.isReference && (
                  <div className="bg-surface rounded-2xl p-4 h-35">
                    <StatCard
                      label="Earned a day off?"
                      value={formatSignedSeconds(entry.marginSeconds)}
                      accent={entry.beatsReference}
                      variant="modal"
                      className="text-right"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
