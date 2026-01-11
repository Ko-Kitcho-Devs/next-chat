import { Database, ref, push, onValue, set, update, get, child } from "firebase/database";
import { ChatMessage, Conversation, ChatRole } from "./chat.types";

/**
 * Crée (ou récupère) une conversation entre 2 utilisateurs
 */
export async function createConversation(
  db: Database,
  clientId: string,
  supportId: string
): Promise<string> {
  const convRef = push(ref(db, "next-chat/conversations"));
  const convId = convRef.key!;

  const conversation: Omit<Conversation, "id"> = {
    members: {
      [clientId]: true,
      [supportId]: true,
    },
    supportId,
    lastMessage: "",
    updatedAt: Date.now(),
    status: "open",
  };

  // créer la conversation
  await set(convRef, conversation);

  // indexer pour CHAQUE utilisateur (OBLIGATOIRE)
  await set(ref(db, `next-chat/userConversations/${clientId}/${convId}`), true);
  await set(ref(db, `next-chat/userConversations/${supportId}/${convId}`), true);

  return convId;
}

/**
 * Écoute en temps réel les conversations d'un utilisateur
 */
export function listenUserConversations(
  db: Database,
  userId: string,
  callback: (conversations: Conversation[]) => void
) {
  const indexRef = ref(db, `next-chat/userConversations/${userId}`);

  return onValue(indexRef, async (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const conversationIds = Object.keys(data);
    const conversations: Conversation[] = [];

    for (const convId of conversationIds) {
      const convSnap = await get(
        ref(db, `next-chat/conversations/${convId}`)
      );

      if (convSnap.exists()) {
        conversations.push({
          id: convId,
          ...convSnap.val(),
        });
      }
    }

    conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    callback(conversations);
  });
}

/**
 * Écoute en temps réel les conversations d'un support
 */
export function listenSupportConversations(
  db: Database,
  supportId: string,
  callback: (conversations: Conversation[]) => void
) {
  const refConv = ref(db, "next-chat/conversations");

  return onValue(refConv, (snapshot) => {
    const data = snapshot.val() || {};
    const list: Conversation[] = [];

    for (const [id, value] of Object.entries<any>(data)) {
      if (value.members && value.members[supportId]) {
        list.push({ id, ...value });
      }
    }

    list.sort((a, b) => b.updatedAt - a.updatedAt);
    callback(list);
  });
}


/**
 * Écoute les messages d'une conversation en temps réel
 */
export function listenConversationMessages(
  db: Database,
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
) {
  const messagesRef = ref(db, `next-chat/messages/${conversationId}`);

  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list: ChatMessage[] = Object.entries(data).map(
      ([id, value]: any) => ({
        id,
        ...value,
      })
    );

    list.sort((a, b) => a.createdAt - b.createdAt);
    callback(list);
  });
}

/**
 * Envoie un message dans une conversation
 */
export function sendMessage(
  db: Database,
  conversationId: string,
  authorId: string,
  authorRole: ChatRole,
  text: string
) {
  const messageRef = push(
    ref(db, `next-chat/messages/${conversationId}`)
  );

  const message = {
    authorId,
    authorRole,
    text,
    createdAt: Date.now(),
  };

  set(messageRef, message);

  update(ref(db, `next-chat/conversations/${conversationId}`), {
    lastMessage: text,
    updatedAt: Date.now(),
  });
}


/**
 * Démarre ou récupère une conversation unique entre 2 utilisateurs
 */
export async function startConversation(
  db: Database,
  userId: string,
  otherUserId: string
): Promise<string> {

  // Lire UNIQUEMENT les conversations de l'utilisateur
  const userConvRef = ref(db, `next-chat/userConversations/${userId}`);
  const snapshot = await get(userConvRef);

  if (snapshot.exists()) {
    const data = snapshot.val();

    for (const convId of Object.keys(data)) {
      const convSnap = await get(
        ref(db, `next-chat/conversations/${convId}/members`)
      );

      if (
        convSnap.exists() &&
        convSnap.child(otherUserId).exists()
      ) {
        return convId; // conversation existante
      }
    }
  }

  // Créer une nouvelle conversation
  const convRef = push(ref(db, "next-chat/conversations"));
  const convId = convRef.key!;

  await set(convRef, {
    members: {
      [userId]: true,
      [otherUserId]: true,
    },
    lastMessage: "",
    updatedAt: Date.now(),
    status: "open",
  });

  // Indexer pour chaque utilisateur
  await set(ref(db, `next-chat/userConversations/${userId}/${convId}`), true);
  await set(ref(db, `next-chat/userConversations/${otherUserId}/${convId}`), true);

  return convId;
}

export function listenAllConversations(
  db: Database,
  callback: (conversations: Conversation[]) => void
) {
  const refConv = ref(db, "next-chat/conversations");

  return onValue(refConv, (snapshot) => {
    const data = snapshot.val() || {};
    const list: Conversation[] = Object.entries(data).map(
      ([id, value]: any) => ({
        id,
        ...value,
      })
    );

    list.sort((a, b) => b.updatedAt - a.updatedAt);
    callback(list);
  });
}


export async function assignConversationToSupport(
  db: Database,
  conversationId: string,
  supportId: string
) {
  // assigner le support
  await update(ref(db, `next-chat/conversations/${conversationId}`), {
    supportId,
  });

  // indexer la conversation pour le support
  await set(
    ref(db, `next-chat/userConversations/${supportId}/${conversationId}`),
    true
  );
}

// Sauvegarder le token FCM (dans le package)

export function saveUserFCMToken(
  db: Database,
  userId: string,
  token: string
) {
  return set(
    ref(db, `next-chat/fcmTokens/${userId}/${token}`),
    true
  );
}