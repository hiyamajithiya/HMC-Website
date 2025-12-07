"use client"

import { MessageCircle } from "lucide-react"
import { SITE_INFO } from "@/lib/constants"

export function WhatsAppButton() {
  const whatsappMessage = encodeURIComponent(
    "Hello, I am contacting from your website regarding..."
  )
  const whatsappUrl = `https://wa.me/${SITE_INFO.whatsapp}?text=${whatsappMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 group no-print"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat on WhatsApp
      </span>
    </a>
  )
}
