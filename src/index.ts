// ================================
// Firebase (initialisation côté app)
// ================================
export { initFirebase } from "./firebase/firebase";
export type { FirebaseChatConfig } from "./firebase/firebase";
export { generateFCMSw } from "./firebase/serviceWorkerTemplate";

// ================================
// Services (logique métier Firebase)
// ================================
export {
  startConversation,
  sendMessage,
  listenConversationMessages,
  listenUserConversations,
  saveUserFCMToken,
} from "./chat/chat.service";

// ================================
// Types
// ================================
export type {
  ChatMessage,
  Conversation,
  ChatRole,
  ChatTheme,
} from "./chat/chat.types";

// ================================
// UI Components
// ================================
export { ChatWidget } from "./components/ChatWidget";
export { ConversationsList } from "./components/ConversationsList";

// UI
export { MessageBadge } from "./components/MessageBadge";

// Utils
export { generateFcmServiceWorker } from "./utils/generateFcmServiceWorker";

// ================================
// Hooks
// ================================
export { useAuthUser } from "./hooks/useAuthUser";
export { useUserRole } from "./hooks/useUserRole";
export { useConversations } from "./hooks/useConversations";
export { useConversation } from "./hooks/useConversation";
export { useUnreadCount } from "./hooks/useUnreadCount";
export { useChat } from "./hooks/useChat";
export { useTyping } from "./hooks/useTyping";
export { useNotifications } from "./hooks/useNotifications";
export * from "./hooks/useGlobalUnreadCount";
export * from "./hooks/useFCM";
