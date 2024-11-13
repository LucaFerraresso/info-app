import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const user = await supabase.auth.getUser();

    // Se l'utente è autenticato e sta cercando di andare su /sign-in, redireziona verso la homepage
    if (request.nextUrl.pathname === "/sign-in" && !user.error) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Se l'utente non è autenticato e sta cercando di accedere alla homepage, redireziona verso il login
    if (request.nextUrl.pathname === "/" && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Se l'utente è autenticato, lascia andare alla homepage senza fare redirect
    if (request.nextUrl.pathname === "/" && !user.error) {
      return NextResponse.next(); // Non fare nulla, continua a caricare la homepage
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
