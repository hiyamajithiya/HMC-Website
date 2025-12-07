"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      // Show consent banner after a short delay
      setTimeout(() => setShowConsent(true), 1000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setShowConsent(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined")
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary shadow-lg p-4 md:p-6 animate-slide-up">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Cookie Consent</h3>
            <p className="text-sm text-text-secondary">
              We use cookies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. By clicking "Accept", you consent to our use of cookies.{" "}
              <Link href="/cookie-policy" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={declineCookies}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Decline
            </Button>
            <Button
              onClick={acceptCookies}
              className="bg-primary hover:bg-primary-light text-white"
            >
              Accept Cookies
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
