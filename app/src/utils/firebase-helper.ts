import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import type { environment } from "./types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let firestore: Firestore;
let analytics: any;

/**
 * Initializes Firebase. If the config is empty, it will log an error.
 */
export function initializeFirebase() {
  const environment = getEnvironment();
  if (Object.values(firebaseConfig).some((value) => value === undefined)) {
    console.error("Firebase config is empty. Please check your .env file.");
    return;
  }

  app = initializeApp(firebaseConfig);

  initializeFirestoreInstance();
  initializeAnalytics();

  console.debug("Firebase initialized.");
}

/**
 * Returns a Firestore instance. If it's not initialized yet, it will initialize it.
 *
 * @returns Firestore instance
 */
export function getFirestoreInstance() {
  if (firestore === undefined) {
    initializeFirestoreInstance();
  }

  return firestore;
}

/**
 * Returns a Firebase Analytics instance.
 *
 * @returns Firebase Analytics instance
 */
export function getAnalyticsInstance() {
  if (analytics === undefined) {
    initializeAnalytics();
  }
  return analytics;
}

/**
 * Returns the environment the app is running on. If the hostname is "localhost" or "
 *
 * @returns "development" if the app is running on localhost, "production" otherwise
 *
 * @returns "test" if the app is running on "test"
 *
 * @returns "production" if the app is running on any other hostname
 */
function getEnvironment(): environment {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "development";
  }
  return "production";
}

/**
 * Initializes Firestore. If the app is running on localhost, it will connect to the Firestore emulator.
 * If the app is running on localhost, you can force the emulator to be disabled by adding
 * `?disableEmulator=true` to the URL.
 */
function initializeFirestoreInstance() {
  initializeFirestore(app, {
    localCache: persistentLocalCache(
      /*settings*/
      {
        tabManager: persistentMultipleTabManager(),
      }
    ),
  });

  firestore = getFirestore(app);

  const urlParams = new URLSearchParams(window.location.search);
  const disableEmulator = urlParams.get("disableEmulator");
  const environment = getEnvironment();

  if (environment === "development" && disableEmulator !== "true") {
    connectFirestoreEmulator(firestore, "127.0.0.1", 5002);
    console.debug("Firestore emulator connected.");
  }

  console.debug("Firestore initialized.");
}

/**
 * Initializes Firebase Analytics. It will only initialize it if the app is running on production.
 */
function initializeAnalytics() {
  const environment = getEnvironment();

  if (environment === "production") {
    analytics = getAnalytics(app);
    console.debug("Firebase Analytics initialized.");
  } else {
    console.debug(
      "Firebase Analytics not initialized because the app is not running on production."
    );
  }

  analytics = getAnalytics(app);
}
