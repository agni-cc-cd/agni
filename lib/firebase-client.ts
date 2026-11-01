"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  isSignInWithEmailLink as fbIsSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut as fbSignOut,
  updatePassword,
  updateProfile,
  type Auth,
  type ActionCodeSettings,
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
 * Social sign-in providers (exactly two: Google and GitHub). Primary methods
 * are the email verification flow, phone and anonymous — see SignInPanel.
 */
export type ProviderId = "google" | "github";

function buildProvider(id: ProviderId) {
  switch (id) {
    case "google":
      return new GoogleAuthProvider();
    case "github":
      return new GithubAuthProvider();
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

/**
 * Firebase Auth only allowlists email-action continue URLs on the project's
 * authorized domains (agni.cc.cd is pending that console toggle). The
 * Firebase Hosting site on the same project IS authorized, so action emails
 * land on a tiny bridge page there which forwards every query parameter
 * (oobCode, mode, apiKey, ...) to the requested agni.cc.cd destination.
 */
const ACTION_BRIDGE = "https://agni-dd35c.web.app/bridge";

function actionUrl(dest: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ dest, ...extra });
  return `${ACTION_BRIDGE}?${params.toString()}`;
}

function actionCodeSettings(dest: string, extra?: Record<string, string>): ActionCodeSettings {
  return { url: actionUrl(dest, extra), handleCodeInApp: true };
}

/** True when the current URL carries an email sign-in link (oobCode + mode). */
export function isEmailLink(): boolean {
  return fbIsSignInWithEmailLink(getFirebaseAuth(), typeof window !== "undefined" ? window.location.href : "");
}

/**
 * Account creation / passwordless sign-in: ask for name + email, send the
 * verification link. The account is created only when the link is clicked,
 * so an unverified address can never be used. Returns after the email is sent.
 */
export async function sendEmailLink(email: string, dest = "/auth/verify", name?: string): Promise<void> {
  const extra: Record<string, string> = {};
  if (name?.trim()) extra.name = name.trim().slice(0, 80);
  await sendSignInLinkToEmail(getFirebaseAuth(), email.trim(), actionCodeSettings(dest, extra));
  // The consuming step needs the address the link was sent to (the link URL
  // itself carries only the code) — keep it for this browser.
  try {
    sessionStorage.setItem("agni-link-email", email.trim());
    if (name?.trim()) sessionStorage.setItem("agni-link-name", name.trim().slice(0, 80));
  } catch {
    // storage unavailable — verify page will ask for the email instead
  }
}

/**
 * Consume the email link: signs in an existing account or creates a new one.
 * Guest sessions upgrade in place so earlier links are kept.
 */
export async function completeEmailLink(email: string): Promise<{ user: User; isNewUser: boolean }> {
  const auth = getFirebaseAuth();
  const href = typeof window !== "undefined" ? window.location.href : "";
  const current = auth.currentUser;
  const before = current && !current.isAnonymous ? current.metadata.creationTime : undefined;
  if (current?.isAnonymous) {
    try {
      const cred = await linkWithCredential(current, EmailAuthProvider.credentialWithLink(email, href));
      return { user: cred.user, isNewUser: false };
    } catch {
      // email already has an account — sign in to it instead
    }
  }
  const cred = await signInWithEmailLink(auth, email, href);
  const created = cred.user.metadata.creationTime;
  const isNewUser = !before && created === cred.user.metadata.lastSignInTime;
  return { user: cred.user, isNewUser };
}

/** Set (or change) the signed-in user's password. */
export async function setUserPassword(password: string): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You need to be signed in to set a password.");
  await updatePassword(user, password);
}

/** Set the signed-in user's display name. */
export async function setUserName(name: string): Promise<void> {
  const user = getFirebaseAuth().currentUser;
  if (!user) return;
  await updateProfile(user, { displayName: name.trim().slice(0, 80) });
}

/** Password reset email — lands on /auth/reset on agni.cc.cd (via the bridge). */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(getFirebaseAuth(), email.trim(), actionCodeSettings("/auth/reset"));
  try {
    sessionStorage.setItem("agni-reset-email", email.trim());
  } catch {
    // best-effort
  }
}

/** Complete a password reset with the code from the email link. */
export async function completePasswordReset(oobCode: string, password: string): Promise<void> {
  await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
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
    case "auth/invalid-action-code":
    case "auth/expired-action-code":
      return "This link has expired or was already used. Request a new one.";
    case "auth/requires-recent-login":
      return "For security, sign in again before changing that.";
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
