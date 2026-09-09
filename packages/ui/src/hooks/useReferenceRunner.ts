import { useEffect, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import { getReferenceRunnerQuery, type Gender } from '@dhl-relay/shared';

interface ReferenceRunner {
  firstName: string;
  alias?: string;
  age: number;
  gender: Gender;
  resultSeconds: number | null;
}

export function useReferenceRunner(client: SanityClient) {
  const [reference, setReference] = useState<ReferenceRunner | null>(null);

  useEffect(() => {
    const year = new Date().getFullYear();

    client
      .fetch<ReferenceRunner | null>(getReferenceRunnerQuery, { year })
      .then(setReference)
      .catch((err) => console.error(err));
  }, [client]);

  return reference;
}
