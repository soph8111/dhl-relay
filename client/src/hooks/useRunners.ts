import { useEffect, useState } from 'react';
import { sanityClient } from '../sanityClient';
import { getRunnersQuery } from '../sanity/queries/runnerQueries';

export interface Runner {
  _id: string;
  firstName: string;
  lastName: string;
  alias: string;
  imageUrl?: string;
}

export function useRunners() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sanityClient
      .fetch(getRunnersQuery)
      .then((data) => {
        setRunners(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch runners');
        setLoading(false);
      });
  }, []);

  return { runners, loading, error };
}
