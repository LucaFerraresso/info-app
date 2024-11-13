"use client";
import { Edit, TrashIcon, Loader2 } from "lucide-react"; // Aggiunto il Loader
import { useEffect, useState } from "react";

// Funzione per creare una nuova nota (invocata tramite API)
async function createNote(title: string) {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    console.error("Errore nella creazione della nota:", data.error);
    return null;
  }
}

// Funzione per eliminare una nota (invocata tramite API)
async function deleteNote(id: number) {
  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    console.error("Errore nell'eliminazione della nota:", data.error);
    return null;
  }
}

// Funzione per ottenere paginamento delle note
async function fetchNotes(page: number, limit: number) {
  const response = await fetch(`/api/notes?page=${page}&limit=${limit}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error("Errore nel recupero delle note");
    return [];
  }
}

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Stato per il loading

  const limit = 5;

  // Funzione per caricare le note con paginamento
  const fetchNotesData = async () => {
    setIsLoading(true); // Mostra il loader quando inizia il fetch
    const data = await fetchNotes(page, limit);
    setNotes(data.notes);
    setTotalPages(data.totalPages);
    setIsLoading(false); // Nascondi il loader dopo aver caricato i dati
  };

  // Funzione per gestire la creazione della nota
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNoteTitle.trim()) {
      console.error("Il titolo non può essere vuoto");
      return;
    }

    setIsLoading(true); // Mostra il loader
    await createNote(newNoteTitle);
    setNewNoteTitle(""); // Resetta il campo del titolo
    fetchNotesData(); // Ricarica le note dopo la creazione
  };

  // Funzione per gestire l'eliminazione della nota
  const handleDeleteNote = async (id: number) => {
    setIsLoading(true); // Mostra il loader
    await deleteNote(id);
    fetchNotesData(); // Ricarica le note dopo l'eliminazione
  };

  // Carica le note quando la pagina si carica
  useEffect(() => {
    fetchNotesData();
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-600">
        Le tue note
      </h1>

      {/* Modulo per creare una nuova nota */}
      <form onSubmit={handleCreateNote} className="flex items-center gap-4">
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Aggiungi una nuova nota"
          className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
        />
        <button
          type="submit"
          aria-label="Crea nuova nota"
          className="bg-green-600 text-white py-2 px-4 rounded-md flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" /> Caricamento...
            </>
          ) : (
            <>
              Nuova Nota <Edit />
            </>
          )}
        </button>
      </form>

      {/* Lista delle note */}
      <ul className="space-y-4">
        {notes.length === 0 ? (
          <li className="text-center text-gray-500 dark:text-gray-400">
            Nessuna nota disponibile
          </li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              className="p-4 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {note.title}
                </h2>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  aria-label="Elimina nota"
                  className="text-red-500 hover:text-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <TrashIcon />
                  )}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Paginazione */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-white">
          Pagina {page} di {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || isLoading}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
