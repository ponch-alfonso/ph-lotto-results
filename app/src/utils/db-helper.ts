import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let db: Firestore;

export function initializeDb() {
  app = initializeApp(firebaseConfig);
  console.debug('Firebase initialized.');
}

export function getDb() {
  if (db === undefined) {
    db = getFirestore(app);

    if (window.location.hostname === "localhost") {
      connectFirestoreEmulator(db, '127.0.0.1', 5002);
    } else {
      enableIndexedDbPersistence(db)
        .catch((err) => {
          // Do nothing here - we won't be able to cache the data, 
          // but that  should not block the user.
          console.debug(err);
        });
    }

    console.debug('Firestore initialized.');
  }


  return db;
}