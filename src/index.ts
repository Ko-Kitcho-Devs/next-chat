// Firebase
export { initFirebase } from "./firebase/firebase";
export type { FirebaseChatConfig } from "./firebase/firebase";

// Services
export { startConversation } from "./chat/chat.service";

// Types
export type {
  ChatMessage,
  Conversation,
  ChatRole,
  ChatTheme
} from "./chat/chat.types";

// UI
export { ChatWidget } from "./components/ChatWidget";
export { ConversationsList } from "./components/ConversationsList";
