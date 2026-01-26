import { motion } from "framer-motion";

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type Props = {
  count: number;
  show?: boolean;
  position?: Position;
  color?: string;
  size?: number;
  className?: string;
};

const positions: Record<Position, React.CSSProperties> = {
  "top-left": { top: 8, left: 8 },
  "top-right": { top: 8, right: 8 },
  "bottom-left": { bottom: 8, left: 8 },
  "bottom-right": { bottom: 8, right: 8 },
};

export function MessageBadge({
  count,
  show = true,
  position = "top-right",
  color = "#ef4444",
  size = 20,
  className = "",
}: Props) {
  if (!show || count <= 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={{ scale: 1.1 }}
      className={className}
      style={{
        position: "absolute",
        minWidth: size,
        height: size,
        padding: "0 6px",
        backgroundColor: color,
        color: "#fff",
        borderRadius: 999,
        fontSize: size * 0.6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        boxShadow: `0 4px 12px ${color}40`,
        border: "2px solid white",
        ...positions[position],
      }}
    >
      <motion.span
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        {count}
      </motion.span>
    </motion.div>
  );
}
