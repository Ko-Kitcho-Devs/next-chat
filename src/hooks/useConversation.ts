import { useEffect, useRef, useState } from "react";
import { Database } from "firebase/database";
import { ChatMessage, ChatRole } from "../chat/chat.types";
import {
  listenConversationMessages,
  sendMessage,
} from "../chat/chat.service";

export function useConversation(
  db: Database,
  conversationId: string,
  userId: string,
  role: ChatRole
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    return listenConversationMessages(db, conversationId, setMessages);
  }, [db, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage(db, conversationId, userId, role, text);
  };

  return {
    messages,
    send,
    bottomRef,
    typingUsers,
  };
}
