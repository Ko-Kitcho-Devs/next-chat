import { useEffect, useState } from "react";
import { Database } from "firebase/database";
import { ChatMessage, ChatRole, ChatTheme } from "../chat/chat.types";
import {
  listenConversationMessages,
  sendMessage,
} from "../chat/chat.service";

/**
 * Props du widget de chat
 */
type ChatWidgetProps = {
  db: Database;
  conversationId: string;
  userId: string;
  role: ChatRole;

  theme?: ChatTheme;
  position?: "bottom-right" | "bottom-left";

  styles?: {
    container?: React.CSSProperties;
    header?: React.CSSProperties;
    messages?: React.CSSProperties;
    message?: React.CSSProperties;
    inputContainer?: React.CSSProperties;
    input?: React.CSSProperties;
    button?: React.CSSProperties;
  };
};

export function ChatWidget({
  db,
  conversationId,
  userId,
  role,
  theme,
  position = "bottom-right",
  styles: customStyles, // récupération correcte des styles
}: ChatWidgetProps) {
  /**
   * Fusion du thème par défaut avec le thème fourni
   */
  const mergedTheme: ChatTheme = {
    ...defaultTheme,
    ...theme,
  };

  /**
   * Fusion des styles par défaut + styles custom
   */
  const mergedStyles = {
    container: {
      ...baseStyles.container,
      ...customStyles?.container,
      background: mergedTheme.backgroundColor,
    },
    header: {
      ...baseStyles.header,
      ...customStyles?.header,
      background: mergedTheme.headerColor,
    },
    messages: {
      ...baseStyles.messages,
      ...customStyles?.messages,
    },
    message: {
      ...baseStyles.message,
      ...customStyles?.message,
    },
    inputContainer: {
      ...baseStyles.inputContainer,
      ...customStyles?.inputContainer,
    },
    input: {
      ...baseStyles.input,
      ...customStyles?.input,
    },
    button: {
      ...baseStyles.button,
      ...customStyles?.button,
      background: mergedTheme.primaryColor,
    },
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  /**
   * Écoute en temps réel des messages
   */
  useEffect(() => {
    if (!conversationId) return;
    return listenConversationMessages(db, conversationId, setMessages);
  }, [db, conversationId]);

  /**
   * Envoi d'un message
   */
  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(db, conversationId, userId, role, input);
    setInput("");
  };

  /**
   * Sécurité : ne rien afficher si la conversation n'est pas prête
   */
  if (!conversationId) return null;

  return (
    <div style={{
    position: "fixed" as React.CSSProperties["position"],
    bottom: 20,
    right: position === "bottom-right" ? 20 : undefined,
    left: position === "bottom-left" ? 20 : undefined,
    ...mergedStyles.container,
  }}>
      <div style={mergedStyles.header}>Discussion</div>

      <div style={mergedStyles.messages}>
        {messages.map((msg) => {
          const isMine = msg.authorId === userId;

          return (
            <div
              key={msg.id}
              style={{
                ...mergedStyles.message,
                alignSelf: isMine ? "flex-end" : "flex-start",
                background: isMine
                  ? mergedTheme.userMessageColor
                  : mergedTheme.supportMessageColor,
                color: isMine ? "#fff" : "#000",
              }}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      <div style={mergedStyles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
          style={mergedStyles.input}
        />
        <button onClick={handleSend} style={mergedStyles.button}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

/**
 * Thème par défaut
 */
const defaultTheme: ChatTheme = {
  primaryColor: "#2563eb",
  backgroundColor: "#ffffff",
  headerColor: "#111827",
  userMessageColor: "#2563eb",
  supportMessageColor: "#e5e7eb",
};

/**
 * Styles par défaut
 */
const baseStyles: Record<string, React.CSSProperties> = {
  container: {
    width: 320,
    height: 420,
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    fontFamily: "sans-serif",
  },
  header: {
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  messages: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
  },
  message: {
    maxWidth: "75%",
    padding: "8px 12px",
    borderRadius: 12,
    fontSize: 14,
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #e5e7eb",
  },
  input: {
    flex: 1,
    padding: 10,
    border: "none",
    outline: "none",
  },
  button: {
    padding: "0 16px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
};
