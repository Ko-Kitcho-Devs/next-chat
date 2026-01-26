import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { Conversation, ChatRole } from "../chat/chat.types";
import { listenUserConversations } from "../chat/chat.service";

export function useConversations(
  db: Database,
  userId: string | null,
  role: ChatRole | null
) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !userId) return;

    // Même pour le support, on utilise listenUserConversations 
    // car le support est aussi un utilisateur avec son propre index 
    // dans next-chat/userConversations/{supportId}
    const unsub = listenUserConversations(db, userId, (data) => {
      setConversations(data);
      setLoading(false);
    });

    return () => unsub?.();
  }, [db, userId, role]);

  return { conversations, loading };
}