import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.megatrans.app',
  appName: 'MegaTrans',
  webDir: 'dist/mega-trans-front',
  server: {
    cleartext: true
  }
};

export default config;
