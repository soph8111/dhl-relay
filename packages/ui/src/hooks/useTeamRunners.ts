import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import { getTeamRunnersQuery } from '@dhl-relay/shared';

interface TeamRunner {
  _id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  imgUrl?: string;
  resultCount: number;
}

// Fetches members of a specific team - null teamId means "not selected yet".
// Re-fetches whenever any result changes, so resultCount stays live.
export function useTeamRunners(client: SanityClient, teamId: string | null) {
  const [runners, setRunners] = useState<TeamRunner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) {
      setRunners([]);
      return;
    }

    setLoading(true);

    const fetchRunners = () => {
      client
        .fetch<TeamRunner[]>(getTeamRunnersQuery, { teamId })
        .then((result) => {
          setRunners(result);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchRunners();

    const subscription = client
      .listen(`*[_type == "result"]`, {}, { visibility: 'query' })
      .subscribe(() => fetchRunners());

    return () => subscription.unsubscribe();
  }, [client, teamId]);

  return { runners, loading };
}
