import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import { getTeamRunnersQuery, type Runner } from '@dhl-relay/shared';

export type TeamRunner = Runner & { resultCount: number };

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
