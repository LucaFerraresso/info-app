import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth";
import { auth } from "@/utils/firebase/client";

export function middleware(request: { url: string | URL | undefined }) {
  const user = auth.currentUser;

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/notes"], // Proteggi solo le rotte che richiedono l'autenticazione
};
