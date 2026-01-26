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
    if (!data) return callback([]);

    const convIds = Object.keys(data);
    const results: Conversation[] = [];

    for (const id of convIds) {
      const snap = await get(ref(db, `next-chat/conversations/${id}`));
      if (snap.exists()) results.push({ id, ...snap.val() });
    }
    callback(results.sort((a, b) => b.updatedAt - a.updatedAt));
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
  // Correction : On écoute l'index de l'utilisateur (même pour le support)
  const indexRef = ref(db, `next-chat/userConversations/${supportId}`);

  return onValue(indexRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return callback([]);

    const conversationIds = Object.keys(data);
    const conversations: Conversation[] = [];

    // On récupère les détails de chaque conversation de l'index
    for (const convId of conversationIds) {
      const convSnap = await get(ref(db, `next-chat/conversations/${convId}`));
      if (convSnap.exists()) {
        conversations.push({ id: convId, ...convSnap.val() });
      }
    }
    callback(conversations.sort((a, b) => b.updatedAt - a.updatedAt));
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
  return onValue(ref(db, `next-chat/messages/${conversationId}`), (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
    callback(list.sort((a, b) => a.createdAt - b.createdAt));
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
  const messageRef = push(ref(db, `next-chat/messages/${conversationId}`));
  const message = { authorId, authorRole, text, createdAt: Date.now() };

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
  const userConvRef = ref(db, `next-chat/userConversations/${userId}`);
  const snapshot = await get(userConvRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    for (const convId of Object.keys(data)) {
      const convSnap = await get(ref(db, `next-chat/conversations/${convId}/members`));
      if (convSnap.exists() && convSnap.child(otherUserId).exists()) {
        return convId;
      }
    }
  }

  const convRef = push(ref(db, "next-chat/conversations"));
  const convId = convRef.key!;

  const newConv: Omit<Conversation, "id"> = {
    members: { [userId]: true, [otherUserId]: true },
    lastMessage: "",
    updatedAt: Date.now(),
    status: "open",
  };

  await set(convRef, newConv);
  // Double indexation (Client + Support)
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
  // ajouter le support aux members s'il n'y est pas
  const convRef = ref(db, `next-chat/conversations/${conversationId}`);
  const snap = await get(convRef);
  
  if (snap.exists()) {
    const conv = snap.val() as Conversation;
    if (!conv.members[supportId]) {
      await update(convRef, {
        members: { ...conv.members, [supportId]: true },
      });
    }
  }

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

/**
 * Résoud un `supportKey` vers le `supportId` (indexé dans next-chat/supportKeys)
 */
export async function getSupportIdFromKey(db: Database, supportKey: string): Promise<string | null> {
  const snap = await get(ref(db, `next-chat/supportKeys/${supportKey}`));
  if (!snap.exists()) return null;
  return snap.val();
}

/**
 * Démarre une conversation en utilisant une supportKey (résolution puis startConversation)
 */
export async function startConversationWithSupportKey(
  db: Database,
  userId: string,
  supportKey: string
): Promise<string> {
  const supportId = await getSupportIdFromKey(db, supportKey);
  if (!supportId) throw new Error('Support non trouvé pour la clé fournie.');
  return startConversation(db, userId, supportId);
}