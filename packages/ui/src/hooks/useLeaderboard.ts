import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import {
  getReferenceRunnerQuery,
  getResultsQuery,
  buildLeaderboard,
  type LeaderboardEntry,
  type Gender,
} from '@dhl-relay/shared';

// Custom hook to fetch leaderboard data from Sanity and listen for changes in the "result" documents
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
    // Get current year
    const year = new Date().getFullYear();

    const fetchLeaderboard = async () => {
      try {
        // Fetch reference runner and results. Using queries from shared package
        const [reference, results] = await Promise.all([
          client.fetch<ReferenceRunnerResult | null>(getReferenceRunnerQuery, {
            year,
          }),
          client.fetch(getResultsQuery, { year }),
        ]);

        if (!reference) {
          setError('No reference runner has been marked in Sanity yet.');
          setLoading(false);
          return;
        }

        if (reference.resultSeconds == null) {
          setError('The reference runner has not finished yet.');
          setLoading(false);
          return;
        }

        // Build leaderboard using the buildLeaderboard function from the shared package
        const leaderboard = buildLeaderboard(results, {
          runnerId: reference._id,
          age: reference.age,
          gender: reference.gender,
          resultSeconds: reference.resultSeconds,
        });

        // Update state with the fetched leaderboard data
        setError(null);
        setReferenceRunnerId(reference._id);
        setEntries(leaderboard);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Could not fetch leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to changes in the "result" documents to update the leaderboard when results change
    const subscription = client
      .listen(`*[_type == "result"]`, {}, { visibility: 'query' })
      .subscribe(() => fetchLeaderboard());

    return () => subscription.unsubscribe();
  }, [client]);

  return {
    entries,
    referenceRunnerId,
    loading,
    error,
  };
}
