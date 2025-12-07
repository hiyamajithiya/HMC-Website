"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, SITE_INFO } from "@/lib/constants"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/95 backdrop-blur-sm py-4"
      )}
    >
      {/* Top Bar - Desktop Only */}
      <div className="hidden lg:block bg-primary text-white py-2">
        <div className="container-custom">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href={`tel:${SITE_INFO.phone.primary}`} className="flex items-center hover:text-secondary-light transition-colors">
                <Phone className="h-4 w-4 mr-2" />
                {SITE_INFO.phone.primary}
              </a>
              <a href={`mailto:${SITE_INFO.email.primary}`} className="flex items-center hover:text-secondary-light transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                {SITE_INFO.email.primary}
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs">ICAI Membership: {SITE_INFO.icaiMembership}</span>
              <span className="text-xs">FRN: {SITE_INFO.firmRegistrationNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-heading font-bold text-primary">
              {SITE_INFO.name}
            </span>
            <span className="text-xs text-text-muted">Chartered Accountants</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {NAV_ITEMS.map((item) =>
                  item.submenu ? (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuTrigger className="font-body">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-white shadow-lg border border-border-light">
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary text-text-primary",
                                    pathname === subItem.href && "bg-primary/20 text-primary font-semibold"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subItem.label}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.label}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                            pathname === item.href && "bg-accent"
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/book-appointment">
              <Button className="bg-secondary hover:bg-secondary-dark text-white">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 animate-slide-down">
            <nav className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) =>
                item.submenu ? (
                  <div key={item.label} className="space-y-2">
                    <div className="font-semibold text-primary px-3 py-2 flex items-center justify-between">
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="pl-6 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors",
                            pathname === subItem.href && "bg-accent font-semibold"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md hover:bg-accent transition-colors",
                      pathname === item.href && "bg-accent font-semibold"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link
                href="/book-appointment"
                className="mx-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full bg-secondary hover:bg-secondary-dark text-white">
                  Book Appointment
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
