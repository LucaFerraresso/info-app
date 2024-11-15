import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { auth } from "./client";

// Funzione per registrare un utente
export const registerUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Funzione per loggare un utente
export const loginUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Funzione per effettuare il logout
export const logoutUser = async () => {
  await signOut(auth);
};
