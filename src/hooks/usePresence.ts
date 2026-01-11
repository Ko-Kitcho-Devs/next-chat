import { useEffect } from "react";
import { Database, ref, onDisconnect, set } from "firebase/database";

export function usePresence(db: Database, uid?: string | null) {
  useEffect(() => {
    if (!db || !uid) return;

    const statusRef = ref(db, `next-chat/presence/${uid}`);

    set(statusRef, {
      online: true,
      lastSeen: Date.now(),
    });

    onDisconnect(statusRef).set({
      online: false,
      lastSeen: Date.now(),
    });
  }, [db, uid]);
}
