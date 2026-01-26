import { useState, useEffect } from 'react';
import { getDatabase } from 'firebase/database';
import { 
  ConversationMemberIndicator, 
  MessageBubble, 
  TypingIndicator,
  ChatUser,
  ChatMessage,
  ChatRole
} from 'next-chat-package';

/**
 * Exemple d'intégration complète du composant ConversationMemberIndicator
 * dans une fenêtre de conversation
 */
export function ConversationWindowExample() {
  const db = getDatabase();
  
  // Utilisateur avec qui on discute
  const otherMember: ChatUser = {
    uid: 'support-user-123',
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    role: ChatRole.SUPPORT,
    online: true
  };

  // Messages d'exemple
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      authorId: 'client-user-456',
      authorRole: ChatRole.CLIENT,
      text: 'Bonjour, j\'aurais besoin d\'aide avec ma commande',
      createdAt: Date.now() - 120000,
    },
    {
      id: '2',
      authorId: 'support-user-123',
      authorRole: ChatRole.SUPPORT,
      text: 'Bien sûr ! Je vais vous aider. Quel est votre numéro de commande ?',
      createdAt: Date.now() - 60000,
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f8fafc',
    }}>
      {/* En-tête avec le marqueur de présence */}
      <header style={{
        padding: '16px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #eee',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <ConversationMemberIndicator 
          user={otherMember}
          db={db}
          fontSize={16}
          style={{ paddingLeft: '8px' }}
        />
      </header>

      {/* Zone de messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            timestamp={new Date(msg.createdAt)}
            isMe={msg.authorRole === ChatRole.CLIENT}
          />
        ))}
        
        {/* Indicateur de saisie */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#cfd8e3,#dfe7ef)',
            }} />
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <footer style={{
        padding: '20px',
        backgroundColor: 'white',
        borderTop: '1px solid #eee',
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
        }}>
          <input
            type="text"
            placeholder="Tapez votre message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
          <button style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#1f6feb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
          }}>
            Envoyer
          </button>
        </div>
      </footer>
    </div>
  );
}

/**
 * Exemple minimaliste avec un style personnalisé
 */
export function MinimalPresenceExample() {
  const db = getDatabase();

  const user: ChatUser = {
    uid: 'user-123',
    name: 'Jean Durand',
    role: ChatRole.SUPPORT,
  };

  return (
    <ConversationMemberIndicator
      user={user}
      db={db}
      fontSize={14}
      style={{
        padding: '12px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        borderLeft: '3px solid #3b82f6',
      }}
    />
  );
}

/**
 * Exemple avec une liste de conversations et le statut en ligne
 */
export function ConversationListWithPresence() {
  const db = getDatabase();

  const conversations: ChatUser[] = [
    {
      uid: 'user-1',
      name: 'Alice Dupont',
      role: ChatRole.SUPPORT,
      online: true,
    },
    {
      uid: 'user-2',
      name: 'Bob Martin',
      role: ChatRole.SUPPORT,
      online: false,
    },
    {
      uid: 'user-3',
      email: 'contactez-nous@example.com',
      role: ChatRole.SUPPORT,
      online: true,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Conversations</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {conversations.map((user) => (
          <div
            key={user.uid}
            style={{
              padding: '12px 16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #eee',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ConversationMemberIndicator
              user={user}
              db={db}
              fontSize={14}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
