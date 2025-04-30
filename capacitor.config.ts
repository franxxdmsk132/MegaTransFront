import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.megatrans.app',
  appName: 'MegaTrans',
  webDir: 'dist/mega-trans-front',
  server: {
    cleartext: true,
    allowNavigation: ['e494-45-236-151-3.ngrok-free.app'],
    androidScheme: 'http'
  },
  plugins:{
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }

};
export default config;
