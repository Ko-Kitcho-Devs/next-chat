import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { ChatMessage } from "../chat/chat.types";
import { listenConversationMessages } from "../chat/chat.service";

export function useGlobalUnreadCount(
  db: Database,
  conversationIds: string[],
  userId: string
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!conversationIds.length) return;

    const unsubs = conversationIds.map((id) =>
      listenConversationMessages(db, id, (messages: ChatMessage[]) => {
        const unread = messages.filter(
          (m) => m.authorId !== userId
        ).length;

        setCount((prev) => prev + unread);
      })
    );

    return () => {
      unsubs.forEach((u) => u?.());
    };
  }, [db, conversationIds, userId]);

  return count;
}
