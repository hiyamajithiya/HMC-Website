export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // HMC Club has its own layout per page - no shared header/footer from main site
  return <>{children}</>
}
