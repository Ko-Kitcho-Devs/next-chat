import { useEffect, useRef, useState } from "react";
import { Database } from "firebase/database";
import { startConversation } from "../chat/chat.service";

type Position = { right: number; bottom: number };

type Props = {
  db: Database;
  userId: string;
  supportId: string;
  size?: number;
  initial?: Position;
  color?: string;
  persistKey?: string;
  className?: string;
  onConversationStarted?: (conversationId: string) => void;
};

export function FloatingChatButton({
  db,
  userId,
  supportId,
  size = 64,
  initial = { right: 24, bottom: 24 },
  color = "#0B5FFF",
  persistKey = "next_chat_floating_button_pos",
  className = "",
  onConversationStarted,
}: Props) {
  const [pos, setPos] = useState<Position>(initial);
  const elRef = useRef<HTMLButtonElement | null>(null);
  const draggingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number; right: number; bottom: number } | null>(null);

  useEffect(() => {
    // restore persisted position
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) setPos(JSON.parse(raw));
    } catch (e) {}
  }, [persistKey]);

  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(pos));
  }, [pos, persistKey]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = elRef.current;
    if (!el) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY, right: pos.right, bottom: pos.bottom };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const newRight = Math.max(8, startRef.current.right - dx);
    const newBottom = Math.max(8, startRef.current.bottom - dy);
    setPos({ right: newRight, bottom: newBottom });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    startRef.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const start = async () => {
    try {
      const convId = await startConversation(db, userId, supportId);
      onConversationStarted && onConversationStarted(convId);
    } catch (err) {
      console.error("Erreur startConversation:", err);
    }
  };

  return (
    <button
      ref={elRef}
      className={className}
      aria-label="Ouvrir le chat de support"
      onClick={start}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "fixed",
        right: pos.right,
        bottom: pos.bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        border: "none",
        boxShadow: "0 8px 30px rgba(2,6,23,0.12)",
        background: color,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 9999,
      }}
    >
      {/* simple message icon */}
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default FloatingChatButton;
