import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.megatrans.app',
  appName: 'MegaTrans',
  webDir: 'dist/mega-trans-front',
  server: {
    cleartext: true,
    allowNavigation: ['3f5d-45-236-151-3.ngrok-free.app', 'localhost', 'localhost:8080', '10.0.2.2:8080', '192.168.1.176:8080'],
    //allowNavigation: ['104.196.61.204'],
    androidScheme: 'http'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['alert', 'badge', 'sound'],
    }
  }
  // },
  // plugins: {
  //   Camera: {
  //     permissions: {
  //       ios: 'camera',
  //       android: 'CAMERA'
  //     }
  //   }
  // }

};


export default config;
