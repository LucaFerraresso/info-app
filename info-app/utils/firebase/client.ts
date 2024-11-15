import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Recuperiamo le configurazioni da variabili di ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inizializza Firebase Authentication
const auth = getAuth(app);

export {
  auth,
  db,
  getAuth,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
};
