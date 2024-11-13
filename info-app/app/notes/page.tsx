"use client";
import { Edit, TrashIcon, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// Funzione generica per fare richieste API
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Errore nella richiesta API");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 5;

  // Funzione per caricare le note con paginamento
  const fetchNotesData = async () => {
    setIsLoading(true);
    const data = await apiRequest(`/api/notes?page=${page}&limit=${limit}`);
    if (data) {
      setNotes(data.notes);
      setTotalPages(data.totalPages);
    }
    setIsLoading(false);
  };

  // Funzione per creare una nuova nota
  const handleCreateNote = async (e: React.FormEvent) => {
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
      setNotes((prevNotes) => [newNote, ...prevNotes]); // Aggiungi la nuova nota in cima alla lista
    }

    setNewNoteTitle("");
    fetchNotesData();
    setIsLoading(false);
  };

  // Funzione per eliminare una nota
  const handleDeleteNote = async (id: number) => {
    setIsLoading(true);
    const result = await apiRequest(`/api/notes/${id}`, { method: "DELETE" });

    if (result) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id)); // Rimuovi la nota dalla lista
    }
    fetchNotesData();
    setIsLoading(false);
  };

  // Funzione per aggiornare lo stato della nota
  const handleUpdateStatus = async (id: number, status: string) => {
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
    fetchNotesData();
    setIsLoading(false);
  };

  // Effettua il caricamento iniziale delle note
  useEffect(() => {
    fetchNotesData();
  }, [page]);

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6 space-y-6 dark:bg-background dark:text-white">
      <h1 className="text-3xl font-bold text-center text-primary dark:text-white">
        Le tue note
      </h1>

      {/* Form per la creazione di una nuova nota */}
      <form
        onSubmit={handleCreateNote}
        className="flex items-center gap-4 dark:text-white"
      >
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Aggiungi una nuova nota"
          className="flex-1 p-2 border border-border rounded-md dark:bg-card dark:text-white dark:border-card-foreground focus:outline-none transition duration-300 ease-in-out"
        />
        <button
          type="submit"
          aria-label="Crea nuova nota"
          className="bg-accent text-accent-foreground py-2 px-4 rounded-md flex items-center gap-2 hover:bg-accent-foreground hover:text-accent transition duration-300 ease-in-out"
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
      <ul className="space-y-4 min-h-[200px]">
        {notes.length === 0 ? (
          <li className="text-center text-muted dark:text-white">
            Nessuna nota disponibile
          </li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              className="p-4 border border-muted rounded-md shadow-sm dark:bg-card dark:border-card-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              <div className="flex justify-between items-center space-x-4">
                <h2 className="text-xl font-semibold text-primary dark:text-white">
                  {note.title}
                </h2>

                {/* Stato della nota (Fatto, Da fare, In progress) */}
                <div className="flex items-center gap-2">
                  <select
                    value={note.status || "da_fare"}
                    onChange={(e) =>
                      handleUpdateStatus(note.id, e.target.value)
                    }
                    disabled={isLoading}
                    className="p-2 border border-border rounded-md dark:bg-card dark:text-white dark:border-card-foreground focus:outline-none"
                  >
                    <option value="da_fare">Da fare</option>
                    <option value="in_progress">In progress</option>
                    <option value="fatto">Fatto</option>
                  </select>

                  {/* Elimina la nota */}
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    aria-label="Elimina nota"
                    className="text-destructive hover:text-destructive-foreground disabled:text-muted-foreground transition duration-200 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <TrashIcon />
                    )}
                  </button>
                </div>
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
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md disabled:opacity-50 hover:bg-accent-foreground hover:text-accent transition duration-200 ease-in-out"
        >
          Prev
        </button>
        <span className="text-muted dark:text-muted-foreground">
          Pagina {page} di {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || isLoading}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md disabled:opacity-50 hover:bg-accent-foreground hover:text-accent transition duration-200 ease-in-out"
        >
          Next
        </button>
      </div>

      {/* Home button */}
      <button
        onClick={() => redirect("/")}
        className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-foreground hover:text-primary transition duration-300 ease-in-out"
      >
        Home
      </button>
    </div>
  );
}
