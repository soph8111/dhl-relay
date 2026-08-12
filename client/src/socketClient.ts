import { createSocket } from '@dhl-relay/shared';

export const socket = createSocket(
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3000',
);
