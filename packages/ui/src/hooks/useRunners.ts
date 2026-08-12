import { useEffect, useState } from 'react';
import { getRunnersQuery, type Runner } from '@dhl-relay/shared';
import type { SanityClient } from '@sanity/client';

export function useRunners(client: SanityClient) {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
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
  }, [client]);

  return { runners, loading, error };
}
