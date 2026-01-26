import { motion } from "framer-motion";

interface TypingIndicatorProps {
  visible?: boolean;
}

export function TypingIndicator({ visible = true }: TypingIndicatorProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="px-6 pb-2 text-[11px] text-slate-500 font-medium flex items-center gap-2"
    >
      <span>L'utilisateur écrit</span>
      <div className="flex items-center gap-1">
        <motion.span
          animate={{ translateY: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="w-1.5 h-1.5 bg-slate-500 rounded-full"
        />
        <motion.span
          animate={{ translateY: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
          className="w-1.5 h-1.5 bg-slate-500 rounded-full"
        />
        <motion.span
          animate={{ translateY: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          className="w-1.5 h-1.5 bg-slate-500 rounded-full"
        />
      </div>
    </motion.div>
  );
}
