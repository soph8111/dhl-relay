import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dhlrelay.xxxxx',
  appName: 'dhl-relay',
  webDir: 'dist',
  server: {
    iosScheme: 'https',
    allowNavigation: [
      '*.sanity.io',
      '*.apicdn.sanity.io',
      'dhl-relay-server.onrender.com',
    ],
  },
};

export default config;
