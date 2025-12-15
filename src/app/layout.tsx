import './globals.css'
import { SessionProvider } from '@/hooks/useSession'

export const metadata = {
  title: 'Bible LMS',
  description: 'Bible Learning Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
