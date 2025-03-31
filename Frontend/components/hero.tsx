import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      ></div>
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Professional Haircuts & Styling</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Experience the art of grooming at Zer Barber Shop. We provide premium haircuts, beard trims, and styling
            services for the modern gentleman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/appointment">
              <Button size="lg" className="w-full sm:w-auto">
                Book Appointment
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/20 hover:bg-background/30">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

