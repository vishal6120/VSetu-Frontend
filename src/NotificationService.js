import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';

export const startNotificationEngine = async (username) => {
  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      alert('Aapne notification permission nahi di!');
      return;
    }

    // CRASH PREVENTION: Permission milne ke baad 2 second ka wait karein
    // taaki Android system relax aur set ho jaye, uske baad register karein.
    setTimeout(async () => {
        try {
            await PushNotifications.register();
        } catch(regErr) {
            alert("Register fail hua: " + JSON.stringify(regErr));
        }
    }, 2000);

    // Listeners
    PushNotifications.addListener('registration', (token) => {
        // Yeh alert aane ka matlab hai Firebase se app jud chuka hai (SUCCESS!)
        alert('Jaadu chal gaya! Token mil gaya: ' + token.value.substring(0, 10) + '...');
    });

    PushNotifications.addListener('registrationError', (error) => {
        alert('Registration Error: ' + JSON.stringify(error));
    });

  } catch (error) {
    alert("Permission Error: " + JSON.stringify(error));
  }
};