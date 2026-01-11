# 🚀 Next Chat Package

Un **package React + Firebase** clé en main pour intégrer rapidement un **chat temps réel**, avec :
- messages en temps réel (Firebase Realtime Database)
- indicateur “en train d’écrire”
- notifications locales (badge / title)
- notifications PUSH Firebase (FCM)
- UI moderne (Tailwind-ready)
- API modulaire et personnalisable

---

## ✨ Fonctionnalités

✅ Chat temps réel  
✅ Support 1-to-1 (client ↔ support)  
✅ Indicateur de frappe  
✅ Messages non lus  
✅ Notifications locales  
✅ Notifications PUSH Firebase (FCM)  
✅ UI personnalisable  
✅ Compatible Next.js / React  

---

## 📦 Installation

```bash
npm install @kokitcho32/next-chat

# 🚀 Next Chat Package

Un **package React + Firebase** clé en main pour intégrer rapidement un **chat temps réel**, avec :
- messages en temps réel (Firebase Realtime Database)
- indicateur “en train d’écrire”
- notifications locales (badge / title)
- notifications PUSH Firebase (FCM)
- UI moderne (Tailwind-ready)
- API modulaire et personnalisable

---

## ✨ Fonctionnalités

✅ Chat temps réel  
✅ Support 1-to-1 (client ↔ support)  
✅ Indicateur de frappe  
✅ Messages non lus  
✅ Notifications locales  
✅ Notifications PUSH Firebase (FCM)  
✅ UI personnalisable  
✅ Compatible Next.js / React  

---

## 📦 Installation

```bash
npm install next-chat-package

🔥 Prérequis Firebase

Dans la console Firebase :

Activer Realtime Database

Activer Authentication

Activer Cloud Messaging (FCM)

Récupérer :

apiKey

authDomain

databaseURL

projectId

appId

messagingSenderId

VAPID key (Web Push)

🔧 Initialisation Firebase
import { initFirebase } from "next-chat-package";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  appId: "...",
  messagingSenderId: "...",
};

const { app, db, auth } = initFirebase(firebaseConfig);

💬 Démarrer une conversation
import { startConversation } from "next-chat-package";

await startConversation(db, {
  userId: "user_1",
  supportId: "support_1",
});

🧠 Hooks disponibles
🔹 useChat

Gestion centrale du chat (conversations, messages, unread).

const {
  conversations,
  selectedConversationId,
  selectConversation,
  unreadMap,
  sendMessage,
} = useChat({
  db,
  userId,
  role,
});

🔹 useConversation

Messages + scroll automatique.

const { messages, send, bottomRef } = useConversation(
  db,
  conversationId,
  userId,
  role
);

🔹 useTyping

Indicateur “en train d’écrire”.

const { typingUsers, startTyping, stopTyping } =
  useTyping(db, conversationId, userId);

🔹 useNotifications

Notifications locales (onglet, son, badge).

useNotifications(messages, userId);

🔹 useFCM (Notifications PUSH)
import { useFCM } from "next-chat-package";

const { token, permission } = useFCM({
  app,
  vapidKey: "YOUR_VAPID_KEY",
  onForegroundMessage: (payload) => {
    console.log("Message reçu", payload);
  },
});


⚠️ Le token FCM doit être sauvegardé côté backend :

saveUserFCMToken(db, userId, token);

🖥️ Composants UI
💬 ChatWidget

Widget de chat prêt à l’emploi.

import { ChatWidget } from "next-chat-package";

<ChatWidget
  db={db}
  conversationId={conversationId}
  userId={userId}
  role="USER"
  theme={{
    primaryColor: "#2563eb",
    headerColor: "#111827",
  }}
/>;

📋 ConversationsList

Liste des conversations avec badge non lus.

<ConversationsList
  db={db}
  userId={userId}
  role={role}
  unreadMap={unreadMap}
  onSelectConversation={selectConversation}
/>

🎨 Personnalisation UI

Le thème est optionnel :

theme={{
  primaryColor: "#22c55e",
  headerColor: "#0f172a",
  userMessageColor: "#2563eb",
  supportMessageColor: "#e5e7eb",
}}


👉 Compatible Tailwind CSS
👉 Aucun style imposé

🔔 Notifications PUSH (FCM)
Génération automatique du Service Worker
import { generateFcmServiceWorker } from "next-chat-package/utils";

generateFcmServiceWorker(firebaseConfig);


👉 Génère automatiquement :

/public/firebase-messaging-sw.js

🛡️ Sécurité Firebase (exemple)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
