import { useState } from "react";
import { Database } from "firebase/database";
import { motion } from "framer-motion";
import { ChatRole, ChatTheme } from "../chat/chat.types";
import { useConversation } from "../hooks/useConversation";
import { useTyping } from "../hooks/useTyping";

type Props = {
  db: Database;
  conversationId: string;
  userId: string;
  role: ChatRole;
  theme?: ChatTheme;
  className?: string;
};

export function ChatWidget({
  db,
  conversationId,
  userId,
  role,
  theme,
  className = "",
}: Props) {
  const [input, setInput] = useState("");

  const { messages, send, bottomRef } = useConversation(
    db,
    conversationId,
    userId,
    role
  );

  const { typingUsers, startTyping, stopTyping } = useTyping(
    db,
    conversationId,
    userId
  );

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
    stopTyping();
  };

  const headerColor = theme?.headerColor || "#0B5FFF";
  const meColor = theme?.userMessageColor || "#1F6FEB";
  const otherColor = theme?.supportMessageColor || "#8BC34A";

  if (!conversationId) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          borderRadius: 16,
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          Sélectionnez une conversation
        </p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
        borderWidth: 1,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "16px 24px",
          color: "#ffffff",
          fontWeight: 600,
          backgroundColor: headerColor,
          flexShrink: 0,
        }}
      >
        Support Chat
      </div>

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg) => {
          const isMe =
            String(msg.authorId).trim().toLowerCase() ===
            String(userId).trim().toLowerCase();

          const rowStyle: React.CSSProperties = {
            display: "flex",
            justifyContent: isMe ? "flex-start" : "flex-end",
            width: "100%",
            paddingLeft: 8,
            paddingRight: 8,
          };

          const bubbleStyle: React.CSSProperties = {
            maxWidth: "min(520px, 80%)",
            padding: "12px 16px",
            borderRadius: 16,
            backgroundColor: isMe ? meColor : otherColor,
            color: isMe ? "#ffffff" : "#04251a",
            boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
            wordBreak: "break-word",
            fontSize: "clamp(13px, 2.2vw, 15px)",
            lineHeight: 1.35,
            margin: "6px 0",
          };

          if (isMe) {
            bubbleStyle.borderTopLeftRadius = 6;
            bubbleStyle.borderTopRightRadius = 18;
          } else {
            bubbleStyle.borderTopLeftRadius = 18;
            bubbleStyle.borderTopRightRadius = 6;
          }

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={rowStyle}
            >
              <div style={bubbleStyle}>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                  {msg.text}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    opacity: 0.75,
                    textAlign: isMe ? "left" : "right",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}

        {typingUsers.length > 0 && (
          <div
            style={{
              background: "#f1f5f9",
              padding: "8px 12px",
              borderRadius: 14,
              color: "#6b7280",
              maxWidth: 160,
            }}
          >
            écrit...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid #e6edf3",
          padding: 12,
          background: "#ffffff",
          display: "flex",
          gap: 12,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onFocus={startTyping}
          onBlur={stopTyping}
          placeholder="Écrire un message..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 9999,
            border: "1px solid #e6edf3",
            fontSize: 14,
            outline: "none",
          }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 9999,
            color: "#ffffff",
            backgroundColor: headerColor,
            border: "none",
            cursor: input.trim() ? "pointer" : "not-allowed",
            opacity: input.trim() ? 1 : 0.45,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
