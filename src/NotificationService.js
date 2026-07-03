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
    PushNotifications.addListener('registration', async (token) => {
    console.log('Push registration success, token: ' + token.value);
    
    // Yahan apna backend API call lagaiye
    await fetch('https://vsetu-backend.onrender.com/api/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, fcm_token: token.value })
    });
});

// 2. Error aane par bas console mein dekho
PushNotifications.addListener('registrationError', (error) => {
    console.error('Registration Error: ', error);
});

// 3. Jab notification mile toh kya karna hai
PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ', notification);
    // Yahan aap local notification trigger kar sakte hain
});

  } catch (error) {
    alert("Permission Error: " + JSON.stringify(error));
  }
};