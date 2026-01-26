import { CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface OnlinePresenceIndicatorProps {
  /** Nom de l'utilisateur */
  name?: string;
  /** Email de l'utilisateur (utilisé si pas de nom) */
  email?: string;
  /** État en ligne */
  isOnline?: boolean;
  /** Taille du marqueur en pixels (par défaut 10) */
  indicatorSize?: number;
  /** Taille de la police du texte */
  fontSize?: number;
  /** Couleur personnalisée pour le marqueur en ligne */
  onlineColor?: string;
  /** Couleur personnalisée pour le marqueur hors ligne */
  offlineColor?: string;
  /** Classe CSS personnalisée */
  className?: string;
  /** Style personnalisé */
  style?: CSSProperties;
}

/**
 * Composant réutilisable pour afficher le marqueur de présence en ligne avec le nom ou l'email d'un utilisateur
 * 
 * @example
 * ```tsx
 * <OnlinePresenceIndicator 
 *   name="John Doe" 
 *   email="john@example.com"
 *   isOnline={true} 
 * />
 * ```
 */
export function OnlinePresenceIndicator({
  name,
  email,
  isOnline = false,
  indicatorSize = 10,
  fontSize = 14,
  onlineColor = '#10b981',
  offlineColor = '#9ca3af',
  className = '',
  style,
}: OnlinePresenceIndicatorProps) {
  // Afficher le nom s'il existe, sinon l'email
  const displayText = name || email || 'Utilisateur';

  return (
    <div
      className={`online-presence-indicator ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      {/* Marqueur de présence animé */}
      <motion.div
        animate={{
          scale: isOnline ? [1, 1.2, 1] : 1,
          opacity: isOnline ? 1 : 0.5,
        }}
        transition={
          isOnline
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        style={{
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: '50%',
          backgroundColor: isOnline ? onlineColor : offlineColor,
          flexShrink: 0,
          boxShadow: isOnline
            ? `0 0 ${indicatorSize * 1.5}px ${isOnline ? onlineColor : offlineColor}80`
            : 'none',
        }}
        title={isOnline ? 'En ligne' : 'Hors ligne'}
      />

      {/* Texte affichant le nom ou l'email */}
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color: '#0f172a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 250,
        }}
      >
        {displayText}
      </span>
    </div>
  );
}
