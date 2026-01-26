import { Database, ref, set, get } from "firebase/database";

function generateSupportKey(): string {
  // Utilise la meilleure API disponible
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }

  // Fallback: générer 32 caractères hex aléatoires
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && (crypto as any).getRandomValues) {
    (crypto as any).getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Génère une clé unique pour identifier un support
 * La clé est utilisée comme identifiant de configuration côté client
 */
export function generateSupportKey_Export(): string {
  return generateSupportKey();
}

/**
 * Indexe une clé de support pour retrouver rapidement son uid
 * À appeler lors de la création d'un user support
 */
export async function indexSupportKey(
  db: Database,
  key: string,
  uid: string
): Promise<void> {
  await set(ref(db, `next-chat/supportKeys/${key}`), uid);
}

/**
 * Retrouve le uid d'un support à partir de sa clé
 * Utile pour les clients qui reçoivent la clé et veulent identifier le support
 */
export async function getUidByKey(
  db: Database,
  key: string
): Promise<string | null> {
  const snap = await get(ref(db, `next-chat/supportKeys/${key}`));
  return snap.exists() ? snap.val() : null;
}

/**
 * Enregistre complètement un support dans Firebase
 * Crée l'utilisateur dans next-chat/users/{uid} et indexe sa clé
 * 
 * @param db - Instance Firebase Database
 * @param uid - UID Firebase du support (doit déjà exister via Auth)
 * @param name - Nom du support
 * @param email - Email du support
 * @returns L'objet user créé avec sa clé
 */
export async function registerSupport(
  db: Database,
  uid: string,
  name?: string,
  email?: string
): Promise<{ uid: string; name?: string; email?: string; role: string; supportKey: string; createdAt: number }> {
  // Générer une clé unique
  const supportKey = generateSupportKey();

  // Créer l'utilisateur support
  const userData = {
    uid,
    name,
    email,
    role: "support",
    supportKey,
    createdAt: Date.now(),
  };

  // 1. Créer/mettre à jour l'utilisateur
  await set(ref(db, `next-chat/users/${uid}`), userData);

  // 2. Indexer la clé pour lookup rapide
  await indexSupportKey(db, supportKey, uid);

  return userData;
}
