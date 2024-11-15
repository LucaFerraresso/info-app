"use client";

import { Edit, FileText } from "lucide-react"; // Aggiungi le icone per i pulsanti
import { redirect } from "next/navigation";

export default function Page() {
  const handleClickNotes = () => {
    redirect("/notes"); // Redirect alla pagina delle note
  };

  const handleClickLogin = () => {
    redirect("/login"); // Redirect alla pagina degli articoli
  };

  return (
    <div className="relative min-h-screen  text-foreground flex flex-col items-center justify-center space-y-8 transition-all duration-300">
      {/* Copertura di benvenuto */}
      <div
        className="absolute top-0 left-0 right-0 h-72 bg-cover bg-center opacity-90 transition-all duration-500"
        style={{ backgroundImage: "url(/images/welcome-cover.jpg)" }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl font-bold leading-tight mb-4 transition-all duration-300">
          Benvenuto nel tuo Dashboard
        </h1>
        <p className="text-lg mb-8 transition-all duration-300">
          Esplora le tue note o articoli, scegli cosa fare ora.
        </p>

        {/* Pulsanti di navigazione */}
        <div className="flex space-x-6 justify-center">
          <button
            onClick={handleClickNotes}
            className="bg-primary text-primary-foreground py-3 px-6 rounded-md shadow-md hover:bg-primary-foreground hover:text-primary transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
          >
            <Edit /> <span>Le tue Note</span>
          </button>
          <button
            onClick={handleClickLogin}
            className="bg-secondary text-secondary-foreground py-3 px-6 rounded-md shadow-md hover:bg-secondary-foreground hover:text-secondary transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
          >
            <FileText /> <span>Login (providers)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
