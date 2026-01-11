export enum ChatRole {
  CLIENT = "client",
  SUPPORT = "support",
}

export type ChatUser = {
  uid: string;
  name?: string;
  avatar?: string;
  role: ChatRole;
  online?: boolean;
};

export type Conversation = {
  id: string;
  members: Record<string, boolean>;
  supportId?: string;
  lastMessage?: string;
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

export type ChatTheme = {
  primaryColor: string;
  backgroundColor: string;
  headerColor: string;
  userMessageColor: string;
  supportMessageColor: string;
};
