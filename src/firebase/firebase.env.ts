import { FirebaseChatConfig } from "./firebase.types";

export function getFirebaseConfigFromEnv(
  overrides?: Partial<FirebaseChatConfig>
): FirebaseChatConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    ...overrides,
  };
}

export const getSupportKey = (): string =>
  (process.env.NEXT_PUBLIC_SUPPORT_KEY ||
    process.env.SUPPORT_KEY ||
    "").trim();
