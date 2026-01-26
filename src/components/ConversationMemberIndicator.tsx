import { useState, useEffect } from 'react';
import { Database, ref, onValue } from 'firebase/database';
import { ChatUser } from '../chat/chat.types';
import { OnlinePresenceIndicator } from './OnlinePresenceIndicator';

interface ConversationMemberIndicatorProps {
  /** Informations de l'utilisateur */
  user?: ChatUser;
  /** Instance Firebase Database */
  db?: Database;
  /** Taille de la police */
  fontSize?: number;
  /** Classe CSS personnalisée */
  className?: string;
  /** Style personnalisé */
  style?: React.CSSProperties;
}

/**
 * Composant qui affiche le marqueur de présence en ligne et le nom/email d'un utilisateur
 * Écoute l'état de présence en temps réel depuis Firebase
 * 
 * @example
 * ```tsx
 * <ConversationMemberIndicator 
 *   user={otherMember} 
 *   db={firebaseDb}
 * />
 * ```
 */
export function ConversationMemberIndicator({
  user,
  db,
  fontSize = 14,
  className = '',
  style,
}: ConversationMemberIndicatorProps) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!db || !user?.uid) return;

    const presenceRef = ref(db, `next-chat/presence/${user.uid}`);

    const unsubscribe = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsOnline(data.online === true);
      } else {
        setIsOnline(false);
      }
    });

    return () => unsubscribe();
  }, [db, user?.uid]);

  if (!user) {
    return null;
  }

  return (
    <OnlinePresenceIndicator
      name={user.name}
      email={user.uid}
      isOnline={isOnline}
      fontSize={fontSize}
      className={className}
      style={style}
    />
  );
}
