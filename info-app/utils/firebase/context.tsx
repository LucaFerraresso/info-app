"use client"; // Assicurati di usare "use client" se stai utilizzando Next.js 13 con la modalità server-side rendering

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/utils/firebase/client"; // Assicurati di importare correttamente Firebase
import { onAuthStateChanged, User } from "firebase/auth";

// 1. Creiamo un tipo per il contesto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOutUser: () => void;
}

// 2. Creiamo il contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creiamo il provider che gestisce lo stato dell'utente
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Errore nel logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Crea un hook personalizzato per consumare il contesto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
  }
  return context;
};
