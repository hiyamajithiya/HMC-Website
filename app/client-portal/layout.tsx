import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppButton } from "@/components/common/WhatsAppButton"
import { ScrollToTop } from "@/components/common/ScrollToTop"
import { CookieConsent } from "@/components/common/CookieConsent"

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20 lg:pt-32">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <CookieConsent />
    </>
  )
}
