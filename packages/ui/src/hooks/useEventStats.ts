import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import {
  getReferenceRunnerQuery,
  getFinishedResultsQuery,
  getTotalRunnersCountQuery,
  calculateEventStats,
  type EventStats,
  type Gender,
} from '@dhl-relay/shared';

interface ReferenceRunnerResult {
  _id: string;
  age: number;
  gender: Gender;
  resultSeconds: number | null;
}

export function useEventStats(client: SanityClient) {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();

    const fetchStats = () => {
      Promise.all([
        client.fetch<ReferenceRunnerResult | null>(getReferenceRunnerQuery, {
          year,
        }),
        client.fetch(getFinishedResultsQuery, { year }),
        client.fetch<number>(getTotalRunnersCountQuery, { year }),
      ])
        .then(([reference, results, totalCount]) => {
          if (!reference || reference.resultSeconds == null) {
            setLoading(false);
            return;
          }

          setStats(
            calculateEventStats(results, totalCount, {
              runnerId: reference._id,
              age: reference.age,
              gender: reference.gender,
              resultSeconds: reference.resultSeconds,
            }),
          );
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchStats();

    const subscription = client
      .listen(`*[_type == "result"]`, {}, { visibility: 'query' })
      .subscribe(() => fetchStats());

    return () => subscription.unsubscribe();
  }, [client]);

  return { stats, loading };
}
