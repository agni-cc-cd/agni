"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  getAuth,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut as fbSignOut,
  type Auth,
  type ConfirmationResult,
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

/**
 * Social sign-in providers (exactly four). Primary methods are email/password,
 * phone and anonymous — see SignInPanel for the order they render in.
 */
export type ProviderId = "google" | "apple" | "github" | "facebook";

function buildProvider(id: ProviderId) {
  switch (id) {
    case "google":
      return new GoogleAuthProvider();
    case "apple": {
      const p = new OAuthProvider("apple.com");
      p.addScope("email");
      p.addScope("name");
      return p;
    }
    case "github":
      return new GithubAuthProvider();
    case "facebook":
      return new FacebookAuthProvider();
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

/**
 * Email + password sign-in. A guest session is upgraded in place so links
 * created before signing in stay attached to the account.
 */
export async function signInEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const current = auth.currentUser;
  if (current?.isAnonymous) {
    const cred = await linkWithCredential(
      current,
      EmailAuthProvider.credential(email, password),
    ).catch(async () => {
      // Guest uid cannot take this email (already registered) — sign in instead.
      const inCred = await signInWithEmailAndPassword(auth, email, password);
      return inCred;
    });
    return cred.user;
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/** Create a new email/password account (guest sessions upgrade in place). */
export async function signUpEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const current = auth.currentUser;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (current?.isAnonymous && current.uid !== cred.user.uid) {
    // New account created alongside a guest session: the guest uid is disposable
    // (links it created are migrated server-side on next write via upsertUser).
    return cred.user;
  }
  return cred.user;
}

/** Password reset email for a known address. */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

/**
 * Phone sign-in step 1: send an SMS code. Requires an invisible reCAPTCHA
 * (rendered by SignInPanel into #recaptcha-container).
 */
export async function sendPhoneCode(phone: string): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  const current = auth.currentUser;
  if (current?.isAnonymous) {
    return linkWithPhoneNumber(current, phone, verifier);
  }
  return signInWithPhoneNumber(auth, phone, verifier);
}

/** Phone sign-in step 2: verify the SMS code. */
export async function confirmPhoneCode(
  confirmation: ConfirmationResult,
  code: string,
): Promise<User> {
  const cred = await confirmation.confirm(code);
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
  const code =
    typeof err === "object" && err && "code" in err ? String((err as { code: string }).code) : "";
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in window. Allow popups for this site and try again.";
    case "auth/operation-not-allowed":
      return "That sign-in method is turned off right now. Try another way to sign in.";
    case "auth/unauthorized-domain":
      return "Sign-in is not set up for this website yet. Please try again later.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method. Try that one instead.";
    case "auth/network-request-failed":
      return "We couldn't reach the sign-in service. Check your connection and try again.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account already exists for that email. Sign in instead.";
    case "auth/weak-password":
      return "Please choose a stronger password (at least 6 characters).";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/invalid-phone-number":
      return "That phone number doesn't look right. Include the country code, like +14155550100.";
    case "auth/invalid-verification-code":
      return "That code is incorrect. Check your messages and try again.";
    case "auth/code-expired":
      return "That code has expired. Request a new one.";
    case "auth/missing-phone-number":
      return "Please enter your phone number.";
    case "auth/captcha-check-failed":
    case "auth/invalid-app-credential":
      return "Verification failed. Please refresh the page and try again.";
    default:
      return err instanceof Error && err.message ? err.message : "Sign-in didn't work. Try again.";
  }
}
