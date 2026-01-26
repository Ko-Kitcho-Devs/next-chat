// ================================
// Firebase (initialisation côté app)
// ================================
export * from "./firebase/firebase.types";
export * from "./firebase/firebase.env";
export * from "./firebase/firebase.client";
export { generateFCMSw } from "./firebase/serviceWorkerTemplate";
export {
  generateSupportKey_Export,
  indexSupportKey,
  getUidByKey,
  registerSupport,
} from "./firebase/supports";

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
export { getSupportIdFromKey, startConversationWithSupportKey } from "./chat/chat.service";

// ================================
// Types
// ================================
export type {
  ChatMessage,
  Conversation,
  ChatRole,
  ChatTheme,
  ChatUser,
} from "./chat/chat.types";

// ================================
// UI Components
// ================================
export { ChatWidget } from "./components/ChatWidget";
export { ConversationsList } from "./components/ConversationsList";
export { ChatDashboard} from "./components/chatDashboard";
export { MessageBadge } from "./components/MessageBadge";
export { MessageBubble } from "./components/MessageBubble";
export { TypingIndicator } from "./components/TypingIndicator";
export { FloatingChatButton } from "./components/FloatingChatButton";
export { FloatingChatWindow } from "./components/FloatingChatWindow";
export { OnlinePresenceIndicator } from "./components/OnlinePresenceIndicator";
export { ConversationMemberIndicator } from "./components/ConversationMemberIndicator";
export { SupportRegister } from "./components/SupportRegister";

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
