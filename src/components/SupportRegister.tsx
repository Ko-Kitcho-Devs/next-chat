import { useState } from "react";
import { Database } from "firebase/database";
import { registerSupport } from "../firebase/supports";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";

interface SupportRegisterProps {
  db: Database;
  auth: Auth; // Auth requis : soit user déjà connecté, soit utilisé pour signup
}

export function SupportRegister({ db, auth }: SupportRegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ uid: string; name?: string; supportKey: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Déterminer le uid : utilisateur déjà connecté ? sinon signup
      let targetUid = auth.currentUser?.uid;

      if (!targetUid) {
        if (!email || !password) throw new Error("Email et mot de passe requis pour l'inscription");
        if (password !== confirm) throw new Error("Les mots de passe ne correspondent pas");

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        targetUid = cred.user.uid;
      }

      // Enregistrer complètement le support (creates user record + index key)
      const userData = await registerSupport(db, targetUid, name || undefined, email || undefined);
      setResult({ uid: userData.uid, name: userData.name, supportKey: userData.supportKey });
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }
  
  const currentUid = auth.currentUser?.uid;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h3>Enregistrement - Support</h3>
      {currentUid ? (
        <p style={{ color: "#666", fontSize: 14 }}>UID connecté: <code>{currentUid}</code></p>
      ) : (
        <p style={{ color: "#666", fontSize: 14 }}>Vous n'êtes pas connecté — créez un compte ci‑dessous.</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <input
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        {!currentUid && (
          <>
            <input
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
            <input
              placeholder="Confirmer le mot de passe"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </>
        )}

        <button disabled={loading} style={{ padding: 12, borderRadius: 8, background: "#1f6feb", color: "white", border: "none", cursor: loading ? "wait" : "pointer" }}>
          {loading ? "Enregistrement..." : "S'enregistrer"}
        </button>
      </form>

      {error && <div style={{ marginTop: 12, padding: 12, color: "#dc2626", background: "#fee2e2", borderRadius: 8 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px dashed #10b981", borderRadius: 8, background: "#f0fdf4" }}>
          <p style={{ margin: 0, fontWeight: 700, color: "#059669 " }}>✓ Enregistrement réussi !</p>
          <p style={{ margin: "8px 0 0 0 ", fontSize: 13 }}>Votre profil:</p>
          <div style={{ marginTop: 8, padding: 8, background: "white", borderRadius: 4, border: "1px solid #dcfce7", fontSize: 13 }}>
            <p style={{ margin: "0 0 4px 0" }}><strong>UID:</strong> {result.uid}</p>
            {result.name && <p style={{ margin: "0 0 4px 0" }}><strong>Nom:</strong> {result.name}</p>}
            <p style={{ margin: "0 0 4px 0" }}><strong>Rôle:</strong> support</p>
            <p style={{ margin: "0" }}><strong>Clé:</strong> <code style={{ background: "#f3f4f6", padding: "2px 4px", borderRadius: 3 }}>{result.supportKey}</code></p>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: "#374151" }}>
            Cette clé d'identification permet aux clients de vous contacter. Conservez-la en sécurité.
          </p>
        </div>
      )}
    </div>
  );
}
