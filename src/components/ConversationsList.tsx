import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { Conversation, ChatRole } from "../chat/chat.types";
import { listenUserConversations } from "../chat/chat.service";

type ConversationsListProps = {
  db: Database;
  userId: string;
  role: ChatRole;
  onSelectConversation: (id: string) => void;
  unreadMap?: Record<string, number>;
  className?: string;
};

export function ConversationsList({
  db,
  userId,
  role,
  onSelectConversation,
  unreadMap = {}, // valeur par défaut vide
  className = "",
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!userId) return;
    return listenUserConversations(db, userId, setConversations);
  }, [db, userId]);

  return (
    <div
      className={`w-full sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg p-4 space-y-3 ${className}`}
    >
      <h3 className="text-lg font-semibold mb-2">
        {role === ChatRole.SUPPORT ? "Discussions clients" : "Mes discussions"}
      </h3>

      {conversations.length === 0 && (
        <p className="text-sm text-gray-500">Aucune discussion</p>
      )}

      <div className="space-y-2">
        {conversations.map((conv) => {
          const unread = unreadMap[conv.id] ?? 0;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              {/* Avatar + nom */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
                  {conv.members ? Object.keys(conv.members)[0][0].toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <div className="font-medium text-sm truncate">
                    {conv.lastMessage || "Nouvelle discussion"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Statut : {conv.status}
                  </div>
                </div>
              </div>

              {/* Badge messages non lus */}
              {unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unread}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
