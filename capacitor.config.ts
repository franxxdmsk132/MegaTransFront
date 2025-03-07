import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.megatrans.app',
  appName: 'MegaTrans',
  webDir: 'dist/mega-trans-front',
  server: {
    cleartext: true,
    allowNavigation: ['192.168.0.103'],
    //allowNavigation: ['104.196.61.204'],
    androidScheme: 'http'
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
