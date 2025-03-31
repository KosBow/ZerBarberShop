import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CallToAction() {
  return (
    <section className="py-16 relative">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1635273051136-aa7a433e630a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
        }}
      ></div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready for a Fresh New Look?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-200">
          Book your appointment today and experience the best haircut and styling services in town.
        </p>
        <Link href="/appointment">
          <Button size="lg" variant="default">
            Book Your Appointment
          </Button>
        </Link>
      </div>
    </section>
  )
}

