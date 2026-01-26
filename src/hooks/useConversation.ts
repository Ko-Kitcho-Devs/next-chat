import { useEffect, useRef, useState } from "react";
import { Database } from "firebase/database";
import { ChatMessage, ChatRole } from "../chat/chat.types";
import { listenConversationMessages, sendMessage } from "../chat/chat.service";

export function useConversation(
  db: Database,
  conversationId: string | null, // Changé en nullable
  userId: string,
  role: ChatRole
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!db || !conversationId) {
      setMessages([]);
      return;
    };
    
    return listenConversationMessages(db, conversationId, setMessages);
  }, [db, conversationId]);

  // Scroll automatique vers le bas
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || !conversationId) return;
    sendMessage(db, conversationId, userId, role, text);
  };

  return { messages, send, bottomRef };
}