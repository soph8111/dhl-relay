import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import { getTeamRunnersQuery } from '@dhl-relay/shared';

interface TeamRunner {
  _id: string;
  firstName: string;
  lastName: string;
  alias?: string;
}

// Fetches members of a specific team - null teamId means "not selected yet".
export function useTeamRunners(client: SanityClient, teamId: string | null) {
  const [runners, setRunners] = useState<TeamRunner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) {
      setRunners([]);
      return;
    }

    setLoading(true);

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
  }, [client, teamId]);

  return { runners, loading };
}
