import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppButton } from "@/components/common/WhatsAppButton"
import { ScrollToTop } from "@/components/common/ScrollToTop"
import { CookieConsent } from "@/components/common/CookieConsent"
import { SITE_INFO } from "@/lib/constants"

export const metadata: Metadata = {
  title: {
    default: `${SITE_INFO.name} | Chartered Accountants in Ahmedabad | Since ${SITE_INFO.yearEstablished}`,
    template: `%s | ${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: [
    "Chartered Accountant Ahmedabad",
    "CA firm Thaltej",
    "Income Tax Consultant Gujarat",
    "Company Audit Ahmedabad",
    "FFMC Compliance",
    "GST Services",
    "AI Automation CA",
  ],
  authors: [{ name: SITE_INFO.proprietor }],
  creator: SITE_INFO.name,
  publisher: SITE_INFO.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(`https://${SITE_INFO.domain}`),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_INFO.name,
    description: SITE_INFO.description,
    url: `https://${SITE_INFO.domain}`,
    siteName: SITE_INFO.name,
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification here when available
    // google: "your-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 lg:pt-32">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
        <CookieConsent />
      </body>
    </html>
  )
}
