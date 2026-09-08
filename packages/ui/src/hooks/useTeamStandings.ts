import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import {
  getTeamStandingsQuery,
  buildTeamStandings,
  type TeamStanding,
} from '@dhl-relay/shared';

export function useTeamStandings(client: SanityClient) {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();

    const fetchStandings = () => {
      client
        .fetch(getTeamStandingsQuery, { year })
        .then(({ teams, results }) => {
          setStandings(buildTeamStandings(teams, results));
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchStandings();

    const subscription = client
      .listen(
        `*[_type == "result" && year == $year]`,
        { year },
        { visibility: 'query' },
      )
      .subscribe(() => fetchStandings());

    return () => subscription.unsubscribe();
  }, [client]);

  return { standings, loading };
}
