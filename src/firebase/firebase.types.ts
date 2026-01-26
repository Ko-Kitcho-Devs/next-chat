import type { FirebaseApp } from "firebase/app";
import type { Database } from "firebase/database";
import type { Auth } from "firebase/auth";

export type FirebaseChatConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

export interface FirebaseInstance {
  app: FirebaseApp;
  db: Database;
  auth: Auth;
}
