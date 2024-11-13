"use client";
import { useEffect, useState } from "react";

// Funzione per creare una nuova nota (invocata tramite API)
async function createNote(title: string) {
  const response = await fetch("/api/notes", {
    // URL della nuova API
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }), // Passiamo il titolo come corpo della richiesta
  });

  const data = await response.json();

  if (response.ok) {
    console.log("Nota creata:", data);
    return data;
  } else {
    console.error("Errore nella creazione della nota:", data.error);
    return null;
  }
}

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState(""); // Stato per il titolo della nuova nota

  // Funzione per caricare le note esistenti
  const fetchNotes = async () => {
    const response = await fetch("/api/notes"); // GET per recuperare le note
    if (response.ok) {
      const data = await response.json();
      setNotes(data);
    } else {
      console.error("Errore nel recupero delle note");
    }
  };

  // Carica le note quando la pagina si carica
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Le tue note</h1>

      <ul>
        {notes.length === 0 ? (
          <li>No notes available</li>
        ) : (
          notes.map((note) => (
            <li key={note.id}>
              <h2>{note.title}</h2>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
