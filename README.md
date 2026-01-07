# Next Chat Widget

Chat temps réel pour Next.js basé sur **Firebase Realtime Database**.  
Idéal pour intégrer un chat support ou client sur un site e-commerce.

---

## 📦 Installation

```bash
npm install @kokitcho32/next-chat

## ou avec Yarn :

 ```bash

##Copier le code

yarn add @kokitcho32/next-chat

##⚙️ Configuration Firebase

## Avant tout, configure Firebase Realtime Database et Auth.
##P uis initialise Firebase dans ton projet :

# ts
# Copier le code

import { initFirebase } from "@kokitcho32/next-chat";

const db = initFirebase({
  apiKey: "TON_API_KEY",
  authDomain: "TON_PROJECT.firebaseapp.com",
  databaseURL: "https://TON_PROJECT.firebaseio.com",
  projectId: "TON_PROJECT_ID",
});


# 🗂 Créer une conversation
# ts
# Copier le code

import { startConversation } from "@kokitcho32/next-chat";

const conversationId = await startConversation(db, userId, "support");
userId : identifiant de l’utilisateur courant

"support" : rôle ou type du destinataire

Retourne conversationId pour ouvrir le chat

# 📝 Liste des conversations de l’utilisateur
# tsx
# Copier le code

import { ConversationsList } from "@kokitcho32/next-chat";

<ConversationsList
  db={db}
  userId={userId}
  onSelectConversation={setConversationId}  // callback quand on choisit une conversation
  styles={{
    container: { backgroundColor: "#f0f4f8", padding: 20 },
    item: { borderRadius: 12, marginBottom: 8, padding: 14 },
    messageText: { color: "#ff6a00", fontWeight: "bold" },
    statusText: { fontStyle: "italic", fontSize: 12 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  }}
/>
styles : optionnel, permet de personnaliser entièrement l’affichage

Conteneur, items, texte, titre, statuts → tout peut être surchargé

# 💬 Widget Chat en temps réel
# tsx
# Copier le code

import { ChatWidget, ChatTheme } from "@kokitcho32/next-chat";

const theme: ChatTheme = {
  primaryColor: "#ff6a00",
  backgroundColor: "#f9fafb",
  headerColor: "#0f172a",
  userMessageColor: "#ff6a00",
  supportMessageColor: "#d1d5db",
};

<ChatWidget
  db={db}
  conversationId={conversationId}
  userId={userId}
  role="user"
  theme={theme}  // couleurs personnalisées
  styles={{
    container: { borderRadius: 24, fontFamily: "Arial" },
    header: { textTransform: "uppercase" },
    message: { fontSize: 16, padding: "12px 20px" }
  }}
  position="bottom-left" // "bottom-right" ou "bottom-left"
/>
theme : couleurs principales du chat

styles : contrôle complet des mises en forme

position : emplacement du widget sur la page


# 🛠 Fonctionnalités
# ✅ Realtime Database (messages et conversations en temps réel)

# ✅ Support multi-utilisateurs (client / support / vendeur)

# ✅ Liste des conversations

# ✅ Widget personnalisable (couleurs, polices, bordures)

# ✅ Position flexible (bottom-left / bottom-right)

# ✅ Sécurisé grâce aux règles Firebase (auth obligatoire)

# 🔐 Sécurité Firebase
# Assurez-vous que vos règles Realtime Database ressemblent à ceci :

# json
# Copier le code
{
  "rules": {
    "next-chat": {
      "conversations": {
        "$conversationId": {
          ".read": "auth != null && data.child('members').child(auth.uid).exists()",
          ".write": "auth != null && (!data.exists() || data.child('members').child(auth.uid).exists())"
        }
      },
      "messages": {
        "$conversationId": {
          ".read": "auth != null && root.child('next-chat/conversations/' + $conversationId + '/members/' + auth.uid).exists()",
          ".write": "auth != null && root.child('next-chat/conversations/' + $conversationId + '/members/' + auth.uid).exists()"
        }
      },
      "userConversations": {
        "$userId": {
          ".read": "auth != null && auth.uid === $userId",
          ".write": "auth != null && auth.uid === $userId"
        }
      }
    }
  }
}
# 🔐 Chaque utilisateur ne peut accéder qu’à ses conversations

# 🛡️ Empêche tout accès non autorisé

# 🎨 Personnalisation complète
Thème : couleurs globales du widget

Styles : contrôle complet de l’UI

Position : bas droite ou bas gauche

Extensible : possibilité d’ajouter animations ou Tailwind

# 📝 Exemple complet
# tsx
# Copier le code

<ConversationsList
  db={db}
  userId="user1"
  onSelectConversation={setConversationId}
  styles={{
    container: { backgroundColor: "#f0f4f8", padding: 20 },
    item: { borderRadius: 12, marginBottom: 8, padding: 14 },
  }}
/>

<ChatWidget
  db={db}
  conversationId={conversationId}
  userId="user1"
  role="user"
  theme={{ primaryColor: "#ff6a00" }}
  styles={{ container: { borderRadius: 24 } }}
  position="bottom-left"
/>
🔧 Développement
Build du package :

bash
Copier le code
npm run build
Mode dev (watch) :

bash
Copier le code
npm run dev
Types TypeScript inclus (dist/index.d.ts)

🏷️ Versioning
Patch : correction de bugs → 0.0.1 → 0.0.2

Minor : nouvelles fonctionnalités → 0.0.2 → 0.1.0

Major : breaking changes → 0.1.0 → 1.0.0

📩 Support
Pour toute question ou amélioration, contacte Ko Kitcho ou ouvre un issue sur GitHub.