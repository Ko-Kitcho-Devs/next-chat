import { useState } from "react";
import { Database } from "firebase/database";
import { ChatRole, ChatTheme } from "../chat/chat.types";
import { useConversation } from "../hooks/useConversation";
import { useTyping } from "../hooks/useTyping";
import { useNotifications } from "../hooks/useNotifications";

// Animation optionnelle (ne force pas framer-motion dans le package)
let MotionDiv: any = "div";
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MotionDiv = require("framer-motion").motion.div;
} catch {}

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

  // Messages + scroll
  const { messages, send, bottomRef } = useConversation(
    db,
    conversationId,
    userId,
    role
  );

  // Notifications locales (badge / title / son)
  // Push FCM géré côté app cliente, pas ici
  useNotifications(messages, userId);

  // Typing indicator
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

  if (!conversationId) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col h-[520px] w-full sm:w-96 bg-white rounded-xl shadow-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div
        className="px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: theme?.headerColor || "#111827" }}
      >
        Support
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {messages.map((msg) => {
          const mine = msg.authorId === userId;

          return (
            <div
              key={msg.id}
              className={`max-w-[75%] px-3 py-2 rounded-xl text-sm break-words
                ${mine ? "ml-auto text-white" : "mr-auto text-gray-900"}`}
              style={{
                backgroundColor: mine
                  ? theme?.userMessageColor || "#2563eb"
                  : theme?.supportMessageColor || "#e5e7eb",
              }}
            >
              {msg.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-gray-500">
          {typingUsers.join(", ")} est en train d’écrire…
        </div>
      )}

      {/* Input */}
      <div className="flex border-t border-gray-200">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            startTyping();
          }}
          onBlur={stopTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-3 py-2 text-sm outline-none"
          placeholder="Écris ton message…"
        />
        <button
          onClick={handleSend}
          className="px-4 text-white"
          style={{ backgroundColor: theme?.primaryColor || "#2563eb" }}
        >
          Envoyer
        </button>
      </div>
    </MotionDiv>
  );
}
