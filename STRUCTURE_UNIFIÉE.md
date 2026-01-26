# Structure Unifiée - Minimale & Efficace

## 📋 Vue d'ensemble

Structure **ultra-simple** pour supporter les supports avec une clé unique d'identification.

---

## 🏗️ Architecture Firebase

```
next-chat/
├── users/{uid}/                    # Tous les utilisateurs (clients + supports)
│   ├── name: string
│   ├── email: string
│   ├── role: "client" | "support"
│   └── supportKey?: string         # ← Clé unique si c'est un support
│
└── supportKeys/{key} -> uid        # Index pour retrouver rapidement par clé
```

**C'est tout !** Pas de collection `supportPlatforms`, pas de métadonnées supplémentaires.

---

## ✨ Avantages de cette approche

| Aspect | Résultat |
|--------|---------|
| **Simplicité** | ✅ Pas de jointures, pas de tables extra |
| **Clé unique** | ✅ Identifie un support directement |
| **Index rapide** | ✅ `supportKeys/{key} -> uid` pour lookup O(1) |
| **Scalabilité** | ✅ Fonctionne avec 1 ou 10 000 supports |
| **Pas de duplication** | ✅ Les métadonnées sont dans le user |

---

## 🚀 Utilisation

### 1. Générer une clé pour un support

```typescript
import { generateSupportKey_Export } from "next-chat-package";

const key = generateSupportKey_Export();
// "a1b2c3d4-e5f6-4a5b-8c9d-e0f1a2b3c4d5"
```

### 2. Créer un user support avec sa clé

```typescript
import { set, ref } from "firebase/database";
import { generateSupportKey_Export, indexSupportKey } from "next-chat-package";

const uid = auth.currentUser!.uid;
const supportKey = generateSupportKey_Export();

// 1. Créer l'utilisateur avec la clé
await set(ref(db, `next-chat/users/${uid}`), {
  uid,
  name: "Jean Martin",
  email: "jean@support.com",
  role: "support",
  supportKey,  // ← La clé unique
  createdAt: Date.now()
});

// 2. Indexer la clé pour lookup rapide
await indexSupportKey(db, supportKey, uid);
```

### 3. Retrouver un support par sa clé

```typescript
import { getUidByKey } from "next-chat-package";

// Le client reçoit la clé et veut identifier le support
const supportKey = "a1b2c3d4-e5f6-4a5b-8c9d-e0f1a2b3c4d5";
const supportUid = await getUidByKey(db, supportKey);

// Charger les données du support
const supportSnap = await get(ref(db, `next-chat/users/${supportUid}`));
const supportData = supportSnap.val();
// {
//   uid: "uid_support_123",
//   name: "Jean Martin",
//   role: "support",
//   supportKey: "a1b2c3d4-..."
// }
```

---

## 📝 Types TypeScript

```typescript
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
  supportKey?: string;  // ← Clé unique si support
};

export type Conversation = {
  id: string;
  members: Record<string, boolean>;
  lastMessage?: string;
  updatedAt: number;
  status: "open" | "closed";
};
```

---

## 💡 Cas d'usage : Grosse équipe

**Scénario :** 50 supports dans la même équipe/entreprise

```
1. Chaque support crée son user :
   next-chat/users/uid_support_jean
   {
     uid: "uid_support_jean",
     name: "Jean Martin",
     email: "jean@support.com",
     role: "support",
     supportKey: "key123abc"  ← Clé unique pour Jean
   }

   next-chat/users/uid_support_marie
   {
     uid: "uid_support_marie",
     name: "Marie Dupont",
     email: "marie@support.com",
     role: "support",
     supportKey: "key456def"  ← Clé unique pour Marie
   }

2. Index pour lookup rapide :
   next-chat/supportKeys/key123abc → "uid_support_jean"
   next-chat/supportKeys/key456def → "uid_support_marie"

3. Chaque client a sa propre clé de support :
   - Client A parle à Jean (key123abc)
   - Client B parle à Marie (key456def)
   - Client C parle à Jean aussi (key123abc)
```

**Avantage :** Pas de duplication, chaque support a une clé unique d'identification.

---

## 🔐 Sécurité

La clé (`supportKey`) est un **UUID v4** généré côté serveur. Elle est :
- ✅ Impossible à prédire
- ✅ Largement suffisante pour identifier un support
- ✅ À transmettre via canal sécurisé au client

Ne stocke jamais les clés en clair dans le code source !

---

## 📞 Questions courantes

**Q: Pourquoi pas juste utiliser l'UID du support ?**  
R: La clé permet une indirection sécurisée. Un client ne devrait pas connaître les UUIDs Firebase des supports.

**Q: Et si deux supports partagent un client ?**  
R: C'est dans `Conversation.members`. Un client peut avoir plusieurs conversations avec différents supports.

**Q: Peut-on retrouver tous les supports d'un client ?**  
R: Oui ! Via `Conversation.members` qui liste tous les UID des membres (clients ET supports).

**Q: Comment montrer le nom du support au client ?**  
R: Charge le user du support : `ref(db, 'next-chat/users/{uid}')` pour avoir son `name`.


