import { createClient, type SanityClient } from '@sanity/client';

export interface SanityConfig {
  projectId: string;
  dataset: string;
}

export function createSanityClient(config: SanityConfig): SanityClient {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: '2024-01-01',
    useCdn: true,
  });
}
