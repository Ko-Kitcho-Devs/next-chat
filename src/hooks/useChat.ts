import { useState, useEffect, useCallback } from "react";
import { Database } from "firebase/database";
import { ChatRole, ChatMessage } from "../chat/chat.types";
import { sendMessage } from "../chat/chat.service";
import { useConversations } from "./useConversations";

type UseChatParams = {
  db: Database;
  userId: string | null;
  role: ChatRole | null;
};

export function useChat({ db, userId, role }: UseChatParams) {
  /**
   * Conversation sélectionnée
   */
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  /**
   * Conversations selon le rôle (client/support)
   */
  const { conversations, loading: loadingConversations } = useConversations(
    db,
    userId,
    role
  );

  /**
   * Messages de la conversation sélectionnée
   */
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /**
   * Messages non lus par conversation
   */
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  /**
   * Met à jour le compteur de messages non lus
   */
  useEffect(() => {
    if (!selectedConversationId || !userId) return;

    const unread = messages.filter((msg) => msg.authorId !== userId).length;

    setUnreadMap((prev) => ({
      ...prev,
      [selectedConversationId]: unread,
    }));
  }, [messages, selectedConversationId, userId]);

  /**
   * Envoi de message
   */
  const send = useCallback(
    async (text: string) => {
      if (!db || !userId || !role || !selectedConversationId) return;

      await sendMessage(db, selectedConversationId, userId, role, text);
    },
    [db, userId, role, selectedConversationId]
  );

  return {
    conversations,
    loadingConversations,

    selectedConversationId,
    selectConversation: setSelectedConversationId,

    messages,
    setMessages, // pour injecter les messages depuis ChatWidget

    sendMessage: send,
    unreadMap,
  };
}
