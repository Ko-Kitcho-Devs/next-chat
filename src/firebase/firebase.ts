import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

export type FirebaseChatConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

export const initFirebase = (config: FirebaseChatConfig) => {
  const app = getApps().length ? getApp() : initializeApp(config);
  
  return {
    app,
    db: getDatabase(app),
    auth: getAuth(app),
  };
};
