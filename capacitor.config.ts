import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.megatrans.app',
  appName: 'MegaTrans',
  webDir: 'dist/mega-trans-front',
  server: {
    cleartext: true,
    // allowNavigation: ['192.168.0.107'],
    allowNavigation: ['104.196.131.87'],
    androidScheme: 'http'

  }
};


export default config;
