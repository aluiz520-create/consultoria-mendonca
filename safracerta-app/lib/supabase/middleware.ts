import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAppRoute = request.nextUrl.pathname.startsWith("/app");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

  if (!user && isAppRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/dashboard";
    return NextResponse.redirect(url);
  }

  const isPlanoRoute = request.nextUrl.pathname.startsWith("/app/configuracoes");

  if (user && isAppRoute && !isPlanoRoute) {
    const { data: perfil } = await supabase.from("users").select("account_id").eq("id", user.id).single();

    if (perfil) {
      const { data: assinatura } = await supabase
        .from("assinaturas")
        .select("status, created_at")
        .eq("account_id", perfil.account_id)
        .single();

      if (assinatura) {
        // Redireciona para plano se atrasada ou cancelada
        if (["atrasada", "cancelada"].includes(assinatura.status)) {
          const url = request.nextUrl.clone();
          url.pathname = "/app/configuracoes/plano";
          return NextResponse.redirect(url);
        }

        // Redireciona se trial expirou (30 dias)
        if (assinatura.status === "trial" && assinatura.created_at) {
          const criadoEm = new Date(assinatura.created_at);
          const agora = new Date();
          const diasDecorridos = Math.floor((agora.getTime() - criadoEm.getTime()) / (1000 * 60 * 60 * 24));

          if (diasDecorridos >= 30) {
            const url = request.nextUrl.clone();
            url.pathname = "/app/configuracoes/plano";
            return NextResponse.redirect(url);
          }
        }
      }
    }
  }

  return response;
}
