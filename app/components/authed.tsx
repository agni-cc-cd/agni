"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, getIdToken, signInGuest } from "@/lib/firebase-client";

interface AuthState {
  user: User | null;
  loading: boolean;
  /** Bearer value for API calls: Firebase ID token, or the saved admin token. */
  bearer: string | null;
  setUser: (user: User | null) => void;
  signOutNow: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  bearer: null,
  setUser: () => {},
  signOutNow: async () => {},
});

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

/** Headers for API calls: firebase ID token wins, admin token fallback. */
export function authHeaders(bearer: string | null): Record<string, string> {
  return bearer ? { authorization: `Bearer ${bearer}` } : {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState<string | null>(null);
  const guestStarted = useRef(false);

  const signOutNow = useCallback(async () => {
    const { signOut } = await import("@/lib/firebase-client");
    await signOut();
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        getIdToken(u).then(setIdToken).catch(() => setIdToken(null));
      } else {
        setIdToken(null);
      }
      setLoading(false);

      // Frictionless public product: anyone gets an instant guest session,
      // upgraded in place when they later sign in with a provider.
      if (!u && !guestStarted.current) {
        guestStarted.current = true;
        signInGuest().catch(() => {
          // Anonymous auth disabled → stay signed out; the UI offers sign-in.
        });
      }
    });

    return unsub;
  }, []);

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("agni-admin-token") : null;

  return (
    <AuthContext.Provider
      value={{ user, loading, bearer: idToken ?? adminToken, setUser, signOutNow }}
    >
      {children}
    </AuthContext.Provider>
  );
}
