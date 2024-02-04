import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  Firestore,
} from "firebase/firestore";

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
let db: Firestore;

export function initializeDb() {
  if (Object.values(firebaseConfig).some((value) => value === undefined)) {
    console.error("Firebase config is empty. Please check your .env file.");
    return;
  }

  app = initializeApp(firebaseConfig);
  console.debug("Firebase initialized.");
}

export function getDb() {
  if (db === undefined) {
    db = getFirestore(app);

    const urlParams = new URLSearchParams(window.location.search);
    const disableEmulator = urlParams.get("disableEmulator");

    if (
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1") &&
      disableEmulator === "false"
    ) {
      connectFirestoreEmulator(db, "127.0.0.1", 5002);
      console.debug("Firestore emulator connected.");
    } else {
      enableIndexedDbPersistence(db).catch((err) => {
        // Do nothing here - we won't be able to cache the data,
        // but that  should not block the user.
        console.debug(err);
      });
    }

    console.debug("Firestore initialized.");
  }

  return db;
}
