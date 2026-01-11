import { useEffect, useState } from "react";
import { Database, ref, set, onValue, remove } from "firebase/database";

export function useTyping(
  db: Database,
  conversationId: string,
  userId: string
) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    const typingRef = ref(db, `next-chat/typing/${conversationId}`);

    const unsub = onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      setTypingUsers(Object.keys(data).filter((id) => id !== userId));
    });

    return () => unsub();
  }, [db, conversationId, userId]);

  const startTyping = () =>
    set(ref(db, `next-chat/typing/${conversationId}/${userId}`), true);

  const stopTyping = () =>
    remove(ref(db, `next-chat/typing/${conversationId}/${userId}`));

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
}
