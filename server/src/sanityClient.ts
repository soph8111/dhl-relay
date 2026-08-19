import 'dotenv/config';
import { createSanityClient } from '@dhl-relay/shared';

export const sanityClient = createSanityClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
