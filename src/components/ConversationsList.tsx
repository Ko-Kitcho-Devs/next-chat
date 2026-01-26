import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { motion } from "framer-motion";
import { Conversation, ChatRole } from "../chat/chat.types";
import { listenUserConversations } from "../chat/chat.service";

type Props = {
  db: Database;
  userId: string;
  role: ChatRole;
  onSelectConversation: (id: string) => void;
  activeId?: string;
  className?: string;
};

export function ConversationsList({
  db,
  userId,
  role,
  onSelectConversation,
  activeId,
  className = "",
}: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!userId) return;
    return listenUserConversations(db, userId, setConversations);
  }, [db, userId]);

  return (
    <div style={{ background: '#ffffff', borderRadius: 16, boxShadow: '0 10px 30px rgba(2,6,23,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }} className={className}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)' }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
          {role === ChatRole.SUPPORT ? '💬 Conversations' : '💭 Mes discussions'}
        </h3>
      </div>

      <div style={{ maxHeight: 600, overflowY: 'auto' }}>
        {conversations.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.35 }}>📭</div>
            <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Aucune conversation</p>
          </div>
        )}

        {conversations.map((conv, idx) => {
          const active = conv.id === activeId;

          const btnStyle: React.CSSProperties = {
            width: '100%',
            textAlign: 'left',
            padding: '12px 14px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            background: active ? '#f0f8ff' : 'transparent',
            borderLeft: active ? '4px solid #0b5fff' : '4px solid transparent',
            cursor: 'pointer',
            transition: 'all 160ms ease',
          };

          const avatarStyle: React.CSSProperties = {
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 11,
            color: '#fff',
            flexShrink: 0,
            background: active ? 'linear-gradient(135deg,#0b5fff,#1f6feb)' : 'linear-gradient(135deg,#dfe7ef,#cfd8e3)'
          };

          const titleStyle: React.CSSProperties = {
            fontSize: 14,
            fontWeight: 700,
            color: active ? '#0b5fff' : '#0f172a',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          };

          const timeStyle: React.CSSProperties = {
            fontSize: 11,
            color: '#94a3b8',
            flexShrink: 0,
          };

          const previewStyle: React.CSSProperties = {
            marginTop: 6,
            fontSize: 12,
            color: active ? 'rgba(11,95,255,0.7)' : '#64748b',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          };

          return (
            <motion.button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ scale: 0.997 }}
              style={btnStyle}
            >
              <div style={avatarStyle}>{conv.id.slice(-2).toUpperCase()}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={titleStyle}>Conversation</span>
                  <span style={timeStyle}>{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <p style={previewStyle}>{conv.lastMessage || 'Nouvelle conversation'}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
