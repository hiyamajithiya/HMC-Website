import { SessionProvider } from '@/components/providers/SessionProvider'
import { AdminLayoutContent } from '@/components/admin/AdminLayoutContent'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}
