import { CapacitorConfig } from '@capacitor/cli';
import path from 'node:path';
import { fileURLToPath } from 'url';

// Insert utils
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: CapacitorConfig = {
  appId: 'Pixxels',
  appName: 'Pixxels',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
  },

  plugins: {
    LocalNotifications: {
      smallIcon: 'icon',
      iconColor: '#48ffda',
      sound: path.join(__dirname, './public/sound/notification.ogg'),
    },
  },
  android: {
    buildOptions: {
      keystorePath: path.join(__dirname, './android/tinykey.jks'),
      keystoreAlias: 'JasminDreasond',
    },
  },
};

export default config;
