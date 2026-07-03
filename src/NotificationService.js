import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';

export const startNotificationEngine = async (username) => {
  try {
    // 1. Permission maangna (Android 13+ ke liye bahut zaroori)
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.log('User ne notification ki permission nahi di!');
      return;
    }

    // 2. Device ko OS ke sath register karna
    await PushNotifications.register();

    // 3. Registration successful hone par
    PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
    });

    // 4. Registration mein error aane par screen par dikhana
    PushNotifications.addListener('registrationError', (error) => {
        alert('Registration Error: ' + JSON.stringify(error));
    });

    // 5. Notification receive hone par
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received: ', notification);
    });

  } catch (error) {
    // YEH HAI HAMARA SAFETY NET (Crash hone se rokega!)
    alert("System Error: " + JSON.stringify(error));
  }
};