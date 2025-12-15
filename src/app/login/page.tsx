'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient'; // Client-side Supabase

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Magic link sent! Check your email.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />
      <button type="submit">Send Magic Link</button>
      <p>{message}</p>
    </form>
  );
}