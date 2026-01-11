import { useEffect, useState } from "react";
import { Database, ref, onValue } from "firebase/database";

export function useUnreadCount(
  db: Database,
  userId: string,
  conversationId: string
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId || !conversationId) return;

    const refUnread = ref(
      db,
      `next-chat/unread/${userId}/${conversationId}`
    );

    return onValue(refUnread, (snap) => {
      setCount(snap.val() || 0);
    });
  }, [db, userId, conversationId]);

  return count;
}
