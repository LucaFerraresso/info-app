"use client";

import { createClient } from "@/utils/supabase/client";

import { redirect } from "next/navigation";

export default function Page() {
  const supabase = createClient();
  const handleClick = () => {
    redirect("/notes");
  };

  return (
    <>
      <div>
        <h1>benvenuto</h1>
        <button onClick={handleClick}>notes</button>
      </div>
    </>
  );
}
