// **DELETE**: Elimina una nota
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
