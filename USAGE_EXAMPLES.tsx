/*
 * ========================================
 * EXEMPLE D'UTILISATION - ChatWidget Amélioré
 * ========================================
 * 
 * Ce fichier montre comment utiliser les composants chat
 * avec tous les nouveaux styles et animations
 */

import { useState } from "react";
import { Database } from "firebase/database";
import { ChatDashboard, ChatRole } from "@kokitcho32/next-chat";

interface ChatExampleProps {
  database: Database;
  currentUserId: string;
  userRole: ChatRole;
}

/**
 * Exemple 1 : Utilisation simple du ChatDashboard
 */
export function ChatDashboardExample({
  database,
  currentUserId,
  userRole,
}: ChatExampleProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ChatDashboard
        db={database}
        userId={currentUserId}
        role={userRole}
        theme={{
          primaryColor: "#3b82f6",
          backgroundColor: "#f8fafc",
          headerColor: "#0f172a",
          userMessageColor: "#2563eb",
          supportMessageColor: "#10b981",
        }}
        className="rounded-3xl"
      />
    </div>
  );
}

/**
 * Exemple 2 : Intégration dans une page avec sidebars
 */
export function ChatPageLayout({
  database,
  currentUserId,
  userRole,
}: ChatExampleProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar gauche */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} bg-white shadow-lg transition-all duration-300 overflow-hidden`}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-900">Navigation</h2>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-4 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Chat Support</h1>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
          </div>
        </div>

        {/* Chat Widget */}
        <div className="flex-1 overflow-hidden p-4">
          <ChatDashboard
            db={database}
            userId={currentUserId}
            role={userRole}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Exemple 3 : Utilisation avec personnalisation de thème
 */
export function ThemedChatExample({
  database,
  currentUserId,
  userRole,
}: ChatExampleProps) {
  const [theme, setTheme] = useState("blue");

  const themes = {
    blue: {
      primaryColor: "#3b82f6",
      backgroundColor: "#f8fafc",
      headerColor: "#0f172a",
      userMessageColor: "#2563eb",
      supportMessageColor: "#6366f1",
    },
    purple: {
      primaryColor: "#8b5cf6",
      backgroundColor: "#faf5ff",
      headerColor: "#3f0f6b",
      userMessageColor: "#7c3aed",
      supportMessageColor: "#ec4899",
    },
    green: {
      primaryColor: "#10b981",
      backgroundColor: "#f0fdf4",
      headerColor: "#064e3b",
      userMessageColor: "#059669",
      supportMessageColor: "#0d9488",
    },
    indigo: {
      primaryColor: "#6366f1",
      backgroundColor: "#f0f4ff",
      headerColor: "#1e1b4b",
      userMessageColor: "#4f46e5",
      supportMessageColor: "#4f46e5",
    },
  };

  return (
    <div className="w-full">
      {/* Theme Selector */}
      <div className="p-4 bg-white border-b border-slate-200 flex gap-2 justify-center">
        {Object.keys(themes).map((themeName) => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              theme === themeName
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="p-4">
        <ChatDashboard
          db={database}
          userId={currentUserId}
          role={userRole}
          theme={themes[theme as keyof typeof themes]}
          className="rounded-3xl"
        />
      </div>
    </div>
  );
}

/**
 * Exemple 4 : Chat avec notifications
 */
export function ChatWithNotifications({
  database,
  currentUserId,
  userRole,
}: ChatExampleProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div className="w-full">
      {/* Notification Bar */}
      {unreadCount > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
          <p className="font-semibold">
            {unreadCount} nouveau{unreadCount > 1 ? "x" : ""} message
            {unreadCount > 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Chat */}
      <ChatDashboard
        db={database}
        userId={currentUserId}
        role={userRole}
      />
    </div>
  );
}

export default ChatDashboardExample;
