/**
 * Preset Themes for E-commerce Platforms
 * 
 * Usage:
 * import { ECOMMERCE_THEMES } from '@next-chat-package/config';
 * 
 * <ChatDashboard
 *   theme={ECOMMERCE_THEMES.shopify}
 *   ...
 * />
 */

import type { ChatTheme } from './src/chat/chat.types';

export const ECOMMERCE_THEMES: Record<string, ChatTheme> = {
  // Shopify - Professional Blue
  shopify: {
    primaryColor: "#008060",
    backgroundColor: "#ffffff",
    headerColor: "#004d33",
    userMessageColor: "#008060",
    supportMessageColor: "#f0fdf4",
  },

  // WooCommerce - Warm Orange
  woocommerce: {
    primaryColor: "#f97316",
    backgroundColor: "#fffbf5",
    headerColor: "#ea580c",
    userMessageColor: "#ea580c",
    supportMessageColor: "#ffede4",
  },

  // Magento - Professional Grey
  magento: {
    primaryColor: "#1f2937",
    backgroundColor: "#f9fafb",
    headerColor: "#111827",
    userMessageColor: "#1f2937",
    supportMessageColor: "#f3f4f6",
  },

  // BigCommerce - Deep Blue
  bigcommerce: {
    primaryColor: "#0070f3",
    backgroundColor: "#fafbfc",
    headerColor: "#0051ba",
    userMessageColor: "#0051ba",
    supportMessageColor: "#dbeafe",
  },

  // Prestashop - Bold Red
  prestashop: {
    primaryColor: "#df0c0c",
    backgroundColor: "#fffbfb",
    headerColor: "#ad0707",
    userMessageColor: "#ad0707",
    supportMessageColor: "#ffe5e5",
  },

  // Etsy - Gold Fashion
  etsy: {
    primaryColor: "#f1641e",
    backgroundColor: "#fffdf7",
    headerColor: "#d35400",
    userMessageColor: "#d35400",
    supportMessageColor: "#feebd4",
  },

  // Amazon - Corporate Orange
  amazon: {
    primaryColor: "#ff9900",
    backgroundColor: "#ffffff",
    headerColor: "#cc7a00",
    userMessageColor: "#cc7a00",
    supportMessageColor: "#fff3e6",
  },

  // eBay - Red Black
  ebay: {
    primaryColor: "#e53238",
    backgroundColor: "#f5f5f5",
    headerColor: "#b21f1f",
    userMessageColor: "#b21f1f",
    supportMessageColor: "#ffeaea",
  },

  // Tiktok Shop - Black Modern
  tiktokshop: {
    primaryColor: "#000000",
    backgroundColor: "#ffffff",
    headerColor: "#000000",
    userMessageColor: "#000000",
    supportMessageColor: "#f5f5f5",
  },

  // Instagram Shop - Purple Modern
  instagramshop: {
    primaryColor: "#e1306c",
    backgroundColor: "#fafafa",
    headerColor: "#a01d64",
    userMessageColor: "#a01d64",
    supportMessageColor: "#ffe0ec",
  },

  // Alibaba - Minimal Red
  alibaba: {
    primaryColor: "#e82e28",
    backgroundColor: "#ffffff",
    headerColor: "#bb2318",
    userMessageColor: "#bb2318",
    supportMessageColor: "#ffe0d8",
  },

  // Lazada - Tech Blue
  lazada: {
    primaryColor: "#1e88e5",
    backgroundColor: "#fafbfc",
    headerColor: "#0d47a1",
    userMessageColor: "#0d47a1",
    supportMessageColor: "#e3f2fd",
  },

  // Shopee - Red Orange
  shopee: {
    primaryColor: "#ee4d2d",
    backgroundColor: "#fffbf8",
    headerColor: "#c41d1d",
    userMessageColor: "#c41d1d",
    supportMessageColor: "#ffe8e0",
  },
};

/**
 * Theme Builder Utility
 * 
 * Create custom themes with intelligent contrast checking
 */
export function createCustomTheme(
  brandColor: string,
  options?: {
    mode?: 'light' | 'dark';
    supportColor?: string;
    backgroundColor?: string;
  }
): ChatTheme {
  const mode = options?.mode || 'light';
  
  return {
    primaryColor: brandColor,
    backgroundColor: options?.backgroundColor || (mode === 'light' ? '#ffffff' : '#1a1a1a'),
    headerColor: options?.supportColor || brandColor, // Darken brand color for header
    userMessageColor: brandColor,
    supportMessageColor: options?.supportColor || (mode === 'light' ? '#f5f5f5' : '#2a2a2a'),
  };
}

/**
 * Common E-commerce Customizations
 */
export const ECOMMERCE_CUSTOMIZATIONS = {
  // B2B Platform
  b2b: {
    primaryColor: "#1f2937",
    backgroundColor: "#ffffff",
    headerColor: "#111827",
    userMessageColor: "#1f2937",
    supportMessageColor: "#f3f4f6",
  },

  // Luxury Goods
  luxury: {
    primaryColor: "#78350f",
    backgroundColor: "#fffaf0",
    headerColor: "#54320d",
    userMessageColor: "#54320d",
    supportMessageColor: "#fef3c7",
  },

  // Tech Gadgets
  techGadgets: {
    primaryColor: "#0066cc",
    backgroundColor: "#f0f5ff",
    headerColor: "#003d99",
    userMessageColor: "#003d99",
    supportMessageColor: "#dceafe",
  },

  // Fashion & Beauty
  fashion: {
    primaryColor: "#be123c",
    backgroundColor: "#fef2f8",
    headerColor: "#831843",
    userMessageColor: "#831843",
    supportMessageColor: "#fbcfe8",
  },

  // Health & Wellness
  health: {
    primaryColor: "#059669",
    backgroundColor: "#f0fdf4",
    headerColor: "#045a3f",
    userMessageColor: "#045a3f",
    supportMessageColor: "#dcfce7",
  },

  // Food & Beverage
  food: {
    primaryColor: "#d97706",
    backgroundColor: "#fffbeb",
    headerColor: "#a35a0d",
    userMessageColor: "#a35a0d",
    supportMessageColor: "#fef3c7",
  },

  // Sports & Outdoors
  sports: {
    primaryColor: "#2563eb",
    backgroundColor: "#f0f9ff",
    headerColor: "#1e40af",
    userMessageColor: "#1e40af",
    supportMessageColor: "#dbeafe",
  },

  // Travel & Tourism
  travel: {
    primaryColor: "#1e7e34",
    backgroundColor: "#f0fdf4",
    headerColor: "#145a2a",
    userMessageColor: "#145a2a",
    supportMessageColor: "#dcfce7",
  },

  // Education & E-Learning
  education: {
    primaryColor: "#7c3aed",
    backgroundColor: "#faf5ff",
    headerColor: "#5e21b6",
    userMessageColor: "#5e21b6",
    supportMessageColor: "#f3e8ff",
  },

  // Entertainment
  entertainment: {
    primaryColor: "#ec4899",
    backgroundColor: "#fdf2f8",
    headerColor: "#be185d",
    userMessageColor: "#be185d",
    supportMessageColor: "#fce7f3",
  },
};
