import Link from "next/link"
import { Facebook, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react"
import { SITE_INFO, REGULATORY_LINKS } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Firm Info */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-secondary-light">
              {SITE_INFO.name}
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Chartered Accountants
            </p>
            <div className="space-y-2 text-sm">
              <p>ICAI Membership: {SITE_INFO.icaiMembership}</p>
              <p>FRN: {SITE_INFO.firmRegistrationNo}</p>
              <p>Established: {SITE_INFO.yearEstablished}</p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Connect With Us</h4>
              <div className="flex space-x-3">
                <a
                  href={SITE_INFO.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary-light transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={SITE_INFO.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary-light transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={SITE_INFO.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-secondary-light transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-light">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-secondary-light transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-secondary-light transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/resources/blog" className="hover:text-secondary-light transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary-light transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-secondary-light transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-light">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources/calculators" className="hover:text-secondary-light transition-colors">
                  Tax Calculators
                </Link>
              </li>
              <li>
                <Link href="/resources/compliance-calendar" className="hover:text-secondary-light transition-colors">
                  Compliance Calendar
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-secondary-light transition-colors">
                  Automation Tools
                </Link>
              </li>
              <li>
                <Link href="/resources/downloads" className="hover:text-secondary-light transition-colors">
                  Downloads
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-sm">Regulatory Links</h4>
              <ul className="space-y-1 text-xs">
                {REGULATORY_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-secondary-light transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-light">
              Contact Information
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary-light" />
                <div>
                  <p>{SITE_INFO.address.line1}</p>
                  <p>{SITE_INFO.address.line2}</p>
                  <p>{SITE_INFO.address.city}</p>
                  <p>{SITE_INFO.address.state} - {SITE_INFO.address.pincode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-secondary-light" />
                <a
                  href={`tel:${SITE_INFO.phone.primary}`}
                  className="hover:text-secondary-light transition-colors"
                >
                  {SITE_INFO.phone.primary}
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-secondary-light" />
                <a
                  href={`mailto:${SITE_INFO.email.primary}`}
                  className="hover:text-secondary-light transition-colors"
                >
                  {SITE_INFO.email.primary}
                </a>
              </div>

              <div className="text-xs text-white/70 mt-4">
                <p>{SITE_INFO.officeHours}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-white/80">
          <p>
            &copy; {currentYear} {SITE_INFO.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-secondary-light transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms-of-use" className="hover:text-secondary-light transition-colors">
              Terms of Use
            </Link>
            <span>|</span>
            <Link href="/disclaimer" className="hover:text-secondary-light transition-colors">
              Disclaimer
            </Link>
            <span>|</span>
            <Link href="/cookie-policy" className="hover:text-secondary-light transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-white/60 mt-6">
          <p>Website designed in compliance with ICAI Guidelines</p>
        </div>
      </div>
    </footer>
  )
}
