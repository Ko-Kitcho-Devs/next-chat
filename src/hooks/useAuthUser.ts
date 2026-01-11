import { useEffect, useState } from "react";
import { Auth, User, onAuthStateChanged } from "firebase/auth";

export function useAuthUser(auth: Auth) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsub();
  }, [auth]);

  return { user, loading };
}
