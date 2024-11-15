import { NextRequest, NextResponse } from "next/server";
import {
  getAuth,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { loginUser, registerUser } from "@/utils/firebase/auth";
import { uploadProfileImage } from "@/utils/firebase/storage";

const auth = getAuth();

export async function POST(req: NextRequest) {
  const { type, email, password, newPassword, displayName, profileImage } =
    await req.json();

  try {
    if (type === "register") {
      const userCredential = await registerUser(email, password);
      return NextResponse.json({ user: userCredential.user }, { status: 200 });
    }

    if (type === "login") {
      const userCredential = await loginUser(email, password);
      return NextResponse.json({ user: userCredential.user }, { status: 200 });
    }

    if (type === "updateProfile") {
      // Aggiornamento del nome
      const user = auth.currentUser;
      if (user) {
        if (displayName) {
          await updateProfile(user, { displayName });
        }

        if (profileImage) {
          // Funzione per caricare l'immagine e ottenere l'URL
          const imageUrl = await uploadProfileImage(profileImage);
          await updateProfile(user, { photoURL: imageUrl });
        }

        return NextResponse.json({ user: user }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Utente non trovato" },
          { status: 404 }
        );
      }
    }

    if (type === "updatePassword") {
      const user = auth.currentUser;
      if (user && password && newPassword) {
        const credential = EmailAuthProvider.credential(
          user.email || "user@test.com",
          password
        );
        await reauthenticateWithCredential(user, credential); // Ri-autenticazione
        await updatePassword(user, newPassword); // Aggiorna la password
        return NextResponse.json(
          { message: "Password aggiornata" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Credenziali non valide" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Metodo non consentito" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Errore:", error);
    return NextResponse.json(
      { error: error || "Errore sconosciuto" },
      { status: 400 }
    );
  }
}
