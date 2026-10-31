/**
 * Firebase public web config (safe to ship to the browser — Google treats
 * these as identifiers, not secrets). Project: agni-dd35c.
 */
export const firebaseConfig = {
  projectId: "agni-dd35c",
  appId: "1:964435280173:web:01006c61febc5108c753a4",
  storageBucket: "agni-dd35c.firebasestorage.app",
  apiKey: "AIzaSyDs8iqRF10zMbeCTfuOZoZ7KM9JZwbBfhk",
  authDomain: "agni-dd35c.firebaseapp.com",
  messagingSenderId: "964435280173",
  measurementId: "G-PW2B5FM3SG",
} as const;

/**
 * Web Push certificate (VAPID public key). Generate one in the Firebase
 * console: Project settings → Cloud Messaging → Web Push certificates →
 * Generate key pair, then paste the key string here. Web push registration
 * is skipped until it is set.
 */
export const VAPID_KEY = "";
