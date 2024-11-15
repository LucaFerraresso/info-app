import { db, updateDoc, doc, deleteDoc } from "@/utils/firebase/client";

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Estrai l'ID dalla URL

  if (!id) {
    return new Response(JSON.stringify({ error: "ID non valido" }), {
      status: 400,
    });
  }

  const { status } = await request.json();

  // Assicurati che lo stato sia una stringa e che sia uno dei valori validi
  if (!["Done", "Undone", "In Progress"].includes(status)) {
    return new Response(JSON.stringify({ error: "Stato non valido" }), {
      status: 400,
    });
  }

  try {
    const noteRef = doc(db, "notes", id); // Ottieni il riferimento del documento
    await updateDoc(noteRef, { status }); // Aggiorna lo stato della nota
    return new Response(JSON.stringify({ id, status }), { status: 200 });
  } catch (error) {
    console.error("Errore durante l'aggiornamento della nota:", error);
    return new Response(
      JSON.stringify({ error: "Impossibile aggiornare la nota" }),
      { status: 500 }
    );
  }
}
// Funzione per la cancellazione
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Estrai l'ID dalla URL

  if (!id) {
    console.error("ID non valido per la cancellazione");
    return new Response(JSON.stringify({ error: "ID non valido" }), {
      status: 400,
    });
  }

  try {
    console.log("Cancellazione della nota con ID:", id);
    const noteRef = doc(db, "notes", id);
    await deleteDoc(noteRef);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Errore durante la cancellazione della nota:", error);
    return new Response(
      JSON.stringify({ error: "Impossibile cancellare la nota" }),
      { status: 500 }
    );
  }
}
