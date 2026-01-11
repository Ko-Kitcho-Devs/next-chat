import { useEffect } from "react";
import { ChatMessage } from "../chat/chat.types";

/**
 * Hook pour gérer les notifications push locales
 * 
 * @param messages - liste des messages à surveiller
 * @param userId - ID de l'utilisateur courant (pour ne pas notifier ses propres messages)
 */
export function useNotifications(messages: ChatMessage[], userId: string | null) {
  useEffect(() => {
    if (!("Notification" in window)) return; // Notifications non supportées
    if (!userId) return;

    // Demander la permission au premier rendu
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // On ne notifie que les nouveaux messages
    const latest = messages[messages.length - 1];
    if (!latest) return;

    if (latest.authorId !== userId && Notification.permission === "granted") {
      new Notification("Nouveau message", {
        body: latest.text,
        icon: "/favicon.ico", // optionnel : ton icône
      });
    }
  }, [messages, userId]);
}
