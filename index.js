/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import App from './App';
import { name as appName } from './app.json';
import { showLocalNotification } from './src/utils/helpers';

// Function to check and show the local notification only if it's not a duplicate
async function onMessageReceived(message) {
  await showLocalNotification(message);
}

// Set up message listener for foreground
messaging().onMessage(onMessageReceived);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const { notification } = detail;
    if (notification?.data) {
      await AsyncStorage.setItem(
        'lastNotification',
        JSON.stringify({ type: notification.data.type, id: notification.data.id }),
      );
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
