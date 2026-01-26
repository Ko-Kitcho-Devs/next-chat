/**
 * E-commerce Integration Example
 * 
 * Ce fichier montre comment intégrer le chat dans une plateforme e-commerce
 */

import React, { useState, useEffect } from 'react';
import { Database } from 'firebase/database';
import { ChatDashboard } from '@next-chat-package/components';
import type { ChatTheme } from '@next-chat-package/chat';
import { ECOMMERCE_THEMES, ECOMMERCE_CUSTOMIZATIONS } from './ECOMMERCE_THEMES';

/**
 * Exemple 1: Chat Intégré au Dashboard du Vendeur
 */
export function VendorDashboardChat({
  database,
  vendorId,
  storeTheme,
}: {
  database: Database;
  vendorId: string;
  storeTheme?: ChatTheme;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Support Client</h2>
      
      <ChatDashboard
        db={database}
        userId={vendorId}
        role="vendor"
        theme={storeTheme || ECOMMERCE_THEMES.shopify}
        className="rounded-xl border border-gray-200"
      />
    </div>
  );
}

/**
 * Exemple 2: Chat Flottant pour Acheteur
 */
export function FloatingCustomerChat({
  database,
  customerId,
  merchantTheme,
}: {
  database: Database;
  customerId: string;
  merchantTheme?: ChatTheme;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-96 h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white">
          <ChatDashboard
            db={database}
            userId={customerId}
            role="customer"
            theme={merchantTheme || ECOMMERCE_THEMES.shopify}
            className="h-full rounded-2xl"
          />
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center text-2xl"
      >
        💬
      </button>
    </div>
  );
}

/**
 * Exemple 3: Chat avec Sélection de Thème Multi-store
 */
export function MultiStoreChat({
  database,
  userId,
}: {
  database: Database;
  userId: string;
}) {
  const [selectedStore, setSelectedStore] = useState('shopify');
  
  const stores = [
    { id: 'shopify', name: 'Shopify Store', theme: ECOMMERCE_THEMES.shopify },
    { id: 'woocommerce', name: 'WooCommerce', theme: ECOMMERCE_THEMES.woocommerce },
    { id: 'magento', name: 'Magento', theme: ECOMMERCE_THEMES.magento },
    { id: 'fashion', name: 'Fashion Brand', theme: ECOMMERCE_CUSTOMIZATIONS.fashion },
  ];

  const currentStore = stores.find((s) => s.id === selectedStore);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Store Selector */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => setSelectedStore(store.id)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedStore === store.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {store.name}
          </button>
        ))}
      </div>

      {/* Chat View */}
      {currentStore && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px]">
          <ChatDashboard
            db={database}
            userId={userId}
            role="customer"
            theme={currentStore.theme}
            className="h-full rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Exemple 4: Chat Produit avec Détails Contextuels
 */
export function ProductChat({
  database,
  customerId,
  productId,
  productName,
  merchantTheme,
}: {
  database: Database;
  customerId: string;
  productId: string;
  productName: string;
  merchantTheme?: ChatTheme;
}) {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {/* Détails Produit */}
      <div className="col-span-1 bg-white p-6 rounded-xl border border-gray-200">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">{productName}</h3>
        <p className="text-sm text-gray-600 mb-4">ID: {productId}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Prix:</span>
            <span className="font-semibold">$99.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stock:</span>
            <span className="font-semibold text-green-600">En stock</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Évaluations:</span>
            <span className="font-semibold">4.8/5 ⭐</span>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <ChatDashboard
          db={database}
          userId={customerId}
          role="customer"
          theme={merchantTheme || ECOMMERCE_THEMES.shopify}
          className="h-full rounded-xl"
        />
      </div>
    </div>
  );
}

/**
 * Exemple 5: Chat avec Préférences Utilisateur Sauvegardées
 */
export function PreferenceBasedChat({
  database,
  customerId,
}: {
  database: Database;
  customerId: string;
}) {
  const [theme, setTheme] = useState<ChatTheme>(ECOMMERCE_THEMES.shopify);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les préférences utilisateur depuis Firestore
    const fetchUserPreferences = async () => {
      try {
        // Example: fetch from your database
        // const prefs = await db.collection('userPreferences').doc(customerId).get();
        // setTheme(prefs.data().chatTheme || ECOMMERCE_THEMES.shopify);
        
        setTheme(ECOMMERCE_THEMES.shopify);
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Chargement du chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ChatDashboard
        db={database}
        userId={customerId}
        role="customer"
        theme={theme}
        className="rounded-2xl shadow-lg"
      />
    </div>
  );
}

/**
 * Exemple 6: Chat Catégorie Produit (Vêtements, Électronique, etc.)
 */
export function CategoryChat({
  database,
  customerId,
  category,
}: {
  database: Database;
  customerId: string;
  category: 'fashion' | 'electronics' | 'food' | 'health';
}) {
  const categoryThemes: Record<string, ChatTheme> = {
    fashion: ECOMMERCE_CUSTOMIZATIONS.fashion,
    electronics: ECOMMERCE_CUSTOMIZATIONS.techGadgets,
    food: ECOMMERCE_CUSTOMIZATIONS.food,
    health: ECOMMERCE_CUSTOMIZATIONS.health,
  };

  const categoryNames = {
    fashion: '👗 Fashion',
    electronics: '⚡ Electronics',
    food: '🍕 Food',
    health: '💊 Health',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {categoryNames[category]}
        </h1>
        <p className="text-gray-600">Demandez des informations sur nos produits</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px]">
        <ChatDashboard
          db={database}
          userId={customerId}
          role="customer"
          theme={categoryThemes[category]}
          className="h-full rounded-2xl"
        />
      </div>
    </div>
  );
}

/**
 * Exemple 7: Chat avec Analytics
 */
export function AnalyticsChat({
  database,
  customerId,
  merchantTheme,
}: {
  database: Database;
  customerId: string;
  merchantTheme?: ChatTheme;
}) {
  const [messageCount, setMessageCount] = useState(0);
  const [sessionStartTime] = useState(new Date());

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Analytics Bar */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Messages</p>
          <p className="text-2xl font-bold text-blue-600">{messageCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Temps de Session</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)}s
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Statut</p>
          <p className="text-2xl font-bold text-purple-600">🟢 Actif</p>
        </div>
      </div>

      {/* Chat */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px]">
        <ChatDashboard
          db={database}
          userId={customerId}
          role="customer"
          theme={merchantTheme || ECOMMERCE_THEMES.shopify}
          className="h-full rounded-2xl"
        />
      </div>
    </div>
  );
}
