# Composant OnlinePresenceIndicator

## Vue d'ensemble

J'ai ajouté deux nouveaux composants pour afficher la présence en ligne des utilisateurs dans le package:

### 1. **OnlinePresenceIndicator**
Un composant basique et réutilisable qui affiche:
- Un marqueur de présence animé (point coloré)
- Le nom de l'utilisateur ou son email s'il n'a pas de nom

### 2. **ConversationMemberIndicator**
Un composant qui encapsule `OnlinePresenceIndicator` et:
- Écoute l'état de présence en temps réel depuis Firebase
- Affiche dynamiquement si l'utilisateur est en ligne ou hors ligne
- Récupère le statut depuis `next-chat/presence/{uid}` dans la base de données

## Utilisation

### Utilisation basique avec OnlinePresenceIndicator:

```tsx
import { OnlinePresenceIndicator } from 'next-chat-package';

export function MyComponent() {
  return (
    <OnlinePresenceIndicator 
      name="Jean Dupont"
      email="jean@example.com"
      isOnline={true}
    />
  );
}
```

### Utilisation avec ConversationMemberIndicator (recommandé):

```tsx
import { ConversationMemberIndicator } from 'next-chat-package';
import { useDatabase } from 'react-firebase-hooks/database';
import { getDatabase } from 'firebase/database';

export function ConversationHeader({ userId, userName }) {
  const db = getDatabase();
  
  const user = {
    uid: userId,
    name: userName,
    role: 'support'
  };

  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
      <ConversationMemberIndicator 
        user={user}
        db={db}
        fontSize={16}
      />
    </div>
  );
}
```

## Props

### OnlinePresenceIndicator Props:
- `name?: string` - Nom de l'utilisateur
- `email?: string` - Email de l'utilisateur (utilisé si pas de nom)
- `isOnline?: boolean` - État en ligne (par défaut: false)
- `indicatorSize?: number` - Taille du marqueur en pixels (par défaut: 10)
- `fontSize?: number` - Taille de la police du texte
- `onlineColor?: string` - Couleur pour en ligne (par défaut: #10b981 - vert)
- `offlineColor?: string` - Couleur pour hors ligne (par défaut: #9ca3af - gris)
- `className?: string` - Classe CSS personnalisée
- `style?: React.CSSProperties` - Style personnalisé

### ConversationMemberIndicator Props:
- `user?: ChatUser` - Informations de l'utilisateur (uid, name, role, etc.)
- `db?: Database` - Instance Firebase Database pour écouter la présence
- `fontSize?: number` - Taille de la police
- `className?: string` - Classe CSS personnalisée
- `style?: React.CSSProperties` - Style personnalisé

## Fonctionnalités

✅ **Marqueur animé**: Le point pulse légèrement quand l'utilisateur est en ligne
✅ **Écoute temps réel**: Met à jour automatiquement l'état depuis Firebase
✅ **Fallback email**: Affiche l'email si pas de nom disponible
✅ **Personnalisable**: Couleurs, tailles et styles configurable
✅ **Responsive**: Gère le texte long avec ellipsis
✅ **Accessibility**: Tooltip sur le marqueur

## Exemple complet dans une conversation:

```tsx
import { 
  ConversationMemberIndicator, 
  MessageBubble,
  ChatUser 
} from 'next-chat-package';
import { getDatabase } from 'firebase/database';

interface ConversationProps {
  otherMember: ChatUser;
  messages: any[];
}

export function Conversation({ otherMember, messages }: ConversationProps) {
  const db = getDatabase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* En-tête avec présence */}
      <div style={{ 
        padding: '16px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8fafc'
      }}>
        <ConversationMemberIndicator 
          user={otherMember}
          db={db}
          fontSize={16}
        />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            timestamp={new Date(msg.createdAt)}
            isMe={msg.authorId === 'your-uid'}
          />
        ))}
      </div>
    </div>
  );
}
```

## Intégration avec la base de données Firebase

Le composant `ConversationMemberIndicator` écoute automatiquement la présence à:
```
next-chat/presence/{uid}/
  ├── online: boolean
  └── lastSeen: timestamp
```

Cet état est géré par le hook `usePresence` qui:
- Marque l'utilisateur comme "en ligne" au chargement
- Marque automatiquement comme "hors ligne" à la déconnexion
- Met à jour `lastSeen` à chaque changement

Aucune configuration supplémentaire n'est nécessaire !
