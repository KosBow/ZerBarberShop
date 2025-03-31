import Link from "next/link"
import { Scissors, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-dark-lighter border-t border-dark-border py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Scissors className="h-5 w-5 text-gold" />
            <span className="font-bold font-playfair text-xl">Zer Barber</span>
          </div>
          <p className="text-gray-400 text-sm">Professional haircuts and styling services for men and women.</p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-medium font-playfair text-lg mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Services
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Products
              </Link>
            </li>
            <li>
              <Link href="/appointment" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-gold transition-colors text-sm">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium font-playfair text-lg mb-4 text-white">Hours</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-400">Monday - Friday</span>
              <span className="text-white">9am - 7pm</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Saturday</span>
              <span className="text-white">9am - 5pm</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Sunday</span>
              <span className="text-white">Closed</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium font-playfair text-lg mb-4 text-white">Contact</h3>
          <address className="not-italic space-y-2 text-sm">
            <p className="text-gray-400">
              123 Barber Street
              <br />
              Hairtown, HT 12345
            </p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
            <p className="text-gray-400">Email: info@zerbarbershop.com</p>
          </address>
        </div>
      </div>

      <div className="container mt-10 pt-6 border-t border-dark-border">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Zer Barber Shop. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

