// src/components/ChatDashboard.tsx
import { useState } from "react";
import { Database } from "firebase/database";
import { motion } from "framer-motion";
import { ChatRole, ChatTheme } from "../chat/chat.types";
import { ConversationsList } from "./ConversationsList";
import { ChatWidget } from "./ChatWidget";

type Props = {
  db: Database;
  userId: string;
  role: ChatRole;
  theme?: ChatTheme;
  className?: string;
};

export function ChatDashboard({ db, userId, role, theme, className = "" }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 700,
    background: 'linear-gradient(135deg,#f8fafc 0%, #ffffff 100%)',
    borderRadius: 20,
    boxShadow: '0 18px 50px rgba(2,6,23,0.06)',
    overflow: 'hidden',
    border: '1px solid #eef2f6',
  };

  const sidebarStyle: React.CSSProperties = {
    width: 320,
    minWidth: 260,
    borderRight: '1px solid #eef2f6',
    background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)',
    display: 'flex',
    flexDirection: 'column',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Barre Latérale : Liste des conversations */}
      <div style={sidebarStyle}>
        <div style={{ padding: 20, borderBottom: '1px solid #f1f5f9' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
              {role === ChatRole.SUPPORT ? 'Support' : 'Messages'}
            </h2>
            <p style={{ fontSize: 11, color: '#64748b', marginTop: 6, textTransform: 'uppercase', fontWeight: 700 }}>
              {role === ChatRole.SUPPORT ? 'Center' : 'Client'}
            </p>
          </motion.div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          <ConversationsList 
            db={db} 
            userId={userId} 
            role={role} 
            onSelectConversation={setSelectedId} 
            activeId={selectedId ?? undefined}
            className="shadow-none border-none bg-transparent"
          />
        </div>
      </div>

      {/* Zone principale : Chat */}
      <div style={contentStyle}>
        {selectedId ? (
          <ChatWidget 
            db={db} 
            conversationId={selectedId} 
            userId={userId} 
            role={role} 
            theme={theme}
            className="h-full max-w-none rounded-none shadow-none border-none"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 28 }}
          >
            <motion.div
              style={{ width: 96, height: 96, background: 'linear-gradient(135deg,#e6f0ff,#f8fbff)', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span style={{ fontSize: 34 }}>💬</span>
            </motion.div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Aucune discussion sélectionnée</h3>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420, marginTop: 12, lineHeight: 1.5 }}>
              {role === ChatRole.SUPPORT 
                ? 'Sélectionnez un client dans la liste pour répondre à ses questions'
                : 'Sélectionnez une conversation pour commencer à discuter'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}