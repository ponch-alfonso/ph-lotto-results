import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, Firestore } from "firebase/firestore";

// TODO: Move this.
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCP5nIdc-YjC3RVvcI93NZezmce1UfaUNU",
  authDomain: "daily-pcso.firebaseapp.com",
  projectId: "daily-pcso",
  storageBucket: "daily-pcso.appspot.com",
  messagingSenderId: "511100957286",
  appId: "1:511100957286:web:eb2ab43e5c511c94edb3a7",
  measurementId: "G-CXHR50V3CP"
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