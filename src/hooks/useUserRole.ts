import { useEffect, useState } from "react";
import { Database, ref, get } from "firebase/database";
import { ChatRole } from "../chat/chat.types";

export function useUserRole(
  db: Database,
  uid?: string
) {
  const [role, setRole] = useState<ChatRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !uid) {
      setRole(null);
      setLoading(false);
      return;
    }

    async function fetchRole() {
      const snap = await get(
        ref(db, `next-chat/users/${uid}/role`)
      );

      setRole(
        snap.exists() ? snap.val() : ChatRole.CLIENT
      );
      setLoading(false);
    }

    fetchRole();
  }, [db, uid]);

  return { role, loading };
}
