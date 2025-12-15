export default function AuthError() {
  return (
    <div className="p-8 text-center">
      <h1>Login Failed</h1>
      <p>The link may be expired or invalid. Please request a new magic link.</p>
      <a href="/">← Back to Home</a>
    </div>
  );
}