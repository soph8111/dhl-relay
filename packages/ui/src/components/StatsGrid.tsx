import { useEventStats } from '../hooks/useEventStats';
import { formatSeconds } from '@dhl-relay/shared';
import { StatCard } from './StatCard';
import type { SanityClient } from '@sanity/client';

interface StatsGridProps {
  client: SanityClient;
}

const CARD_CLASS =
  'bg-surface rounded-xl w-full h-35 px-4 py-3 flex flex-col justify-center';

export function StatsGrid({ client }: StatsGridProps) {
  const { stats, loading } = useEventStats(client);

  if (loading || !stats) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className={CARD_CLASS}>
        <StatCard
          variant="horizontal"
          value={String(stats.beatsReferenceCount)}
          label="Dwarf runners"
          sublabel="have earned a day off"
        />
      </div>
      <div className={CARD_CLASS}>
        <StatCard
          variant="horizontal"
          value={String(stats.finishedCount)}
          label={`Out of ${stats.totalCount}`}
          sublabel="have crossed the finish line"
        />
      </div>
      <div className={CARD_CLASS}>
        <StatCard
          variant="horizontal"
          value={String(stats.beatsCutoffCount)}
          label="Dwarf runners"
          sublabel="have beat their cut-off time"
        />
      </div>
      <div className={CARD_CLASS}>
        <StatCard
          value={
            stats.closestMissSeconds != null
              ? `+${formatSeconds(stats.closestMissSeconds)}`
              : '—'
          }
          label="Closest miss"
        />
      </div>
      <div className={CARD_CLASS}>
        <StatCard
          value={
            stats.averagePaceSecondsPerKm != null
              ? formatSeconds(stats.averagePaceSecondsPerKm)
              : '—'
          }
          label="Dwarf Avg Pace"
          unit="/km"
        />
      </div>
      <div className={CARD_CLASS}>
        <StatCard
          value={
            stats.averageTimeSeconds != null
              ? formatSeconds(stats.averageTimeSeconds)
              : '—'
          }
          label="Dwarf Avg Time"
          unit="/km"
        />
      </div>
    </div>
  );
}
