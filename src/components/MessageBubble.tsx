import { motion } from "framer-motion";

interface MessageBubbleProps {
  text: string;
  timestamp: Date;
  isMe: boolean;
  theme?: {
    userMessageColor?: string;
  };
}

export function MessageBubble({
  text,
  timestamp,
  isMe,
  theme,
}: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', width: '100%', justifyContent: isMe ? 'flex-start' : 'flex-end' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, maxWidth: '75%', flexDirection: isMe ? 'row' : 'row' }}>
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.06 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 6px 18px rgba(2,6,23,0.08)',
            background: isMe ? 'linear-gradient(135deg,#1f6feb,#0b5fff)' : 'linear-gradient(135deg,#cfd8e3,#dfe7ef)'
          }}
        >
          {isMe ? 'V' : 'C'}
        </motion.div>

        {/* Bubble */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            position: 'relative',
            padding: '12px 14px',
            borderRadius: 16,
            minWidth: 50,
            background: isMe ? (theme?.userMessageColor || '#1f6feb') : '#ffffff',
            color: isMe ? '#ffffff' : '#0f172a',
            boxShadow: '0 6px 18px rgba(2,6,23,0.06)',
            border: isMe ? 'none' : '1px solid #eef2f6'
          }}
        >
          <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.45, fontWeight: 600 }}>
            {text}
          </p>

          <span style={{ display: 'block', marginTop: 8, fontSize: 11, opacity: 0.75, fontWeight: 600, textAlign: isMe ? 'left' : 'right' }}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
