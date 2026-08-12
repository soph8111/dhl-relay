import { createSanityClient } from '@dhl-relay/shared';

export const sanityClient = createSanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
});
