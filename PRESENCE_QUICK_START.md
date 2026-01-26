# 🟢 Marqueur de Présence En Ligne - Guide Complet

## Vue d'ensemble

Vous avez demandé d'ajouter un **marqueur de présence en ligne** au package. C'est chose faite! ✨

## ✅ Ce qui a été implémenté

### 1️⃣ **OnlinePresenceIndicator** 
Un composant réutilisable qui affiche:
- 🔴 Un marqueur coloré animé (vert si en ligne, gris si hors ligne)
- 📛 Le nom de l'utilisateur (prioritaire)
- 📧 Sinon l'adresse email
- ⚡ Animations fluides avec Framer Motion

```tsx
<OnlinePresenceIndicator 
  name="Sophie Martin"
  email="sophie@example.com"
  isOnline={true}
/>
```

### 2️⃣ **ConversationMemberIndicator**
Une version Firebase-ready qui:
- 🔗 Se connecte automatiquement à Firebase
- 📡 Écoute les changements de présence en temps réel
- ♻️ Met à jour automatiquement
- 🎯 Prêt à être mis dans l'en-tête des conversations

```tsx
<ConversationMemberIndicator 
  user={otherMember}
  db={firebaseDb}
/>
```

## 🎨 Rendu visuel

Le composant affiche quelque chose comme ceci:

```
🟢 Sophie Martin
   ↑     ↑
   |     └── Nom de l'utilisateur
   └── Marqueur animé (en ligne)
```

Ou si hors ligne:
```
🔘 Jean Durand
   ↑     ↑
   |     └── Nom de l'utilisateur
   └── Marqueur gris (hors ligne)
```

## 🚀 Comment l'utiliser

### Option 1: Composant simple et réutilisable

```tsx
import { OnlinePresenceIndicator } from 'next-chat-package';

export function MyHeader() {
  return (
    <OnlinePresenceIndicator 
      name="Jean Dupont"
      email="jean@example.com"
      isOnline={true}
      fontSize={16}
    />
  );
}
```

### Option 2: Avec Firebase (Recommandé)

```tsx
import { ConversationMemberIndicator } from 'next-chat-package';
import { getDatabase } from 'firebase/database';

export function ConversationWindow() {
  const db = getDatabase();
  
  const otherUser = {
    uid: 'user-123',
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    role: 'support'
  };

  return (
    <div>
      <header>
        <ConversationMemberIndicator 
          user={otherUser}
          db={db}
          fontSize={16}
        />
      </header>
      {/* Reste de la conversation... */}
    </div>
  );
}
```

## 🎯 Cas d'utilisation recommandés

### 1. En-tête de conversation
```tsx
<div className="conversation-header">
  <ConversationMemberIndicator user={otherMember} db={db} />
</div>
```

### 2. Liste de conversations
```tsx
{conversations.map(user => (
  <div key={user.uid} className="conversation-item">
    <ConversationMemberIndicator user={user} db={db} />
  </div>
))}
```

### 3. Barre d'agents disponibles
```tsx
<div className="agents-status">
  {agents.map(agent => (
    <OnlinePresenceIndicator 
      key={agent.uid}
      name={agent.name}
      isOnline={agent.online}
      fontSize={14}
    />
  ))}
</div>
```

## 🎨 Personnalisation

```tsx
<OnlinePresenceIndicator 
  name="Sophie Martin"
  email="sophie@example.com"
  isOnline={true}
  
  // Tailles et couleurs
  indicatorSize={12}              // Taille du point (défaut: 10)
  fontSize={16}                   // Taille du texte (défaut: 14)
  onlineColor="#22c55e"           // Couleur si en ligne (défaut: #10b981)
  offlineColor="#6b7280"          // Couleur si hors ligne (défaut: #9ca3af)
  
  // Styles
  className="my-custom-class"     // Classe CSS personnalisée
  style={{                        // Styles inline
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#f0f9ff'
  }}
/>
```

## 📡 Comment ça fonctionne avec Firebase

Le composant utilise la structure suivante dans Firebase Realtime Database:

```
next-chat/presence/{userId}/
  ├── online: true/false
  └── lastSeen: timestamp
```

Cette structure est **gérée automatiquement** par le hook `usePresence` existant dans le package.

**Aucune configuration supplémentaire n'est nécessaire!**

## 💾 Fichiers ajoutés

| Fichier | Description |
|---------|-------------|
| [src/components/OnlinePresenceIndicator.tsx](src/components/OnlinePresenceIndicator.tsx) | Composant de base réutilisable |
| [src/components/ConversationMemberIndicator.tsx](src/components/ConversationMemberIndicator.tsx) | Composant avec intégration Firebase |
| [src/components/OnlinePresenceIndicator.test.tsx](src/components/OnlinePresenceIndicator.test.tsx) | Tests unitaires |
| [ONLINE_PRESENCE_GUIDE.md](ONLINE_PRESENCE_GUIDE.md) | Documentation détaillée |
| [ONLINE_PRESENCE_EXAMPLES.tsx](ONLINE_PRESENCE_EXAMPLES.tsx) | Exemples d'utilisation |
| [ONLINE_PRESENCE_SUMMARY.md](ONLINE_PRESENCE_SUMMARY.md) | Résumé technique |

## 📦 Exports disponibles

```tsx
export { OnlinePresenceIndicator } from 'next-chat-package';
export { ConversationMemberIndicator } from 'next-chat-package';
```

## ✨ Caractéristiques

- ✅ **Marqueur animé** - Pulse quand en ligne
- ✅ **Temps réel** - Synchro Firebase automatique
- ✅ **TypeScript** - Types complets
- ✅ **Personnalisable** - Couleurs, tailles, styles
- ✅ **Accessible** - Tooltips et descriptions
- ✅ **Responsive** - S'adapte aux petits écrans
- ✅ **Pas de dépendance externe** (hormis React et Framer Motion qui sont déjà là)

## 🧪 Tests

Tests unitaires inclus pour valider:
- ✅ Affichage du nom
- ✅ Affichage de l'email
- ✅ Priorité nom > email
- ✅ Couleurs personnalisées
- ✅ Classes CSS
- ✅ Styles inline

Pour lancer les tests:
```bash
npm test
```

## 📋 Export TypeScript

```tsx
interface OnlinePresenceIndicatorProps {
  name?: string;
  email?: string;
  isOnline?: boolean;
  indicatorSize?: number;
  fontSize?: number;
  onlineColor?: string;
  offlineColor?: string;
  className?: string;
  style?: CSSProperties;
}

interface ConversationMemberIndicatorProps {
  user?: ChatUser;
  db?: Database;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
}
```

## ✅ Build Status

```
✅ ESM Build: 21.01 kB
✅ CJS Build: 22.67 kB
✅ DTS Build: 9.11 kB
✅ Total Package: 63.0 kB
```

Le package est prêt pour la production!

## 🎓 Prochaines étapes

Vous pouvez maintenant:

1. **Installer le package mis à jour** depuis votre application
2. **Importer les composants** dans vos pages
3. **Personnaliser les couleurs et styles** selon votre design
4. **Intégrer dans vos conversations** pour afficher la présence

Besoin d'aide pour l'intégration? Consultez [ONLINE_PRESENCE_EXAMPLES.tsx](ONLINE_PRESENCE_EXAMPLES.tsx) pour des exemples complets!

---

🎉 **C'est tout!** Vous avez maintenant un système complet de marqueur de présence en ligne pour votre package.
