/* Firebase Cloud Messaging service worker (background notifications).
   Requires FCM enabled in the Firebase console (Project settings → Cloud Messaging). */
importScripts("https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js");

firebase.initializeApp({
  projectId: "agni-dd35c",
  appId: "1:964435280173:web:01006c61febc5108c753a4",
  apiKey: "AIzaSyDs8iqRF10zMbeCTfuOZoZ7KM9JZwbBfhk",
  authDomain: "agni-dd35c.firebaseapp.com",
  messagingSenderId: "964435280173",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? "agni", {
    body: body ?? "",
    icon: "/favicon.ico",
  });
});
