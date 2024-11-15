"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase/client";
import {
  updateProfile,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [newName, setNewName] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    if (newName && user) {
      try {
        await updateProfile(user, { displayName: newName });
        setUser({ ...user, displayName: newName });
        alert("Nome aggiornato con successo!");
      } catch (error) {
        alert("Errore nell'aggiornamento del nome.");
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword && user) {
      try {
        await updatePassword(user, newPassword);
        alert("Password aggiornata con successo!");
      } catch (error) {
        alert("Errore nell'aggiornamento della password.");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login"); // Redirect alla pagina di login se l'utente non è autenticato
      }
    });
    return () => unsubscribe(); // Pulizia dell'osservatore
  }, [router]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Profilo
      </h2>

      <div>
        <h3 className="text-lg font-semibold">Nome:</h3>
        <p>{user?.displayName || "Non disponibile"}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Email:</h3>
        <p>{user?.email || "nessuna email"}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Modifica Nome:</h3>
        <input
          type="text"
          placeholder="Nuovo nome"
          className="w-full p-2 border rounded-lg"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={handleUpdateProfile}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Aggiorna Nome
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Modifica Password:</h3>
        <input
          type="password"
          placeholder="Nuova password"
          className="w-full p-2 border rounded-lg"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleUpdatePassword}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Aggiorna Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
