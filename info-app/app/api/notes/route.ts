import { createClient } from "@/utils/supabase/server";

// **GET**: Recupera tutte le note
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "5");

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("notes")
    .select("*", { count: "exact" })
    .range((page - 1) * limit, page * limit - 1);

  // Verifica se count è null e fornisce un valore di fallback di 0
  const totalCount = count ?? 0;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      notes: data,
      totalPages: Math.ceil(totalCount / limit), // Calcola totalPages usando totalCount
    }),
    { status: 200 }
  );
}

// **POST**: Crea una nuova nota
export async function POST(request: Request) {
  const { title } = await request.json(); // Ottieni il titolo dal corpo della richiesta

  if (!title) {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400,
    });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("notes").insert([{ title }]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create note" }), {
      status: 500,
    });
  }
}
