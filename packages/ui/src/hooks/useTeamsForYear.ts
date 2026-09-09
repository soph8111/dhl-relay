import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import { getTeamsForYearQuery } from '@dhl-relay/shared';

interface Team {
  _id: string;
  teamName: string;
}

export function useTeamsForYear(client: SanityClient) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();

    client
      .fetch<Team[]>(getTeamsForYearQuery, { year })
      .then((result) => {
        setTeams(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [client]);

  return { teams, loading };
}
