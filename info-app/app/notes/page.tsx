"use client";
import { useCallback, useState, useEffect } from "react";
import { Loader2, TrashIcon } from "lucide-react";

// Funzione generica per fare richieste API
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    const data = response.status !== 204 ? await response.json() : null;
    if (!response.ok)
      throw new Error(data?.error || "Errore nella richiesta API");
    return data;
  } catch (error) {
    console.error("API error:", error);
    return null;
  }
};

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ottimizzazione delle chiamate API con useCallback
  const fetchNotesData = useCallback(async () => {
    setIsLoading(true);
    const data = await apiRequest(`/api/notes`);
    if (data && data.notes) {
      setNotes(data.notes);
    }
    setIsLoading(false);
  }, []);

  // Aggiungi una nuova nota
  const handleCreateNote = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newNoteTitle.trim()) {
        console.error("Il titolo non può essere vuoto");
        return;
      }

      setIsLoading(true);
      const newNote = await apiRequest("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newNoteTitle }),
      });

      if (newNote) {
        setNotes((prevNotes) => [newNote, ...prevNotes]); // Aggiungi la nuova nota senza fare una nuova richiesta
      }
      setNewNoteTitle(""); // Reset del titolo
      setIsLoading(false);
    },
    [newNoteTitle]
  );

  // Aggiorna lo stato della nota
  const handleUpdateStatus = useCallback(async (id: string, status: string) => {
    setIsLoading(true);
    const updatedNote = await apiRequest(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (updatedNote) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id ? { ...note, status: updatedNote.status } : note
        )
      );
    }
    setIsLoading(false);
  }, []);

  // Elimina una nota
  const handleDeleteNote = useCallback(async (id: string) => {
    setIsLoading(true);
    const result = await apiRequest(`/api/notes/${id}`, { method: "DELETE" });

    if (result) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id)); // Rimuovi la nota senza fare una nuova richiesta
    }
    fetchNotesData();
    setIsLoading(false);
  }, []);

  // Carica le note inizialmente
  useEffect(() => {
    fetchNotesData();
  }, []); // `fetchNotesData` è memorizzato e non cambia

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6 space-y-6 dark:bg-background dark:text-white">
      <h1 className="text-3xl font-bold text-center text-primary dark:text-white">
        Le tue note
      </h1>

      {/* Form per la creazione di una nuova nota */}
      <form onSubmit={handleCreateNote}>
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Aggiungi una nuova nota"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <button
          className="bg-primary text-white p-2 mt-4 w-full"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Crea nota"}
        </button>
      </form>
      <ul className="space-y-4">
        {isLoading ? (
          <p className="text-center">Caricamento in corso...</p>
        ) : notes.length === 0 ? (
          <p className="text-center">Nessuna nota disponibile</p>
        ) : (
          notes.map((note) => (
            <li
              key={note.id} // Chiave unica per ogni elemento della lista
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <p className="text-xl font-semibold">{note.title}</p>
                <p className="text-sm text-gray-500">{note.status}</p>
              </div>

              {/* Selezione dello stato */}
              <div className="flex space-x-4">
                <select
                  value={note.status[0]}
                  onChange={(e) => handleUpdateStatus(note.id, e.target.value)}
                  className="border p-2"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Undone">Undone</option>
                  <option value="Done">Done</option>
                </select>

                <button
                  className="text-red-500"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
