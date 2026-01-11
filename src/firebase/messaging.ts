import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { FirebaseApp } from "firebase/app";

/**
 * Initialise Firebase Cloud Messaging
 * @param app - instance Firebase
 * @param vapidKey - VAPID key du projet Firebase (Web Push)
 */
export const initMessaging = (app: FirebaseApp, vapidKey: string) => {
  const messaging = getMessaging(app);

  /**
   * Récupérer le token de l'utilisateur
   */
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;

      const token = await getToken(messaging, { vapidKey });
      return token;
    } catch (err) {
      console.error("Erreur permission FCM:", err);
      return null;
    }
  };

  /**
   * Écoute les messages quand l'utilisateur est actif
   */
  const onMessageListener = (callback: (payload: any) => void) => {
    onMessage(messaging, callback);
  };

  return { messaging, requestPermission, onMessageListener };
};
