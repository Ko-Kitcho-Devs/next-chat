import { Database, ref, push, onValue, set, update, get, child } from "firebase/database";
import { ChatMessage, Conversation, ChatRole } from "./chat.types";

/**
 * Crée (ou récupère) une conversation entre 2 utilisateurs
 */
export function createConversation(
  db: Database,
  userId: string,
  otherUserId: string
) {
  const conversationRef = push(ref(db, "next-chat/conversations"));

  const conversation: Omit<Conversation, "id"> = {
    members: {
      [userId]: true,
      [otherUserId]: true,
    },
    lastMessage: "",
    updatedAt: Date.now(),
    status: "open",
  };

  set(conversationRef, conversation);

  return conversationRef.key!;
}

/**
 * Écoute en temps réel les conversations d'un utilisateur
 */
export function listenUserConversations(
  db: Database,
  userId: string,
  callback: (conversations: Conversation[]) => void
) {
  const userConvRef = ref(db, `next-chat/userConversations/${userId}`);

  return onValue(userConvRef, async (snapshot) => {
    const data = snapshot.val() || {};
    const conversationIds = Object.keys(data);

    if (conversationIds.length === 0) {
      callback([]);
      return;
    }

    const list: Conversation[] = [];

    // On récupère chaque conversation individuellement
    for (const convId of conversationIds) {
      const convSnap = await get(ref(db, `next-chat/conversations/${convId}`));
      if (convSnap.exists()) {
        list.push({ id: convId, ...convSnap.val() });
      }
    }

    // Trier par date
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
