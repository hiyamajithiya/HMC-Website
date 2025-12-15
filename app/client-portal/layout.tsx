export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Client portal has its own layout per page - no shared header/footer from main site
  return <>{children}</>
}
