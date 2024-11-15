"use client";

import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/firebase/client";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Errore nel logout:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white dark:bg-gray-900">
      <div className="text-lg font-bold">Logo</div>

      {user ? (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700"
          >
            <FaUserCircle className="text-white w-6 h-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
              <button
                onClick={() => router.push("/profile")}
                className="w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Impostazioni
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}

          <p>Benvenuto, {user.displayName || "Utente"}</p>
        </div>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
