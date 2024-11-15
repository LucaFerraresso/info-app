import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "./client";

// Funzione per caricare l'immagine e ottenere l'URL
export const uploadProfileImage = async (file: File) => {
  const storage = getStorage();
  const user = auth.currentUser;
  if (!user) throw new Error("Utente non autenticato");

  const imageRef = ref(storage, `profileImages/${user.uid}/${file.name}`);
  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);
  return url;
};
