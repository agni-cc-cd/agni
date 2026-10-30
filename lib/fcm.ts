"use client";

/**
 * Firebase Cloud Messaging hooks. The notification channel is wired but
 * intentionally lightweight: call `registerMessaging()` after sign-in to get
 * a device token, and `onForegroundMessage()` to handle pushes in-page.
 *
 * Requires a `firebase-messaging-sw.js` service worker in /public and FCM
 * enabled in the Firebase console (Project settings → Cloud Messaging).
 */
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getFirebaseApp } from "./firebase-client";

export async function registerMessaging(): Promise<string | null> {
  if (!(await isSupported())) return null;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
  }
  const messaging = getMessaging(getFirebaseApp());
  return getToken(messaging).catch(() => null);
}

export function onForegroundMessage(handler: (payload: unknown) => void): () => void {
  if (typeof window === "undefined") return () => {};
  let unsubscribe = () => {};
  isSupported().then((ok) => {
    if (!ok) return;
    unsubscribe = onMessage(getMessaging(getFirebaseApp()), handler);
  });
  return () => unsubscribe();
}
