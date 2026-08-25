import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import {
  getReferenceRunnerQuery,
  getResultsQuery,
  buildLeaderboard,
  type LeaderboardEntry,
  type Gender,
} from '@dhl-relay/shared';

interface ReferenceRunnerResult {
  _id: string;
  age: number;
  gender: Gender;
  resultSeconds: number | null;
}

export function useLeaderboard(client: SanityClient) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [referenceRunnerId, setReferenceRunnerId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const year = new Date().getFullYear();

    const fetchLeaderboard = async () => {
      try {
        const [reference, results] = await Promise.all([
          client.fetch<ReferenceRunnerResult | null>(getReferenceRunnerQuery, {
            year,
          }),
          client.fetch(getResultsQuery, { year }),
        ]);

        if (!reference) {
          setError('Ingen referenceløber er markeret i Sanity endnu.');
          setLoading(false);
          return;
        }

        if (reference.resultSeconds == null) {
          setError('Referenceløberen er ikke kommet i mål endnu.');
          setLoading(false);
          return;
        }

        const leaderboard = buildLeaderboard(results, {
          age: reference.age,
          gender: reference.gender,
          resultSeconds: reference.resultSeconds,
        });

        setError(null);
        setReferenceRunnerId(reference._id);
        setEntries(leaderboard);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Kunne ikke hente leaderboard-data');
        setLoading(false);
      }
    };

    fetchLeaderboard();

    const subscription = client
      .listen(
        `*[_type == "result" && year == $year]`,
        { year },
        { visibility: 'query' },
      )
      .subscribe(() => {
        fetchLeaderboard();
      });

    return () => subscription.unsubscribe();
  }, [client]);

  return {
    entries,
    referenceRunnerId,
    loading,
    error,
  };
}
