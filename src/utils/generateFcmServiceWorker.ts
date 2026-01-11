import * as fs from "fs";
import * as path from "path";
import { generateFCMSw } from "../firebase/serviceWorkerTemplate";
import type { FirebaseChatConfig } from "../firebase/firebase";

/**
 * Génère le fichier firebase-messaging-sw.js
 * À exécuter UNIQUEMENT côté Node.js
 */
export function generateFcmServiceWorker(
  config: FirebaseChatConfig,
  outputPath = "public/firebase-messaging-sw.js"
) {
  if (!config.messagingSenderId) {
    throw new Error("messagingSenderId est requis pour FCM");
  }

  const swCode = generateFCMSw({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });

  const absolutePath = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, swCode);

  console.log(` FCM Service Worker généré : ${outputPath}`);
}
