import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { Conversation, ChatRole } from "../chat/chat.types";
import {
  listenUserConversations,
  listenAllConversations,
} from "../chat/chat.service";

export function useConversations(
  db: Database,
  userId: string | null,
  role: ChatRole | null
) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !userId || !role) return;

    const unsub =
      role === ChatRole.SUPPORT
        ? listenAllConversations(db, setConversations)
        : listenUserConversations(db, userId, setConversations);

    setLoading(false);
    return () => unsub?.();
  }, [db, userId, role]);

  return { conversations, loading };
}
