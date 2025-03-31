"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GoldButton } from "@/components/ui/gold-button"
import { Scissors, Menu, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark backdrop-blur supports-[backdrop-filter]:bg-dark/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-gold" />
          <span className="font-bold font-playfair text-xl">Zer Barber</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold",
                pathname === link.href ? "text-gold" : "text-gray-300",
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/appointment">
                <GoldButton size="sm">Book Appointment</GoldButton>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-gray-300 hover:text-gold">
                  My Profile
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="text-gray-300 hover:text-gold">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-gold">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <GoldButton>Register</GoldButton>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-card border-b border-dark-border">
          <div className="container py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors hover:text-gold",
                  pathname === link.href ? "text-gold" : "text-gray-300",
                )}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/appointment" onClick={closeMenu}>
                  <GoldButton className="w-full">Book Appointment</GoldButton>
                </Link>
                <Link href="/profile" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-gold">
                    My Profile
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-gold"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-gold">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  <GoldButton className="w-full">Register</GoldButton>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

