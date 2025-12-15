import Link from 'next/link'

export default function AuthSwitch({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <div className="text-center mt-6">
      {mode === 'login' ? (
        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-purple-600 font-medium">
            Create one
          </Link>
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-600 font-medium">
            Sign in
          </Link>
        </p>
      )}
    </div>
  )
}
