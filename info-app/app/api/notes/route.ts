import { createClient } from "@/utils/supabase/server";

//chiamata get, per renderizzare le note nel database
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("notes").select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
