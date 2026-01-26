import { useCallback, useEffect, useRef, useState } from "react";
import { Database } from "firebase/database";
import { ChatWidget } from "./ChatWidget";
import { ChatRole } from "../chat/chat.types";
import { startConversation } from "../chat/chat.service";

type Props = {
  db: Database;
  userId: string;
  supportId?: string;
  conversationId?: string;
  initialSize?: { width: number; height: number };
  initialPos?: { right: number; bottom: number };
  onClose?: () => void;
};

export function FloatingChatWindow({
  db,
  userId,
  supportId,
  conversationId: convProp,
  initialSize = { width: 420, height: 520 },
  initialPos = { right: 24, bottom: 96 },
  onClose,
}: Props) {
  const [open, setOpen] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>(convProp);
  const [size, setSize] = useState(initialSize);
  const [pos, setPos] = useState(initialPos);

  const dragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number; right: number; bottom: number } | null>(null);

  useEffect(() => setConversationId(convProp), [convProp]);

  const onStartConversation = useCallback(async () => {
    if (!supportId) return;
    try {
      const id = await startConversation(db, userId, supportId);
      setConversationId(id);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  }, [db, userId, supportId]);

  /** DRAG — zone invisible */
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      right: pos.right,
      bottom: pos.bottom,
    };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setPos({
      right: Math.max(8, dragStart.current.right - dx),
      bottom: Math.max(8, dragStart.current.bottom - dy),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    dragStart.current = null;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };

  /** RESIZE */
  const onResize = (e: React.PointerEvent) => {
    const rect = (e.target as HTMLElement).closest(".floating-chat-window") as HTMLElement | null;
    if (!rect) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = rect.offsetWidth;
    const startH = rect.offsetHeight;

    const onMove = (ev: PointerEvent) => {
      setSize({
        width: Math.max(320, startW + (ev.clientX - startX)),
        height: Math.max(360, startH + (ev.clientY - startY)),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  if (!open) return null;

  return (
    <div
      className="floating-chat-window"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "fixed",
        right: pos.right,
        bottom: pos.bottom,
        width: size.width,
        height: size.height,
        zIndex: 9998,
        background: "#ffffff",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(2,6,23,0.14)",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={() => {
          setOpen(false);
          onClose?.();
        }}
        aria-label="Fermer"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10000,
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          border: "none",
          width: 28,
          height: 28,
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* CONTENT */}
      {conversationId ? (
        <ChatWidget
          db={db}
          conversationId={conversationId}
          userId={userId}
          role={ChatRole.CLIENT}
          className="h-full"
        />
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "#64748b",
          }}
        >
          <div>Commencer une conversation avec le support</div>

          {supportId ? (
            <button
              onClick={onStartConversation}
              style={{
                background: "#0B5FFF",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Démarrer
            </button>
          ) : (
            <div style={{ color: "#9ca3af" }}>Aucun support configuré</div>
          )}
        </div>
      )}

      {/* RESIZE HANDLE */}
      <div
        onPointerDown={onResize}
        style={{
          position: "absolute",
          right: 4,
          bottom: 4,
          width: 14,
          height: 14,
          cursor: "nwse-resize",
          zIndex: 10001,
        }}
      />
    </div>
  );
}

export default FloatingChatWindow;
