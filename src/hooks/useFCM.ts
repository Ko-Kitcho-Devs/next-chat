import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { FirebaseApp } from "firebase/app";

type UseFCMParams = {
  app: FirebaseApp;
  vapidKey: string;
  onForegroundMessage?: (payload: any) => void;
};

export function useFCM({
  app,
  vapidKey,
  onForegroundMessage,
}: UseFCMParams) {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (!app || typeof window === "undefined") return;

    const messaging = getMessaging(app);

    Notification.requestPermission().then((perm) => {
      setPermission(perm);
      if (perm !== "granted") return;

      getToken(messaging, { vapidKey })
        .then((t) => {
          if (t) setToken(t);
        })
        .catch(console.error);
    });

    const unsubscribe = onMessage(messaging, (payload) => {
      onForegroundMessage?.(payload);
    });

    return () => unsubscribe();
  }, [app, vapidKey]);

  return { token, permission };
}
