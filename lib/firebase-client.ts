"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  linkWithPopup,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailLink,
  signInWithPopup,
  signOut as fbSignOut,
  TwitterAuthProvider,
  type Auth,
  type User,
} from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

export type { Auth, User };

export function getFirebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/** Social sign-in providers, ordered by expected usage. */
export type ProviderId =
  | "google"
  | "github"
  | "microsoft"
  | "twitter"
  | "facebook"
  | "yahoo";

function buildProvider(id: ProviderId) {
  switch (id) {
    case "google":
      return new GoogleAuthProvider();
    case "github":
      return new GithubAuthProvider();
    case "microsoft": {
      const p = new OAuthProvider("microsoft.com");
      p.setCustomParameters({ prompt: "select_account" });
      return p;
    }
    case "twitter":
      return new TwitterAuthProvider();
    case "facebook":
      return new FacebookAuthProvider();
    case "yahoo": {
      const p = new OAuthProvider("yahoo.com");
      return p;
    }
  }
}

/**
 * Sign in with a social provider. If the current session is a guest,
 * upgrade it in place (provider is linked to the guest uid so nothing is lost).
 */
export async function signInWithProvider(id: ProviderId): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = buildProvider(id);
  const current = auth.currentUser;
  if (current?.isAnonymous) {
    const cred = await linkWithPopup(current, provider);
    return cred.user;
  }
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/** Instant guest session — no form, no friction. */
export async function signInGuest(): Promise<User> {
  const cred = await signInAnonymously(getFirebaseAuth());
  return cred.user;
}

const EMAIL_LINK_KEY = "agni-email-link-signin";

/** Send a passwordless sign-in link (Firebase email link auth). */
export async function sendEmailSignInLink(email: string): Promise<void> {
  await sendSignInLinkToEmail(getFirebaseAuth(), email, {
    url: `${window.location.origin}/login`,
    handleCodeInApp: true,
  });
  localStorage.setItem(EMAIL_LINK_KEY, email);
}

/** Complete email-link sign-in if the current URL is a sign-in link. */
export async function completeEmailSignInIfPending(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;
  const email = localStorage.getItem(EMAIL_LINK_KEY) ?? window.prompt("Confirm your email");
  if (!email) return null;
  const cred = await signInWithEmailLink(auth, email);
  localStorage.removeItem(EMAIL_LINK_KEY);
  return cred.user;
}

export async function signOut(): Promise<void> {
  await fbSignOut(getFirebaseAuth());
}

/** Fresh ID token for API calls (Firebase refreshes hourly). */
export async function getIdToken(user: User): Promise<string> {
  return user.getIdToken();
}

/** Human-readable message for common Firebase auth errors. */
export function authErrorMessage(err: unknown): string {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled yet (Firebase console → Authentication → Sign-in method).";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for sign-in (Firebase console → Authentication → Settings → Authorized domains).";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method. Try that one instead.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/invalid-email":
      return "That email address does not look valid.";
    default:
      return err instanceof Error && err.message ? err.message : "Sign-in failed. Try another method.";
  }
}
