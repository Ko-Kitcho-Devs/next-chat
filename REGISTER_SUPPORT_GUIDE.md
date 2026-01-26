# Guide Complet : Enregistrer un Support

## 📋 Vue d'ensemble

Voici comment enregistrer complètement un support dans la structure unifiée.

---

## 🔄 Flux d'enregistrement

```
1. Support crée son compte via Auth Firebase
   ↓
2. Support remplit son profil (nom, email)
   ↓
3. Appel registerSupport(db, uid, name, email)
   ↓
4. Création automatique dans :
   - next-chat/users/{uid}
   - next-chat/supportKeys/{key} -> uid
   ↓
5. Support reçoit sa clé unique
```

---

## 🚀 Utilisation avec le composant

### Simple : Utiliser `SupportRegister`

```tsx
import { SupportRegister, initFirebaseFromEnv } from "next-chat-package";

export function ProfilePage() {
  const { db, auth } = initFirebaseFromEnv();

  // Le composant gère :
  // - si `auth.currentUser` existe -> on utilise son uid
  // - sinon -> flow signup (email + mot de passe) via Firebase Auth
  return <SupportRegister db={db} auth={auth} />;
}
```

**Que fait le composant :**
1. Affiche les champs pour nom/email
2. Appelle `registerSupport()` au submit
3. Crée l'utilisateur dans Firebase
4. Indexe la clé
5. Affiche la clé générée

---

## 🔧 Utilisation manuelle (Backend)

Si tu veux contrôler complètement l'enregistrement :

```typescript
import { registerSupport } from "next-chat-package";

// Après création du user Firebase Auth
const userData = await registerSupport(
  db,
  uid,
  "Jean Martin",
  "jean@support.com"
);

console.log(userData);
// {
//   uid: "uid_xyz123",
//   name: "Jean Martin",
//   email: "jean@support.com",
//   role: "support",
//   supportKey: "a1b2c3d4-e5f6-4a5b-8c9d-e0f1a2b3c4d5",
//   createdAt: 1705795200000
// }
```

---

## 📊 Structures créées dans Firebase

### `next-chat/users/{uid}`
```json
{
  "uid": "uid_xyz123",
  "name": "Jean Martin",
  "email": "jean@support.com",
  "role": "support",
  "supportKey": "a1b2c3d4-e5f6-4a5b-8c9d-e0f1a2b3c4d5",
  "createdAt": 1705795200000
}
```

### `next-chat/supportKeys/{key}`
```
"a1b2c3d4-e5f6-4a5b-8c9d-e0f1a2b3c4d5" → "uid_xyz123"
```

---

## 🔍 Retrouver un support

### Par sa clé (ce qu'un client reçoit)

```typescript
import { getUidByKey } from "next-chat-package";

// Client reçoit la clé du support
const supportKey = "a1b2c3d4-e5f6-4a5b-8c9d-e0f1a2b3c4d5";

// Retrouver le UID
const supportUid = await getUidByKey(db, supportKey);
// "uid_xyz123"

// Charger les données du support
const snap = await get(ref(db, `next-chat/users/${supportUid}`));
const supportData = snap.val();
// {
//   uid: "uid_xyz123",
//   name: "Jean Martin",
//   role: "support",
//   supportKey: "a1b2c3d4-..."
// }
```

### Par son UID (côté admin)

```typescript
import { ref, get } from "firebase/database";

const supportUid = "uid_xyz123";
const snap = await get(ref(db, `next-chat/users/${supportUid}`));
const supportData = snap.val();
```

---

## 💡 Exemple complet : Plateforme multi-supports

**Scénario :** 50 supports dans une entreprise

```typescript
// 1. Support 1 s'enregistre
const support1 = await registerSupport(db, "uid_sup1", "Jean Martin", "jean@corp.fr");
// Crée:
// - next-chat/users/uid_sup1 { role: "support", supportKey: "key1", ... }
// - next-chat/supportKeys/key1 → "uid_sup1"

// 2. Support 2 s'enregistre
const support2 = await registerSupport(db, "uid_sup2", "Marie Dupont", "marie@corp.fr");
// Crée:
// - next-chat/users/uid_sup2 { role: "support", supportKey: "key2", ... }
// - next-chat/supportKeys/key2 → "uid_sup2"

// 3. Client reçoit une clé du support (par email, SMS, etc)
const clientKey = "key1";  // Pour parler à Jean

// 4. Client retrouve le support
const supportUid = await getUidByKey(db, clientKey);  // "uid_sup1"
const support = await get(ref(db, `next-chat/users/${supportUid}`));
// Affiche: "Jean Martin vous répondra bientôt..."

// 5. Conversation créée avec la clé du support
const conversation = {
  id: "conv_xyz",
  members: {
    [clientUid]: true,
    [supportUid]: true  // Jean
  },
  status: "open"
};
```

---

## 🛡️ Sécurité

### ✅ À faire
- Générer les clés côté serveur
- Transmettre les clés via HTTPS uniquement
- Valider que l'utilisateur est authentifié avant d'enregistrer
- Vérifier que `uid` correspond au user connecté

### ❌ À éviter
- Ne pas envoyer la clé en clair par email non-chiffré
- Ne pas stocker les clés en clair dans le frontend
- Ne pas utiliser l'UID Firebase comme identifiant client public

---

## 📝 Fonctions disponibles

```typescript
// Générer une clé
generateSupportKey_Export() -> string

// Enregistrer un support (crée user + indexe clé)
registerSupport(db, uid, name?, email?)
  -> Promise<{ uid, name, email, role, supportKey, createdAt }>

// Retrouver uid à partir de la clé
getUidByKey(db, key)
  -> Promise<string | null>

// Indexer manuellement (si tu génères la clé toi-même)
indexSupportKey(db, key, uid)
  -> Promise<void>
```

---

## 🚨 Dépannage

**Q: `registerSupport` échoue**
- Vérifier que `db` est correctement initialisé
- Vérifier que `uid` existe dans Auth Firebase
- Vérifier les permissions Firestore/Realtime DB

**Q: La clé ne s'indexe pas**
- Vérifier que la clé est unique (UUID v4)
- Vérifier que `supportKeys` collection a les permissions write

**Q: Impossible de retrouver par clé**
- Vérifier que `indexSupportKey()` a été appelé
- Vérifier la clé (copie complète)

---

## 📚 Voir aussi

- [STRUCTURE_UNIFIÉE.md](STRUCTURE_UNIFIÉE.md) - Architecture complète
- [chat.types.ts](src/chat/chat.types.ts) - Types TypeScript
