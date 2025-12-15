// src/app/auth/confirm/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as 'signup' | 'email' | 'recovery' | null;
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';  // Change to your desired redirect

  // Await cookies() since it's async in Next.js 15+
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore if called from a Server Component (no response to set cookies on)
          }
        },
      },
    }
  );

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl));
    }
  }

  // Invalid or missing token → redirect to error page
  return NextResponse.redirect(new URL('/auth/error', requestUrl));
}