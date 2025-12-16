import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next = url.searchParams.get('next');

  return new NextResponse(`
    <h1>/auth/confirm Route Hit Successfully!</h1>
    <p>Token Hash: ${token_hash ? token_hash.substring(0, 20) + '...' : 'missing'}</p>
    <p>Type: ${type || 'missing'}</p>
    <p>Next: ${next || 'missing'}</p>
    <p>This proves the route works. Now revert to full code and check Netlify Function logs for the exact verifyOtp error.</p>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}