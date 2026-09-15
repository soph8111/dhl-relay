// Sanity client configuration. Used by client and runner-app (read-only) and server (read/write) to talk to Sanity.

import { createClient, type SanityClient } from '@sanity/client';

export interface SanityConfig {
  projectId: string;
  dataset: string;
  token?: string | undefined;
  useCdn?: boolean;
}

export function createSanityClient(config: SanityConfig): SanityClient {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: '2024-01-01',
    useCdn: config.useCdn ?? true,
    ...(config.token ? { token: config.token } : {}),
  });
}
