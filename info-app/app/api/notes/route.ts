import { db } from "@/utils/firebase/client";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  startAfter,
  setDoc,
  doc,
} from "firebase/firestore";

const notesCollection = collection(db, "notes");

export async function GET(request: Request) {
  try {
    const snapshot = await getDocs(
      query(notesCollection, orderBy("createdAt"), limit(20)) // Ottieni tutte le note senza paginazione
    );
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify({ notes }), { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch notes" }), {
      status: 500,
    });
  }
}
export async function POST(request: Request) {
  const { title } = await request.json();

  if (!title) {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400,
    });
  }

  const newNote = {
    title,
    status: ["Undone"], // Stato iniziale come array
    createdAt: new Date(), // Data di creazione
  };

  const docRef = doc(notesCollection);
  await setDoc(docRef, newNote);

  return new Response(JSON.stringify(newNote), { status: 201 });
}
