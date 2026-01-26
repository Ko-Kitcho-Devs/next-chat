"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { FirebaseChatConfig, FirebaseInstance } from "./firebase.types";

let firebaseInstance: FirebaseInstance | null = null;

export function initFirebaseClient(
  config: FirebaseChatConfig
): FirebaseInstance {
  if (firebaseInstance) return firebaseInstance;

  if (typeof window === "undefined") {
    throw new Error(
      "NextChat: Firebase must be initialized on the client only."
    );
  }

  if (!config.apiKey) {
    throw new Error(
      "NextChat: Firebase API key manquante (NEXT_PUBLIC_FIREBASE_API_KEY)"
    );
  }

  const app = getApps().length ? getApp() : initializeApp(config);

  firebaseInstance = {
    app,
    db: getDatabase(app),
    auth: getAuth(app),
  };

  return firebaseInstance;
}
