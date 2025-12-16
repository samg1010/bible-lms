// src/app/auth/confirm/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  let token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as 'email' | 'signup' | null;
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  console.log('Magic link hit:', { raw_token_hash: token_hash, type, next });

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL('/auth/error?message=missing_params', requestUrl));
  }

  // Strip "pkce_" prefix if present (required for current PKCE magic links)
  if (token_hash.startsWith('pkce_')) {
    token_hash = token_hash.slice(5); // Remove first 5 characters
    console.log('Stripped pkce_ prefix, using hash:', token_hash.substring(0, 20) + '...');
  }

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
          } catch (error) {
            console.error('Cookie set error:', error);
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) {
    console.error('Verify OTP FAILED:', error.message);
    return NextResponse.redirect(new URL('/auth/error?message=invalid_token', requestUrl));
  }

  console.log('Verify OTP SUCCESS — redirecting to', next);
  return NextResponse.redirect(new URL(next, requestUrl));
}