import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Estrae l'ID dalla URL

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
    });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete note" }), {
      status: 500,
    });
  }
}

// **PATCH**: Aggiorna lo stato di una nota
export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Estrae l'ID dalla URL

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
    });
  }

  try {
    const body = await request.json(); // Estrae il corpo della richiesta
    const { status } = body; // Destruttura lo stato dalla richiesta

    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
      });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .update({ status }) // Aggiorna lo stato della nota
      .eq("id", id); // Identifica la nota tramite l'ID

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update note" }), {
      status: 500,
    });
  }
}
