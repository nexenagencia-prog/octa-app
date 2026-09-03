import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

function loginError(request: NextRequest, message: string) {
  const url = new URL('/login', request.url);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  if (!supabase) return loginError(request, 'Login com Google temporariamente indisponível.');

  // A visita explícita a /login deve permitir trocar/criar conta, mesmo se houver sessão anterior.
  await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);

  const origin = new URL(request.url).origin;
  const redirectTo = `${origin}/auth/callback?next=/`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error || !data.url) {
    return loginError(request, error?.message || 'Não foi possível iniciar o acesso com Google.');
  }

  return NextResponse.redirect(data.url);
}
