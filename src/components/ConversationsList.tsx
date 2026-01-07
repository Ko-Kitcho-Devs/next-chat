import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { Conversation, ChatRole } from "../chat/chat.types";
import { listenUserConversations, listenAllConversations } from "../chat/chat.service";

type ConversationsListProps = {
  db: Database;
  userId: string;
  role: ChatRole; // rôle ajouté
  onSelectConversation: (conversationId: string) => void;

  styles?: {
    container?: React.CSSProperties;
    item?: React.CSSProperties;
    messageText?: React.CSSProperties;
    statusText?: React.CSSProperties;
    title?: React.CSSProperties;
  };
};

export function ConversationsList({
  db,
  userId,
  role,
  onSelectConversation,
  styles,
}: ConversationsListProps) {
  // Fusion des styles par défaut + styles personnalisés
  const mergedStyles = {
    container: { padding: 12, ...styles?.container },
    item: { padding: 10, borderBottom: "1px solid #e5e7eb", cursor: "pointer", ...styles?.item },
    messageText: { fontWeight: "bold", ...styles?.messageText },
    statusText: { color: "#6b7280", fontSize: 12, ...styles?.statusText },
    title: { fontSize: 18, marginBottom: 12, fontWeight: "bold", ...styles?.title },
  };

  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Écoute des conversations selon le rôle
  useEffect(() => {
    if (!userId) return;

    if (role === ChatRole.CLIENT) {
      // CLIENT → uniquement ses conversations
      return listenUserConversations(db, userId, setConversations);
    }

    if (role === ChatRole.SUPPORT) {
      // SUPPORT → toutes les conversations
      return listenAllConversations(db, setConversations);
    }
  }, [db, userId, role]);

  return (
    <div style={mergedStyles.container}>
      <div style={mergedStyles.title}>
        {role === ChatRole.SUPPORT ? "Discussions clients" : "Mes discussions"}
      </div>

      {conversations.length === 0 && (
        <p style={{ color: "#6b7280" }}>Aucune discussion</p>
      )}

      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelectConversation(conv.id)}
          style={mergedStyles.item}
        >
          <div style={mergedStyles.messageText}>
            {conv.lastMessage || "Nouvelle discussion"}
          </div>
          <div style={mergedStyles.statusText}>
            Statut : {conv.status}
          </div>
        </div>
      ))}
    </div>
  );
}
