# Guide de Personnalisation des Thèmes

## Système de Thème ChatTheme

Le système de thème `ChatTheme` offre une personnalisation complète de l'apparence du chat.

### Type ChatTheme

```typescript
type ChatTheme = {
  primaryColor: string;           // Couleur principale (boutons, accents)
  backgroundColor: string;        // Fond de l'interface
  headerColor: string;            // Couleur de l'en-tête
  userMessageColor: string;       // Couleur des messages de l'utilisateur
  supportMessageColor: string;    // Couleur des messages du support/autre utilisateur
};
```

## Présets Recommandés

### E-commerce Bleu Professionnel
```typescript
const ecommerceBlue: ChatTheme = {
  primaryColor: "#0066cc",        // Bleu marchand
  backgroundColor: "#ffffff",     // Blanc pur
  headerColor: "#003d99",         // Bleu foncé
  userMessageColor: "#0066cc",    // Bleu utilisateur
  supportMessageColor: "#f0f5ff",  // Blanc bleuté pour support
};
```

### E-commerce Vert Moderne
```typescript
const ecommerceGreen: ChatTheme = {
  primaryColor: "#22c55e",        // Vert vif
  backgroundColor: "#fafafa",     // Gris très clair
  headerColor: "#16a34a",         // Vert foncé
  userMessageColor: "#16a34a",    // Vert utilisateur
  supportMessageColor: "#dcfce7",  // Vert clair pour support
};
```

### E-commerce Orange Chaleureux
```typescript
const ecommerceOrange: ChatTheme = {
  primaryColor: "#f97316",        // Orange vif
  backgroundColor: "#fffbf5",     // Beige très clair
  headerColor: "#ea580c",         // Orange foncé
  userMessageColor: "#ea580c",    // Orange utilisateur
  supportMessageColor: "#ffede4",  // Orange très clair pour support
};
```

### E-commerce Rose Mode
```typescript
const ecommerceRose: ChatTheme = {
  primaryColor: "#ec4899",        // Rose vif
  backgroundColor: "#fffbf8",     // Rose très clair
  headerColor: "#be185d",         // Rose foncé
  userMessageColor: "#be185d",    // Rose utilisateur
  supportMessageColor: "#ffe4f0",  // Rose très léger pour support
};
```

## Intégration dans une Plateforme E-commerce

### Exemple 1: Sélection de Thème par Marque

```typescript
import { ChatDashboard } from '@next-chat-package/components';
import { Database } from 'firebase/database';

interface EcommerceStore {
  storeId: string;
  storeName: string;
  theme: ChatTheme;
}

const STORE_THEMES: Record<string, ChatTheme> = {
  'electronics': {
    primaryColor: "#1f2937",
    backgroundColor: "#f9fafb",
    headerColor: "#111827",
    userMessageColor: "#1f2937",
    supportMessageColor: "#f3f4f6",
  },
  'fashion': {
    primaryColor: "#ec4899",
    backgroundColor: "#fef2f8",
    headerColor: "#be123c",
    userMessageColor: "#be123c",
    supportMessageColor: "#fce7f3",
  },
  'home': {
    primaryColor: "#f59e0b",
    backgroundColor: "#fffbeb",
    headerColor: "#b45309",
    userMessageColor: "#b45309",
    supportMessageColor: "#fef3c7",
  },
};

export function StoreChat({
  storeId,
  database,
  userId,
}: {
  storeId: string;
  database: Database;
  userId: string;
}) {
  const storeTheme = STORE_THEMES[storeId] || STORE_THEMES['electronics'];
  
  return (
    <ChatDashboard
      db={database}
      userId={userId}
      role="customer"
      theme={storeTheme}
      className="rounded-lg border border-gray-200"
    />
  );
}
```

### Exemple 2: Personnalisation Dynamique Basée sur les Préférences Client

```typescript
import { useEffect, useState } from 'react';
import { ChatDashboard } from '@next-chat-package/components';
import type { ChatTheme } from '@next-chat-package/chat';

export function CustomizableChatWidget({
  database,
  userId,
  storeId,
}: {
  database: Database;
  userId: string;
  storeId: string;
}) {
  const [theme, setTheme] = useState<ChatTheme>({
    primaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    headerColor: "#0f172a",
    userMessageColor: "#2563eb",
    supportMessageColor: "#10b981",
  });

  // Charger les préférences du client depuis Firestore
  useEffect(() => {
    const fetchClientPreferences = async () => {
      // Votre logique pour charger les préférences
      setTheme({
        primaryColor: "#0066cc",
        backgroundColor: "#ffffff",
        headerColor: "#003d99",
        userMessageColor: "#0066cc",
        supportMessageColor: "#f0f5ff",
      });
    };

    fetchClientPreferences();
  }, [userId, storeId]);

  return (
    <ChatDashboard
      db={database}
      userId={userId}
      role="customer"
      theme={theme}
      className="rounded-xl shadow-lg"
    />
  );
}
```

### Exemple 3: Contrôle des Couleurs en Temps Réel

```typescript
import { useState } from 'react';
import { ChatDashboard } from '@next-chat-package/components';
import type { ChatTheme } from '@next-chat-package/chat';

export function ThemeCustomizer({
  database,
  userId,
}: {
  database: Database;
  userId: string;
}) {
  const [theme, setTheme] = useState<ChatTheme>({
    primaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    headerColor: "#0f172a",
    userMessageColor: "#2563eb",
    supportMessageColor: "#10b981",
  });

  const updateThemeColor = (key: keyof ChatTheme, value: string) => {
    setTheme((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Panneau de Contrôle */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-lg">Personnaliser le Thème</h3>
        
        <label className="block">
          <span className="text-sm font-medium">Couleur Primaire</span>
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => updateThemeColor("primaryColor", e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Couleur de l'En-tête</span>
          <input
            type="color"
            value={theme.headerColor}
            onChange={(e) => updateThemeColor("headerColor", e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Couleur Messages Utilisateur</span>
          <input
            type="color"
            value={theme.userMessageColor}
            onChange={(e) => updateThemeColor("userMessageColor", e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Couleur Messages Support</span>
          <input
            type="color"
            value={theme.supportMessageColor}
            onChange={(e) => updateThemeColor("supportMessageColor", e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Couleur de Fond</span>
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => updateThemeColor("backgroundColor", e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Aperçu du Chat */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ChatDashboard
          db={database}
          userId={userId}
          role="customer"
          theme={theme}
          className="h-full rounded-lg"
        />
      </div>
    </div>
  );
}
```

## Bonnes Pratiques

1. **Contraste des Couleurs**: Assurez-vous que les messages de l'utilisateur ont suffisamment de contraste avec le fond
2. **Cohérence de Marque**: Utilisez les couleurs principales de votre marque pour `primaryColor` et `headerColor`
3. **Lisibilité**: Les messages du support doivent être clairs et lisibles sur le fond choisi
4. **Accessibilité**: Testez avec les outils d'accessibilité pour garantir le contraste minimum (WCAG AA)
5. **Stockage**: Sauvegardez les préférences de thème dans votre base de données Firebase

## Ressources Supplémentaires

- [Générateur de Couleurs Tailwind](https://tailwindcss.com/docs/customizing-colors)
- [Vérificateur de Contraste WCAG](https://webaim.org/resources/contrastchecker/)
- [Palette de Couleurs Adobe](https://color.adobe.com/)
