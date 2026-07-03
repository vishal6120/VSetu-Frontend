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

    // 2. Google ke server par phone ko register karna
    await PushNotifications.register();

    // 3. Jaise hi register ho jaye, apne "username" wale topic se jud jana
    PushNotifications.addListener('registration', (token) => {
      console.log('Firebase Token mil gaya:', token.value);
      
      FCM.subscribeTo({ topic: username })
        .then(() => console.log(`Super! Hum topic '${username}' se jud gaye hain.`))
        .catch((err) => console.log('Topic subscribe error:', err));
    });

    // 4. Jab app khuli ho aur notification aaye
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Naya Kaam Aaya!', notification);
      // Yahan aap chaho toh alert() ya toast dikha sakte ho
    });

    // 5. Jab user notification par click kare
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Notification par click hua:', notification);
    });

  } catch (error) {
    console.error('Notification Engine start hone mein error:', error);
  }
};