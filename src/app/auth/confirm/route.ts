// src/app/auth/confirm/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'signup' | 'magiclink' | 'recovery' | 'email' | null;
  const next = searchParams.get('next') ?? '/dashboard';  // Redirect to dashboard after login

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (error) {
      console.error('Verify OTP error:', error);  // Check Netlify logs for this
      return NextResponse.redirect(new URL('/auth/error?message=invalid_link', request.url));
    }

    // Success! Session is now set via cookies
    return NextResponse.redirect(new URL(next, request.url));
  }

  // No token → bad link
  return NextResponse.redirect(new URL('/auth/error?message=no_token', request.url));
}