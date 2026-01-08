
export type ChatRole = "client" | "support";

export type Conversation = {
  id: string;
  members: Record<string, true>;
  lastMessage: string;
  updatedAt: number;
  status: "open" | "closed";
};

export type ChatMessage = {
  id: string;
  authorId: string;
  authorRole: ChatRole;
  text: string;
  createdAt: number;
};

// Thème personnalisable du chat
export type ChatTheme = {
  primaryColor?: string;        // Couleur principale (boutons, messages user)
  backgroundColor?: string;     // Fond du widget
  headerColor?: string;         // Couleur du header
  userMessageColor?: string;    // Message utilisateur
  supportMessageColor?: string; // Message support
};
